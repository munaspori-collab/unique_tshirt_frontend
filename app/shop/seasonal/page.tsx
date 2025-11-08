'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Leaf, Star } from 'lucide-react';

export default function SeasonalPage() {
  // Mock product data - replace with real data from database
  const products = [
    {
      id: '1',
      name: 'Autumn Leaves Collection',
      price: 1299,
      image: '🍂',
      inStock: true,
      season: 'Fall',
    },
    {
      id: '2',
      name: 'Winter Warmth Series',
      price: 1399,
      image: '❄️',
      inStock: true,
      season: 'Winter',
    },
    {
      id: '3',
      name: 'Spring Blossom Edition',
      price: 1199,
      image: '🌸',
      inStock: true,
      season: 'Spring',
    },
    {
      id: '4',
      name: 'Summer Vibes Collection',
      price: 1099,
      image: '☀️',
      inStock: true,
      season: 'Summer',
    },
  ];

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
            <Leaf className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">Seasonal Collection</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
            Fresh Seasonal Designs
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Celebrate every season with our exclusive collection designed to match the vibe of each time of year.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-premium-accent rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
            >
              {/* Product Image Placeholder */}
              <div className="aspect-square bg-premium-hover flex items-center justify-center relative overflow-hidden">
                <div className="text-8xl group-hover:scale-110 transition-transform duration-300">
                  {product.image}
                </div>
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {product.season}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                  <div className="flex items-center text-yellow-600">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm font-medium">4.8</span>
                  </div>
                </div>
                <button
                  className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 hover:shadow-lg transition-all"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Season Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid md:grid-cols-2 gap-8"
        >
          <div className="bg-premium-accent rounded-2xl p-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              Current Season
            </h2>
            <p className="text-gray-700 mb-4">
              Explore our latest fall collection featuring warm tones and cozy designs perfect for the season.
            </p>
            <div className="text-5xl mb-2">🍂</div>
            <p className="text-sm text-gray-600">Collection updates every season</p>
          </div>

          <div className="bg-premium-accent rounded-2xl p-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              Next Drop
            </h2>
            <p className="text-gray-700 mb-4">
              Winter collection coming soon! Get ready for exclusive designs that blend style with seasonal comfort.
            </p>
            <Link
              href="/#newsletter"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Get Notified
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
