"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Heart, Share2, ShoppingBag, X } from 'lucide-react';
import { api, handleApiError } from '@/lib/api';
import { openWhatsAppCheckout } from '@/lib/whatsapp';
import { Size } from '@/types';
import { useAuth } from '@/lib/auth-context';
import { API_BASE_URL } from '@/lib/api';

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

export default function SeasonalProductClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const defaultSizes = ['S','M','L','XL','XXL'];
  const defaultColors = ['Black','White','Blue','Red'];
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await api.getProduct(slug);
        setProduct(response.data);
        const sizes = (response.data.sizes && response.data.sizes.length > 0) ? response.data.sizes : defaultSizes;
        const colors = (response.data.colors && response.data.colors.length > 0) ? response.data.colors : defaultColors;
        setSelectedSize(sizes[0]);
        setSelectedColor(colors[0]);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    async function checkWishlist(p: Product) {
      try {
        if (!token || !p?._id) return;
        const res = await fetch(`${API_BASE_URL}/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const list: any[] = data?.wishlist || data?.items || data?.data || (Array.isArray(data) ? data : []);
        const exists = list.some((it: any) => {
          const pid = it?.product?._id || it?.productId || it?.product || it?._id || it?.id;
          return pid && String(pid) === String(p._id);
        });
        setIsWishlisted(!!exists);
      } catch {}
    }
    if (product) checkWishlist(product);
  }, [product, token]);

  const handleBuyNow = () => {
    if (!product) return;

    const productUrl = typeof window !== 'undefined' && product.slug ? `${window.location.origin}/product?slug=${encodeURIComponent(product.slug)}` : undefined;
    const imageUrl = product.images?.[selectedImage] || product.images?.[0];
    openWhatsAppCheckout({
      productName: product.name,
      productId: product._id,
      size: selectedSize as Size,
      color: selectedColor,
      price: product.price,
      productUrl,
      imageUrl,
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
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-premium-accent rounded-2xl overflow-hidden mb-4 aspect-square cursor-zoom-in"
              onClick={() => setIsImagePreviewOpen(true)}
            >
              {product.images && product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 bg-white"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-9xl">
                  🍂
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

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {(product.sizes?.length ? product.sizes : defaultSizes).map((size) => (
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

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Color</h3>
                <div className="flex flex-wrap gap-2">
                  {(product.colors?.length ? product.colors : defaultColors).map((color) => (
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
              <button onClick={async () => {
                if (!product) return;
                if (!token) { if (typeof window !== 'undefined') window.location.href = '/account'; return; }
                try {
                  if (!isWishlisted) {
                    let ok = false;
                    try {
                      const r1 = await fetch(`${API_BASE_URL}/api/wishlist/${product._id}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
                      ok = r1.ok;
                    } catch {}
                    if (!ok) {
                      const r2 = await fetch(`${API_BASE_URL}/api/wishlist`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ productId: product._id }) });
                      ok = r2.ok;
                    }
                    if (ok) setIsWishlisted(true);
                  } else {
                    const del = await fetch(`${API_BASE_URL}/api/wishlist/${product._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                    if (del.ok) setIsWishlisted(false);
                  }
                } catch {}
              }} className={`p-4 rounded-lg transition-colors ${isWishlisted ? 'bg-red-100 hover:bg-red-200' : 'bg-premium-accent hover:bg-premium-badge'}`}>
                <Heart className={`w-5 h-5 ${isWishlisted ? 'text-red-600' : 'text-gray-700'}`} />
              </button>
              <button className="p-4 bg-premium-accent rounded-lg hover:bg-premium-badge transition-colors">
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="border-t border-premium-accent pt-6 space-y-4">
              {product.fabricDetails && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Care Details</h3>
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

      {/* Half-screen image preview */}
      {isImagePreviewOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsImagePreviewOpen(false)}
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              aria-label="Close image preview"
              className="absolute -top-10 right-0 text-white"
              onClick={() => setIsImagePreviewOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="h-[50vh] bg-white rounded-xl overflow-hidden">
              {product?.images?.[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
