'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ProductCategory } from '@/types';

interface CategoryCardProps {
  name: string;
  href: string;
  emoji: string;
  description: string;
  index: number;
}

function CategoryCard({ name, href, emoji, description, index }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={href}
        className="group block bg-premium-accent hover:bg-premium-badge transition-all duration-300 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:scale-105"
      >
        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{emoji}</div>
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-700 mb-4">{description}</p>
        <div className="flex items-center text-gray-900 font-medium group-hover:translate-x-2 transition-transform">
          Shop Now
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CategoryPreview() {
  const categories = [
    {
      name: 'Men',
      href: '/shop/men',
      emoji: '👔',
      description: 'Bold and classic styles for the modern man',
    },
    {
      name: 'Women',
      href: '/shop/women',
      emoji: '👗',
      description: 'Elegant and comfortable designs for every occasion',
    },
    {
      name: 'Unisex',
      href: '/shop/unisex',
      emoji: '👕',
      description: 'Versatile styles for everyone',
    },
    {
      name: 'Limited Edition',
      href: '/shop/limited',
      emoji: '✨',
      description: 'Exclusive drops you won\'t find anywhere else',
    },
    {
      name: 'Seasonal',
      href: '/shop/seasonal',
      emoji: '🍂',
      description: 'Fresh designs for every season',
    },
  ];

  return (
    <section className="py-20 bg-premium-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Explore our curated collections designed for your unique style and comfort
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.slice(0, 3).map((category, index) => (
            <CategoryCard key={category.name} {...category} index={index} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
          {categories.slice(3).map((category, index) => (
            <CategoryCard key={category.name} {...category} index={index + 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
