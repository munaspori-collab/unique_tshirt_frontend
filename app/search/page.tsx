'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: 'limited' | 'seasonal';
  inStock: boolean;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Keep local state in sync with URL param
  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, products, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const [limited, seasonal] = await Promise.all([
        api.getProducts('limited'),
        api.getProducts('seasonal'),
      ]);
      setProducts([...(limited.data || []), ...(seasonal.data || [])]);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerQuery) ||
          product.description?.toLowerCase().includes(lowerQuery) ||
          product.category.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL param for shareability
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (searchQuery) url.searchParams.set('q', searchQuery); else url.searchParams.delete('q');
      window.history.replaceState({}, '', url.toString());
    }
    filterProducts();
  };

  return (
    <main className="min-h-screen bg-premium-base pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
            Search Products
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-2xl">
              <input
                type="text"
                placeholder="Search for t-shirts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-14 bg-white border-2 border-premium-accent rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-premium-badge transition-all"
                autoFocus
              />
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-premium-badge text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Category Filter */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-premium-accent text-gray-700 hover:bg-premium-badge'
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => setSelectedCategory('limited')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === 'limited'
                  ? 'bg-gray-900 text-white'
                  : 'bg-premium-accent text-gray-700 hover:bg-premium-badge'
              }`}
            >
              Limited Edition
            </button>
            <button
              onClick={() => setSelectedCategory('seasonal')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === 'seasonal'
                  ? 'bg-gray-900 text-white'
                  : 'bg-premium-accent text-gray-700 hover:bg-premium-badge'
              }`}
            >
              Seasonal
            </button>
          </div>
        </div>

        {/* Local Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-700">Searching...</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-700">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <SearchIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                  No products found
                </h2>
                <p className="text-gray-700 mb-6">
                  Try adjusting your search, browse all products, or search on Google.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link
                    href="/shop"
                    className="inline-block px-6 py-3 bg-premium-badge text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                  >
                    Browse All Products
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {filteredProducts.filter((p)=>!!p.slug).map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link
                      href={`/product?slug=${encodeURIComponent(product.slug)}`}
                      className="group block bg-premium-accent rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="aspect-square bg-premium-hover overflow-hidden">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">
                            {product.category === 'limited' ? '✨' : '🍂'}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                              product.category === 'limited' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                          >
                            {product.category === 'limited' ? 'LIMITED' : 'SEASONAL'}
                          </span>
                          {!product.inStock && (
                            <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                              OUT OF STOCK
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif font-semibold text-lg text-gray-900 mb-2 group-hover:text-premium-badge transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xl font-bold text-gray-900">₹{product.price}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-premium-base pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-700">Loading search...</p>
        </div>
      </main>
    }>
      <SearchContent />
    </Suspense>
  );
}
