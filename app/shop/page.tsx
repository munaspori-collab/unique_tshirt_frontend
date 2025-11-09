"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { api, handleApiError } from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  inStock: boolean;
  category?: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [limited, seasonal] = await Promise.all([
          api.getProducts("limited"),
          api.getProducts("seasonal"),
        ]);
        const combined = [...limited.data, ...seasonal.data].filter((p: any) => !!p?.slug);
        setProducts(combined);
      } catch (e) {
        setError(handleApiError(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-premium-base pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900">All Products</h1>
          <p className="mt-2 text-gray-700">Browse the full catalog across categories</p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-700">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl text-center">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="aspect-square bg-premium-hover flex items-center justify-center relative overflow-hidden">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-6xl">👕</div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                    <div className="flex items-center text-yellow-600">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm font-medium">4.9</span>
                    </div>
                  </div>
                  <Link
                    href={`/${product.slug}`}
                    className="block w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 hover:shadow-lg transition-all text-center"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
