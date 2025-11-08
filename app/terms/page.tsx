import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-premium-base pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-700" />
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-premium-accent rounded-2xl p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Acceptance of Terms</h2>
            <p className="text-gray-700">By accessing and using this website, you accept and agree to be bound by the terms and conditions of this agreement.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Orders and Payment</h2>
            <p className="text-gray-700">All orders are processed through our WhatsApp-based system. Payment terms and methods will be communicated during the order process.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Intellectual Property</h2>
            <p className="text-gray-700">All content on this site, including designs, logos, and text, is the property of Unique T-shirts and protected by copyright laws.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Limitation of Liability</h2>
            <p className="text-gray-700">We shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>
          </section>

          <div className="mt-8 p-4 bg-premium-badge/30 rounded-lg">
            <p className="text-sm text-gray-600">
              📝 <strong>Note:</strong> This is a placeholder terms of service. Please consult with a legal professional to create comprehensive terms for your business.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
