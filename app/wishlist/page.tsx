'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, ShoppingBag, Trash2, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { openWhatsAppCheckout, openWhatsAppBulkCheckout } from '@/lib/whatsapp';
import { Size } from '@/types';
import { API_BASE_URL } from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: 'limited' | 'seasonal';
  inStock: boolean;
  sizes?: string[];
  colors?: string[];
}

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!authLoading) {
      loadWishlist();
    }
  }, [authLoading, user]);

  const loadWishlist = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      const data = await response.json();

      const normalizeImages = (imgs: any): string[] => {
        if (!imgs) return [];
        const arr = Array.isArray(imgs) ? imgs : [imgs];
        return arr.map((it: any) => {
          const raw = typeof it === 'string' ? it : (it?.url || it?.src || '');
          if (!raw) return '';
          if (raw.startsWith('http') || raw.startsWith('data:')) return raw;
          return `${API_BASE_URL}${raw.startsWith('/') ? '' : '/'}${raw}`;
        }).filter(Boolean);
      };

      const parseList = (json: any): Product[] => {
        // Try common shapes and nested containers
        const candidates: any[] = [];
        if (Array.isArray(json)) candidates.push(json);
        if (Array.isArray(json?.wishlist)) candidates.push(json.wishlist);
        if (Array.isArray(json?.items)) candidates.push(json.items);
        if (Array.isArray(json?.data)) candidates.push(json.data);
        if (Array.isArray(json?.data?.wishlist)) candidates.push(json.data.wishlist);
        if (Array.isArray(json?.data?.items)) candidates.push(json.data.items);
        if (Array.isArray(json?.data?.data)) candidates.push(json.data.data);
        const listRaw: any[] = candidates.find((a) => Array.isArray(a)) || [];

        return listRaw.map((it: any) => {
          // Support { product: {...} } or product nested under different keys
          const p = it?.product || it?.productDetails || it?.product_data || it;
          const rawImages = p?.images ?? p?.image ?? p?.media ?? [];
          const cat = p?.category || it?.category || 'seasonal';
          const slug = p?.slug || it?.slug || p?.seoSlug || '';
          const name = p?.name || p?.title || 'Product';
          const priceNum = Number(p?.price ?? p?.amount ?? p?.mrp ?? 0) || 0;
          const inStock = Boolean((p?.inStock ?? p?.stock ?? true) !== false);

          return {
            _id: String(p?._id || p?.id || it?.productId || it?._id || slug || name),
            name,
            slug,
            price: priceNum,
            images: normalizeImages(rawImages),
            inStock,
            category: (cat as any),
          } as Product;
        });
      };

      const list = parseList(data);
      setWishlist(list);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      const data = await response.json();
      if (data.ok) {
        setWishlist(wishlist.filter((p) => p._id !== productId));
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleBuyNow = (product: Product) => {
    const productUrl = typeof window !== 'undefined' && product.slug ? `${window.location.origin}/product?slug=${encodeURIComponent(product.slug)}` : undefined;
    const imageUrl = product.images?.[0];
    openWhatsAppCheckout({
      productName: product.name,
      productId: product._id,
      size: (product.sizes?.[0] as Size) || ('M' as Size),
      color: product.colors?.[0] || 'Black',
      price: product.price,
      productUrl,
      imageUrl,
    });
  };

  const toggleSelected = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelected(new Set(wishlist.map(w => w._id)));
  };

  const clearSelection = () => setSelected(new Set());

  const handleBuySelected = () => {
    const items = wishlist.filter(w => selected.has(w._id)).map((p) => ({
      productName: p.name,
      productId: p._id,
      size: (p.sizes?.[0] as Size) || ('M' as Size),
      color: p.colors?.[0] || 'Black',
      price: p.price,
      quantity: 1,
      productUrl: typeof window !== 'undefined' && p.slug ? `${window.location.origin}/product?slug=${encodeURIComponent(p.slug)}` : undefined,
      imageUrl: p.images?.[0],
    }));
    if (items.length > 0) openWhatsAppBulkCheckout(items);
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-premium-base pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center py-20">
          <div className="h-12 w-12 border-4 border-gray-300 border-t-premium-badge rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-700">Loading wishlist...</p>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-premium-base pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <Heart className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
            Your Wishlist
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Save your favorite items and shop them later
          </p>
        </div>

        {/* Empty or not signed in */}
        {!user ? (
          <div className="max-w-2xl mx-auto text-center bg-premium-accent rounded-2xl p-12">
            <Heart className="w-20 h-20 mx-auto mb-6 text-gray-400" />
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              Sign in to save your wishlist
            </h2>
            <p className="text-gray-700 mb-8">
              Create a wishlist to save your favorite products and access them from any device.
            </p>
            <Link
              href="/account"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Sign In
            </Link>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center bg-premium-accent rounded-2xl p-12">
            <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-gray-400" />
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-700 mb-8">
              Start adding your favorite products to your wishlist
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop/limited"
                className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Browse Limited Edition
              </Link>
              <Link
                href="/shop/seasonal"
                className="px-6 py-3 bg-premium-badge text-gray-900 rounded-lg font-medium hover:bg-premium-highlight transition-colors"
              >
                Browse Seasonal
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button onClick={selectAll} className="px-3 py-2 bg-premium-accent rounded-lg text-sm hover:bg-premium-badge">Select All</button>
                <button onClick={clearSelection} className="px-3 py-2 bg-premium-accent rounded-lg text-sm hover:bg-premium-badge">Clear</button>
              </div>
              <button
                onClick={handleBuySelected}
                disabled={selected.size === 0}
                className={`px-4 py-2 rounded-lg font-medium ${selected.size > 0 ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                Buy Selected ({selected.size})
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((product) => (
                <div
                  key={product._id}
                  className="bg-premium-accent rounded-2xl overflow-hidden hover:shadow-xl transition-all relative"
                >
                  <div className="absolute top-3 left-3 z-10">
                    <input type="checkbox" checked={selected.has(product._id)} onChange={() => toggleSelected(product._id)} className="h-5 w-5" />
                  </div>
                <Link href={`/product?slug=${encodeURIComponent(product.slug)}`}>
                  <div className="aspect-square bg-premium-hover overflow-hidden">
                    {(() => {
                      const raw = (product.images && product.images[0]) || '';
                      const src = raw
                        ? (raw.startsWith('http') || raw.startsWith('data:')
                            ? raw
                            : `${API_BASE_URL}${raw.startsWith('/') ? '' : '/'}${raw}`)
                        : '';
                      return src ? (
                        <img
                          src={src}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                          {product.category === 'limited' ? '✨' : '🍂'}
                        </div>
                      );
                    })()}
                  </div>
                </Link>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                        product.category === 'limited' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}>
                      {product.category === 'limited' ? 'LIMITED' : 'SEASONAL'}
                    </span>
                    {!product.inStock && (
                      <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                        OUT OF STOCK
                      </span>
                    )}
                  </div>
                  <Link href={`/product?slug=${encodeURIComponent(product.slug)}`}>
                    <h3 className="font-serif font-semibold text-lg text-gray-900 mb-2 hover:text-premium-badge transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xl font-bold text-gray-900 mb-4">{product.price ? `₹${product.price}` : '—'}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleBuyNow(product)}
                        disabled={!product.inStock}
                        className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                          product.inStock
                            ? 'bg-gray-900 text-white hover:bg-gray-800'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product._id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
