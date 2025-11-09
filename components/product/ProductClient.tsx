"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Heart, Share2, ShoppingBag } from 'lucide-react';
import { api, handleApiError, API_BASE_URL } from '@/lib/api';
import { openWhatsAppCheckout } from '@/lib/whatsapp';
import { Size } from '@/types';
import { useParams } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: 'limited' | 'seasonal' | string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  fabricDetails?: string;
  careInstructions?: string;
}

export default function ProductClient({ slug }: { slug?: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState(0);

  const params = useParams();
  const effectiveSlug = (slug ?? (params && (params as any).slug ? String((params as any).slug) : undefined)) as string | undefined;

  useEffect(() => {
    async function fetchProduct() {
      try {
        if (!effectiveSlug) {
          setError('Product not found');
          setProduct(null);
          return;
        }
        const response = await api.getProductFlexible(effectiveSlug);
        let p = response.data as Product | null;
        // Fallback: try direct endpoint by slug
        if (!p) {
          try {
            const res = await fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(effectiveSlug)}`);
            if (res.ok) {
              const json = await res.json();
              p = (json?.data || json?.product || (Array.isArray(json) ? json[0] : json)) ?? null;
            }
          } catch {}
        }
        if (!p) {
          setProduct(null);
          setError('Product not found');
          return;
        }
        setProduct(p);
        if (p.sizes?.length > 0) setSelectedSize(p.sizes[0]);
        if (p.colors?.length > 0) setSelectedColor(p.colors[0]);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [effectiveSlug]);

  const handleBuyNow = () => {
    if (!product) return;
    openWhatsAppCheckout({
      productName: product.name,
      productId: product._id,
      size: selectedSize as Size,
      color: selectedColor,
      price: product.price,
    });
  };

  const badge = product?.category === 'limited'
    ? { text: 'LIMITED EDITION', className: 'bg-yellow-500' }
    : { text: 'SEASONAL', className: 'bg-green-500' };

  const backHref = product?.category === 'limited' ? '/shop/limited' : '/shop/seasonal';
  const backText = product?.category === 'limited' ? 'Back to Limited Edition' : 'Back to Seasonal Collection';

  if (loading) {
    return (
      <div className="min-h-screen bg-premium-base pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-700">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-premium-base pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl">
            <p>{error || 'Product not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-premium-base pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={backHref} className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {backText}
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-premium-accent rounded-2xl overflow-hidden mb-4 aspect-square"
            >
              {product.images && product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-9xl">
                  👕
                </div>
              )}
            </motion.div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-premium-badge' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`${badge.className} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                  {badge.text}
                </span>
                {!product.inStock && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    OUT OF STOCK
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                <div className="flex items-center text-yellow-600">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="ml-1 font-medium">4.9</span>
                  <span className="ml-1 text-gray-600">(reviews)</span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">{product.description}</p>

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-gray-900 text-white'
                          : 'bg-premium-accent text-gray-900 hover:bg-premium-badge'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        selectedColor === color
                          ? 'bg-gray-900 text-white'
                          : 'bg-premium-accent text-gray-900 hover:bg-premium-badge'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className={`flex-1 py-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  product.inStock
                    ? 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {product.inStock ? 'Buy Now via WhatsApp' : 'Out of Stock'}
              </button>
              <button className="p-4 bg-premium-accent rounded-lg hover:bg-premium-badge transition-colors">
                <Heart className="w-5 h-5 text-gray-700" />
              </button>
              <button className="p-4 bg-premium-accent rounded-lg hover:bg-premium-badge transition-colors">
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="border-t border-premium-accent pt-6 space-y-4">
              {product.fabricDetails && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Fabric Details</h3>
                  <p className="text-gray-700">{product.fabricDetails}</p>
                </div>
              )}
              {product.careInstructions && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Care Instructions</h3>
                  <p className="text-gray-700">{product.careInstructions}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
