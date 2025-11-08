'use client';

import { motion } from 'framer-motion';
import { Leaf, Shield, Truck, Heart } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Eco-Friendly Fabrics',
    description: '100% organic cotton sourced sustainably from certified farms. Good for you, great for the planet.',
  },
  {
    icon: Shield,
    title: 'Premium Quality',
    description: 'Each piece is crafted with meticulous attention to detail and undergoes rigorous quality checks.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Swift and reliable delivery to your doorstep. Track your order via WhatsApp in real-time.',
  },
  {
    icon: Heart,
    title: 'Customer Satisfaction',
    description: '5000+ happy customers with 4.9★ rating. We prioritize your comfort and style.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-premium-hover">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
            Why Choose Unique T-shirts?
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            We're committed to delivering exceptional quality, sustainability, and customer experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
            >
              <div className="mb-6 inline-flex p-4 bg-premium-badge/20 rounded-xl">
                <feature.icon className="h-8 w-8 text-gray-800" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-700 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
