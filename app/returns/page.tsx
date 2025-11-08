import Link from 'next/link';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-premium-base pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <RotateCcw className="w-16 h-16 mx-auto mb-4 text-gray-700" />
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">Return Policy</h1>
        </div>

        <div className="bg-premium-accent rounded-2xl p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">30-Day Return Window</h2>
            <p className="text-gray-700">We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in their original condition with all tags attached.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">How to Return</h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>Contact us via WhatsApp with your order ID</li>
              <li>Provide photos of the item and reason for return</li>
              <li>Receive a return authorization and shipping label</li>
              <li>Pack the item securely and ship it back</li>
              <li>Refund will be processed within 7-10 business days</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Refund Method</h2>
            <p className="text-gray-700">Refunds will be issued to the original payment method. Please allow 7-10 business days for the refund to appear in your account.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Non-Returnable Items</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Items marked as "Final Sale"</li>
              <li>Worn or washed items</li>
              <li>Items without original tags</li>
              <li>Custom or personalized orders</li>
            </ul>
          </section>

          <div className="mt-8 p-4 bg-premium-badge/30 rounded-lg">
            <p className="text-sm text-gray-600">
              💬 <strong>Questions?</strong> Contact us on WhatsApp for assistance with your return.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
