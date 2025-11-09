'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
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
                href="/shop/limited"
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

          {/* Right: subtle promo card (no big t-shirt photo) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -top-6 -left-6 w-56 h-56 rounded-3xl bg-premium-highlight blur-2xl opacity-50" />
            <div className="relative bg-white rounded-3xl shadow-2xl p-10">
              <div className="text-center">
                <div className="text-6xl mb-3">👕</div>
                <p className="text-gray-900 font-serif text-xl font-bold">Premium Collection</p>
                <p className="text-sm text-gray-600 mt-1">Your style, your tone</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
