'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';

const faqs = [
  {
    category: 'Orders & Shipping',
    questions: [
      { q: 'How do I place an order?', a: 'Simply browse our collections, select your favorite product, choose your size and color, then click "Buy Now via WhatsApp". You\'ll be redirected to WhatsApp to complete your order with our team.' },
      { q: 'What are the shipping charges?', a: 'We offer free shipping on all orders above ₹999. For orders below that, a nominal shipping fee of ₹99 applies across India.' },
      { q: 'How long does delivery take?', a: 'Delivery typically takes 5-7 business days for most locations in India. Metro cities may receive orders within 3-5 days.' },
    ],
  },
  {
    category: 'Products & Sizing',
    questions: [
      { q: 'How do I choose the right size?', a: 'Each product page includes detailed size charts. If you\'re unsure, contact us on WhatsApp for personalized recommendations.' },
      { q: 'What materials are your t-shirts made from?', a: 'We use premium 100% cotton and cotton-blend fabrics that are soft, breathable, and durable.' },
      { q: 'How do I care for my t-shirts?', a: 'Machine wash cold with similar colors, tumble dry low, and avoid bleach.' },
    ],
  },
  {
    category: 'Returns & Exchanges',
    questions: [
      { q: 'What is your return policy?', a: 'We offer a 7-day return policy. If you\'re not satisfied, you can return it within 7 days of delivery for a full refund or exchange.' },
      { q: 'How do I initiate a return?', a: 'Contact us on WhatsApp with your order details. We\'ll guide you through the simple return process.' },
    ],
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-premium-base pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-700">Find answers to common questions</p>
        </div>

        <div className="space-y-8">
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="bg-premium-accent rounded-2xl p-6">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">{category.category}</h2>
              <div className="space-y-3">
                {category.questions.map((faq, qIndex) => {
                  const index = `${catIndex}-${qIndex}`;
                  const isOpen = openIndex === index;
                  return (
                    <div key={qIndex} className="border-b border-premium-hover last:border-0 pb-3">
                      <button onClick={() => setOpenIndex(isOpen ? null : index)} className="w-full flex items-center justify-between text-left py-3 hover:text-premium-badge transition-colors">
                        <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                        <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && <div className="pb-3 text-gray-700 leading-relaxed">{faq.a}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-premium-accent rounded-2xl p-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-700 mb-6">Contact us on WhatsApp and we'll be happy to help!</p>
          <Link href="/contact" className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">Contact Us</Link>
        </div>
      </div>
    </main>
  );
}
