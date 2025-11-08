import Link from 'next/link';
import { ArrowLeft, Truck } from 'lucide-react';

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-premium-base pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <Truck className="w-16 h-16 mx-auto mb-4 text-gray-700" />
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">Shipping Policy</h1>
        </div>

        <div className="bg-premium-accent rounded-2xl p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Shipping Methods</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Standard Shipping:</strong> 5-7 business days (₹99)</li>
              <li><strong>Express Shipping:</strong> 2-3 business days (₹199)</li>
              <li><strong>Free Shipping:</strong> On orders above ₹2,999</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Processing Time</h2>
            <p className="text-gray-700">Orders are typically processed within 1-2 business days. You will receive a tracking number once your order ships.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Tracking Your Order</h2>
            <p className="text-gray-700">Track your order by messaging us on WhatsApp with your order ID. We'll provide you with the latest updates on your shipment.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">International Shipping</h2>
            <p className="text-gray-700">International shipping is coming soon! Currently, we only ship within India.</p>
          </section>

          <div className="mt-8 p-4 bg-premium-badge/30 rounded-lg">
            <p className="text-sm text-gray-600">
              💡 <strong>Tip:</strong> Orders placed before 2 PM are processed the same day.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
