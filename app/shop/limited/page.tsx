'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api, handleApiError } from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  inStock: boolean;
  category: string;
}

export default function LimitedEditionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.getProducts('limited');
        setProducts(response.data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-premium-base pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-premium-badge/30 rounded-full">
            <Star className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium">Limited Edition</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
            Exclusive Drops
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Unique designs available for a limited time. Once they're gone, they're gone forever.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-700">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-premium-accent rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
              >
                {/* Product Image */}
                <div className="aspect-square bg-premium-hover flex items-center justify-center relative overflow-hidden">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-9xl group-hover:scale-110 transition-transform duration-300">
                      ✨
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    LIMITED
                  </div>
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">SOLD OUT</span>
                    </div>
                  )}
                </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                  <div className="flex items-center text-yellow-600">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm font-medium">4.9</span>
                  </div>
                </div>
                {product.inStock ? (
                  <Link
                    href={`/${product.slug}`}
                    className="block w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 hover:shadow-lg transition-all text-center"
                  >
                    View Details
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        )}

        {/* Coming Soon Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-premium-accent rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              More Drops Coming Soon
            </h2>
            <p className="text-gray-700 mb-6">
              Subscribe to our newsletter to get notified when new limited editions drop.
            </p>
            <Link
              href="/#newsletter"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Subscribe Now
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
