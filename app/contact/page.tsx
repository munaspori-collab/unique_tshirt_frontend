import Link from 'next/link';
import { ArrowLeft, Phone, User, MessageSquare } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-premium-base pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-700">We'd love to hear from you. Reach out to us through any of these channels.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-premium-accent rounded-2xl p-8">
            <User className="w-10 h-10 mb-4 text-gray-700" />
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Owner</h3>
            <p className="text-gray-700 font-semibold text-lg">Rahikul Makhtum</p>
          </div>

          <div className="bg-premium-accent rounded-2xl p-8">
            <FaWhatsapp className="w-10 h-10 mb-4 text-gray-700" />
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">WhatsApp</h3>
            <a href="https://wa.me/8801919069898" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 transition-colors text-lg">
              +880 1919-069898
            </a>
            <p className="text-sm text-gray-600 mt-2">Click to chat with us instantly!</p>
          </div>

          <div className="bg-premium-accent rounded-2xl p-8">
            <FaInstagram className="w-10 h-10 mb-4 text-gray-700" />
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Instagram</h3>
            <a href="https://instagram.com/r_m_abir71" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 transition-colors text-lg">
              @r_m_abir71
            </a>
            <p className="text-sm text-gray-600 mt-2">Follow us for updates!</p>
          </div>

          <div className="bg-premium-accent rounded-2xl p-8">
            <MessageSquare className="w-10 h-10 mb-4 text-gray-700" />
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Quick Contact</h3>
            <p className="text-gray-700">Message us on WhatsApp or Instagram for fastest response!</p>
          </div>
        </div>

        <div className="bg-premium-accent rounded-2xl p-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 text-center">Send us a Message</h2>
          <form className="space-y-4">
            <input type="text" placeholder="Your Name" className="w-full px-4 py-3 bg-premium-hover rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-badge" />
            <input type="email" placeholder="Your Email" className="w-full px-4 py-3 bg-premium-hover rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-badge" />
            <textarea placeholder="Your Message" rows={5} className="w-full px-4 py-3 bg-premium-hover rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-badge resize-none"></textarea>
            <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Send Message
            </button>
            <p className="text-sm text-gray-600 text-center">Form functionality coming soon</p>
          </form>
        </div>
      </div>
    </main>
  );
}
