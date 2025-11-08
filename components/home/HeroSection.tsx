'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative h-[90vh] min-h-[600px] bg-gradient-to-br from-premium-hover via-premium-base to-premium-accent overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-premium-badge rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-premium-highlight rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col lg:flex-row items-center justify-between h-full gap-12 py-20">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block mb-4 px-4 py-2 bg-premium-badge/30 backdrop-blur-sm rounded-full"
            >
              <span className="text-sm font-medium text-gray-700">🎉 New Season Collection</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-gray-900 mb-6 leading-tight"
            >
              Express Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-premium-badge to-gray-700">
                Unique Style
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Discover premium quality t-shirts crafted with care. From classic designs to limited editions,
              find the perfect piece that speaks to your individuality.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/shop/men"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all hover:shadow-xl hover:scale-105"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/shop/limited"
                className="inline-flex items-center justify-center px-8 py-4 bg-premium-accent text-gray-900 rounded-lg font-medium hover:bg-premium-badge transition-all hover:shadow-lg border-2 border-gray-900/10"
              >
                Limited Edition
              </Link>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">Organic Cotton</div>
              </div>
              <div className="text-center border-x border-premium-badge/30">
                <div className="text-2xl font-bold text-gray-900">5000+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.9★</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Image/Visual Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="relative w-full max-w-lg mx-auto aspect-square">
              {/* Placeholder for product image */}
              <div className="absolute inset-0 bg-premium-highlight rounded-3xl shadow-2xl transform rotate-6 transition-transform hover:rotate-3"></div>
              <div className="absolute inset-0 bg-premium-accent rounded-3xl shadow-2xl transform -rotate-6 transition-transform hover:-rotate-3"></div>
              <div className="relative z-10 w-full h-full bg-white rounded-3xl shadow-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">👕</div>
                  <p className="text-lg font-serif font-semibold text-gray-800">Premium Collection</p>
                  <p className="text-sm text-gray-600 mt-2">Your image here</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-gray-900/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-gray-900/30 rounded-full"></div>
        </motion.div>
      </motion.div>
    </section>
  );
}
