import Link from 'next/link';
import { ArrowLeft, User, Package, MapPin, Settings } from 'lucide-react';

export default function AccountPage() {
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
          <User className="w-16 h-16 mx-auto mb-4 text-gray-700" />
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
            My Account
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Manage your orders, addresses, and account settings
          </p>
        </div>

        {/* Sign In Required */}
        <div className="max-w-2xl mx-auto text-center bg-premium-accent rounded-2xl p-12 mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-premium-hover rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-gray-700" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Sign in to your account
          </h2>
          <p className="text-gray-700 mb-8">
            Access your orders, wishlist, and personalized recommendations by signing in with Google.
          </p>
          <button className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
          <p className="text-sm text-gray-600 mt-4">
            Authentication coming soon
          </p>
        </div>

        {/* Account Features Preview */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-premium-accent rounded-2xl p-6 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-700" />
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
              Order History
            </h3>
            <p className="text-sm text-gray-700">
              Track your orders and view past purchases
            </p>
          </div>

          <div className="bg-premium-accent rounded-2xl p-6 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-700" />
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
              Saved Addresses
            </h3>
            <p className="text-sm text-gray-700">
              Manage your delivery addresses
            </p>
          </div>

          <div className="bg-premium-accent rounded-2xl p-6 text-center">
            <Settings className="w-12 h-12 mx-auto mb-4 text-gray-700" />
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
              Account Settings
            </h3>
            <p className="text-sm text-gray-700">
              Update your preferences and profile
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
