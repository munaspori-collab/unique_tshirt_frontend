import Link from 'next/link';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';

export default function WishlistPage() {
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

        {/* Empty State */}
        <div className="max-w-2xl mx-auto text-center bg-premium-accent rounded-2xl p-12">
          <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-gray-400" />
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Your wishlist is empty
          </h2>
          <p className="text-gray-700 mb-8">
            Start adding your favorite products to your wishlist. Sign in to save them across devices.
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

        {/* Note about authentication */}
        <div className="mt-12 max-w-2xl mx-auto text-center">
          <p className="text-sm text-gray-600">
            💡 <strong>Tip:</strong> Sign in to sync your wishlist across all your devices
          </p>
        </div>
      </div>
    </main>
  );
}
