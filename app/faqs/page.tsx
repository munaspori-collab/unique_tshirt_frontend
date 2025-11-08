import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function FAQsPage() {
  const faqs = [
    { q: 'What sizes do you offer?', a: 'We offer sizes from XS to XXL. Please check our size guide for detailed measurements.' },
    { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days.' },
    { q: 'What is your return policy?', a: 'We accept returns within 30 days of purchase. Items must be unworn and in original condition.' },
    { q: 'How do I place an order?', a: 'Click "Buy Now" on any product to send us a message via WhatsApp with your order details.' },
    { q: 'Do you ship internationally?', a: 'Currently, we ship within India. International shipping coming soon!' },
    { q: 'How can I track my order?', a: 'You can track your order by messaging us on WhatsApp with your order ID.' },
  ];

  return (
    <main className="min-h-screen bg-premium-base pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-700">Find answers to common questions about our products and services</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-premium-accent rounded-2xl p-6">
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-700">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-premium-accent rounded-2xl p-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-700 mb-6">Contact us and we'll be happy to help!</p>
          <Link href="/contact" className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
