"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Heart, Share2, ShoppingBag, X } from 'lucide-react';
import { api, handleApiError, API_BASE_URL } from '@/lib/api';
import { openWhatsAppCheckout } from '@/lib/whatsapp';
import { getRatingSummary, getMyRating, setMyRating, UserRating } from '@/lib/ratings';
import { Size } from '@/types';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

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
  const defaultSizes = ['S','M','L','XL','XXL'];
  const defaultColors = ['Black','White','Blue','Red'];
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [ratingAvg, setRatingAvg] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [myRating, setMyRatingState] = useState<UserRating | undefined>(undefined);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const params = useParams();
  const effectiveSlug = (slug ?? (params && (params as any).slug ? String((params as any).slug) : undefined)) as string | undefined;
  const { user, token } = useAuth();

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
              const raw = (json?.data || json?.product || (Array.isArray(json) ? json[0] : json)) ?? null;
              if (raw) {
                const imgs = (raw.images ?? raw.image ?? raw.media ?? []);
                const arr = Array.isArray(imgs) ? imgs : [imgs];
                const normalizedImages = arr
                  .map((it: any) => {
                    const v0 = typeof it === 'string' ? it : (it?.url || it?.src || '');
                    if (!v0) return '';
                    const v = String(v0).trim();
                    if (v.startsWith('http') || v.startsWith('data:')) return v;
                    const cleaned = v.replace(/\\/g, '/');
                    const withSlash = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
                    return `${API_BASE_URL}${withSlash}`;
                  })
                  .filter(Boolean);
                p = { ...raw, images: normalizedImages } as any;
              }
            }
          } catch {}
        }
        if (!p) {
          setProduct(null);
          setError('Product not found');
          return;
        }
        setProduct(p);
        const sizes = (p.sizes && p.sizes.length > 0) ? p.sizes : defaultSizes;
        setSelectedSize(sizes[0]);
        if (p.colors && p.colors.length > 0) {
          setSelectedColor(p.colors[0]);
        } else {
          setSelectedColor('');
        }
        if (p?._id) {
          const summary = getRatingSummary(p._id);
          setRatingAvg(summary.average);
          setRatingCount(summary.count);
          setMyRatingState(getMyRating(p._id));
        }
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [effectiveSlug]);

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
      color: selectedColor || 'Default',
      price: product.price,
      productUrl,
      imageUrl,
    });
  };

  async function toggleWishlist() {
    if (!product) return;
    if (!token) {
      if (typeof window !== 'undefined') window.location.href = '/account';
      return;
    }
    try {
      if (!isWishlisted) {
        // Try POST /api/wishlist/:id then fallback to body
        let ok = false;
        try {
          const r1 = await fetch(`${API_BASE_URL}/api/wishlist/${product._id}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          });
          ok = r1.ok;
        } catch {}
        if (!ok) {
          const r2 = await fetch(`${API_BASE_URL}/api/wishlist`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId: product._id }),
          });
          ok = r2.ok;
        }
        if (ok) setIsWishlisted(true);
      } else {
        const del = await fetch(`${API_BASE_URL}/api/wishlist/${product._id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (del.ok) setIsWishlisted(false);
      }
    } catch (e) {
      console.error('Wishlist toggle failed', e);
    }
  }

  async function submitRatingBackend(stars: UserRating) {
    if (!product) return;
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      const payload = JSON.stringify({ productId: product._id, rating: stars });
      const attempts = [
        `${API_BASE_URL}/api/ratings`,
        `${API_BASE_URL}/api/products/${product._id}/rating`,
        `${API_BASE_URL}/api/products/rate`,
      ];
      for (const url of attempts) {
        try {
          const res = await fetch(url, { method: 'POST', headers, body: payload });
          if (res.ok) break;
        } catch {}
      }
    } catch {}
  }

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
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-contain p-1 bg-white" />
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
                  {ratingCount > 0 ? (
                    <>
                      <span className="ml-1 font-medium">{ratingAvg.toFixed(1)}</span>
                      <span className="ml-1 text-gray-600">({ratingCount} rating{ratingCount>1?'s':''})</span>
                    </>
                  ) : (
                    <span className="ml-1 text-gray-600">No ratings yet</span>
                  )}
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

              {product.colors?.length ? (
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
              ) : null}

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
              <button onClick={toggleWishlist} className={`p-4 rounded-lg transition-colors ${isWishlisted ? 'bg-red-100 hover:bg-red-200' : 'bg-premium-accent hover:bg-premium-badge'}`} title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
                <Heart className={`w-5 h-5 ${isWishlisted ? 'text-red-600' : 'text-gray-700'}`} />
              </button>
              <button className="p-4 bg-premium-accent rounded-lg hover:bg-premium-badge transition-colors">
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="border-t border-premium-accent pt-6 space-y-4">
              {/* Ratings */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Rate this product</h3>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((n) => (
                    <button
                      key={n}
                      aria-label={`Rate ${n} star${n>1?'s':''}`}
                      onClick={async () => {
                        if (!product?._id) return;
                        setMyRating(product._id, n as UserRating);
                        const summary = getRatingSummary(product._id);
                        setRatingAvg(summary.average);
                        setRatingCount(summary.count);
                        setMyRatingState(n as UserRating);
                        await submitRatingBackend(n as UserRating);
                      }}
                      className="p-1"
                    >
                      <Star className={`w-6 h-6 ${myRating && n <= myRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                    </button>
                  ))}
                </div>
              </div>

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
