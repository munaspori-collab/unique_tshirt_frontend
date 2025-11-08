import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-premium-base pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <Shield className="w-16 h-16 mx-auto mb-4 text-gray-700" />
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-premium-accent rounded-2xl p-8 prose prose-lg max-w-none">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Information We Collect</h2>
          <p className="text-gray-700 mb-6">
            We collect information that you provide directly to us, including name, email address, shipping address, and payment information when you make a purchase through our WhatsApp-based ordering system.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">How We Use Your Information</h2>
          <p className="text-gray-700 mb-6">
            We use the information we collect to process your orders, communicate with you about your orders, send you marketing communications (with your consent), and improve our services.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Data Security</h2>
          <p className="text-gray-700 mb-6">
            We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no internet transmission is completely secure.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-700">
            If you have questions about this Privacy Policy, please contact us at privacy@uniquetshirts.com
          </p>

          <div className="mt-8 p-4 bg-premium-badge/30 rounded-lg">
            <p className="text-sm text-gray-600">
              📝 <strong>Note:</strong> This is a placeholder privacy policy. Please consult with a legal professional to create a comprehensive policy for your business.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
