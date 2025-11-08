'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Heart, Share2, ShoppingBag } from 'lucide-react';
import { api, handleApiError } from '@/lib/api';
import { openWhatsAppCheckout } from '@/lib/whatsapp';
import { Size } from '@/types';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  fabricDetails?: string;
  careInstructions?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await api.getProduct(slug);
        setProduct(response.data);
        // Set defaults
        if (response.data.sizes?.length > 0) setSelectedSize(response.data.sizes[0]);
        if (response.data.colors?.length > 0) setSelectedColor(response.data.colors[0]);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

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
          <Link href="/shop/seasonal" className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Seasonal Collection
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
        <Link href="/shop/seasonal" className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Seasonal Collection
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
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
                  🍂
                </div>
              )}
            </motion.div>

            {/* Image Thumbnails */}
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

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  SEASONAL
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
                  <span className="ml-1 font-medium">4.8</span>
                  <span className="ml-1 text-gray-600">(96 reviews)</span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">{product.description}</p>

            {/* Size Selection */}
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

            {/* Color Selection */}
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

            {/* Action Buttons */}
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

            {/* Product Details */}
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
