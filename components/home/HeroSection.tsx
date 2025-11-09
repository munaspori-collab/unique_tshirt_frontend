'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function HeroSection() {
  // Right-card slideshow state
  const [images, setImages] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [limited, seasonal] = await Promise.all([
          api.getProducts('limited'),
          api.getProducts('seasonal'),
        ]);
        const combined = [...limited.data, ...seasonal.data]
          .map((p: any) => p?.images?.[0])
          .filter(Boolean);
        setImages(combined.slice(0, 10));
      } catch {
        // ignore - keep placeholder card if fetch fails
      }
    })();
  }, []);

  // autoplay every 2s (right -> left)
  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setIdx((n) => (n + 1) % images.length), 2000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <section className="relative bg-gradient-to-br from-premium-hover via-premium-base to-premium-accent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left: Heading, text, actions */}
          <div>
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-premium-badge/30 rounded-full">
              <span className="text-xs font-medium text-gray-700">New Season Collection</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-serif font-bold leading-tight text-gray-900">
              Express Your
              <br />
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">Unique Style</span>
            </h1>
            <p className="mt-4 text-gray-700 max-w-xl">
              Discover premium quality t-shirts crafted with care. From classic designs to limited editions, find the
              perfect piece that speaks to your individuality.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg"
              >
                Shop Now
              </Link>
              <Link
                href="/shop/limited"
                className="inline-flex items-center justify-center px-6 py-3 bg-premium-accent text-gray-900 rounded-xl font-medium hover:bg-premium-badge transition-all"
              >
                Limited Edition
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              <div>
                <div className="text-xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">Organic Cotton</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">5000+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">4.9★</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>
          </div>

          {/* Right: slideshow card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -top-6 -left-6 w-56 h-56 rounded-3xl bg-premium-highlight blur-2xl opacity-50" />
            <div className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-10 overflow-hidden">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-premium-hover">
                {images.length > 0 ? (
                  <motion.div
                    ref={trackRef}
                    className="flex h-full"
                    animate={{ x: `-${idx * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  >
                    {images.map((src, i) => (
                      <div key={i} className="min-w-full h-full">
                        <img src={src} alt="Product" className="w-full h-full object-contain p-6 bg-white select-none" />
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-6xl">👕</div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
