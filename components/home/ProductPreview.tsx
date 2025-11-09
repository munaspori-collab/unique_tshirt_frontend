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
}

export default function ProductPreview() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Fetch a small featured set from both categories
        const [limitedRes, seasonalRes] = await Promise.all([
          api.getProducts("limited"),
          api.getProducts("seasonal"),
        ]);
        const limited = Array.isArray(limitedRes.data) ? limitedRes.data : [];
        const seasonal = Array.isArray(seasonalRes.data) ? seasonalRes.data : [];
        const combined = [...limited, ...seasonal]
          .filter((p) => p?.images?.[0])
          .filter((p) => !!p?.slug)
          .slice(0, 6);
        setProducts(combined);
      } catch (e) {
        setError(handleApiError(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="py-16 bg-premium-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">Product Preview</h2>
          <p className="mt-2 text-gray-700">A quick look at what’s trending now</p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-premium-accent animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl text-center">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p, idx) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="aspect-[4/3] bg-premium-hover relative overflow-hidden">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">{p.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-gray-900">₹{p.price}</span>
                    <div className="flex items-center text-yellow-600">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm font-medium">4.9</span>
                    </div>
                  </div>
                  <Link
                    href={`/${p.slug}`}
                    className="block w-full py-3 bg-gray-900 text-white rounded-lg font-medium text-center hover:bg-gray-800 hover:shadow-lg transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
