'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaInstagram, FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic here
    console.log('Newsletter subscription:', email);
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  const footerLinks = {
    shop: [
      { name: 'Limited Edition', href: '/shop/limited' },
      { name: 'Seasonal', href: '/shop/seasonal' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' },
      { name: 'FAQs', href: '/faqs' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Shipping Policy', href: '/shipping' },
      { name: 'Return Policy', href: '/returns' },
    ],
  };

  const socialLinks = [
    { icon: FaInstagram, href: 'https://instagram.com/r_m_abir71', label: 'Instagram' },
    { icon: FaWhatsapp, href: 'https://wa.me/8801919069898', label: 'WhatsApp' },
  ];

  return (
    <footer className="bg-premium-badge text-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-serif font-bold mb-4">Unique T-shirts</h2>
            <p className="text-gray-700 mb-6 max-w-md">
              Premium quality fashion that speaks to your unique style. Crafted with care, designed for comfort.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleNewsletterSubmit} className="mb-6">
              <label htmlFor="newsletter-email" className="block text-sm font-medium mb-2">
                Subscribe to our newsletter
              </label>
              <div className="flex gap-2">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 px-4 py-2 bg-premium-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-highlight"
                  aria-label="Email for newsletter"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Subscribe
                </button>
              </div>
              {isSubscribed && (
                <p className="text-sm text-green-700 mt-2">✓ Successfully subscribed!</p>
              )}
            </form>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-premium-accent hover:bg-premium-highlight rounded-full transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-premium-accent pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-start gap-3">
              <FaWhatsapp className="h-5 w-5 text-gray-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">WhatsApp</p>
                <a href="https://wa.me/8801919069898" className="text-gray-700 hover:text-gray-900">
                  +880 1919-069898
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaInstagram className="h-5 w-5 text-gray-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Instagram</p>
                <a href="https://instagram.com/r_m_abir71" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                  @r_m_abir71
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Owner</p>
                <p className="text-gray-700 font-medium">Rahikul Makhtum</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-premium-accent pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-700">
            <p>&copy; {new Date().getFullYear()} Unique T-shirts. All rights reserved.</p>
            <p className="flex items-center gap-2">
              Created by <span className="font-semibold">Rahikul Makhtum</span> with <span className="text-red-600">♥</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
