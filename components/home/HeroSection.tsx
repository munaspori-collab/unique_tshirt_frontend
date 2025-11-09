'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  slug: string;
  images: string[];
}

export default function HeroSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Fetch products for carousel
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        if (response.ok) {
          const data = await response.json();
          // Handle different response formats
          let productsArray: Product[] = [];
          if (Array.isArray(data)) {
            productsArray = data as Product[];
          } else if (data.products && Array.isArray(data.products)) {
            productsArray = data.products as Product[];
          } else if (data.data && Array.isArray(data.data)) {
            productsArray = data.data as Product[];
          }
          // Filter products with at least one image
          setProducts(productsArray.filter((p) => p.images && p.images.length > 0));
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Prepare slides (first image of each product)
  const slides = useMemo(() => {
    return products
      .map((p) => ({ url: p.images[0], alt: p.name, slug: p.slug }))
      .filter((s) => !!s.url);
  }, [products]);

  // Autoplay every 2s, right-to-left
  useEffect(() => {
    if (slides.length <= 1) return;
    if (paused) return;
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(id);
  }, [slides.length, paused]);

  // Preload next image for smoother transition
  useEffect(() => {
    if (slides.length === 0) return;
    const next = new Image();
    next.src = slides[(currentIndex + 1) % slides.length]?.url || '';
  }, [currentIndex, slides]);

  return (
    <section className="relative bg-gradient-to-br from-premium-hover via-premium-base to-premium-accent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-gray-900">
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
              Unique T-shirts
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
            Premium fashion for everyone. Stylish, comfortable, and truly unique.
          </p>
        </div>

        <div
          className="relative rounded-2xl shadow-2xl overflow-hidden bg-white"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Carousel viewport */}
          <div className="w-full overflow-hidden">
            {/* Sliding track (moves left each slide) */}
            <motion.div
              ref={trackRef}
              className="flex"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              style={{ willChange: 'transform' }}
            >
              {loading && (
                <div className="min-w-full aspect-[16/9] sm:aspect-[21/9] bg-premium-accent animate-pulse" />
              )}
              {!loading && slides.length === 0 && (
                <div className="min-w-full aspect-[16/9] sm:aspect-[21/9] flex items-center justify-center bg-premium-accent">
                  <div className="text-center">
                    <div className="text-7xl mb-3">👕</div>
                    <p className="text-lg font-serif font-semibold text-gray-800">Premium Collection</p>
                    <p className="text-sm text-gray-600 mt-1">Your image here</p>
                  </div>
                </div>
              )}

              {slides.map((s, idx) => (
                <div key={idx} className="min-w-full aspect-[16/9] sm:aspect-[21/9] relative">
                  {/* Slide image */}
                  <img
                    src={s.url}
                    alt={s.alt}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    draggable={false}
                  />

                  {/* Soft gradient edges for polish */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/10 to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent" />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Indicators */}
          {slides.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'w-8 bg-gray-900' : 'w-2 bg-gray-900/40 hover:bg-gray-900/60'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* CTA row */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/shop/limited"
            className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
