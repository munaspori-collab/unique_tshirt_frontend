'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, User, Heart, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/lib/auth-context';

const categories = [
  { name: 'Limited Edition', href: '/shop/limited' },
  { name: 'Seasonal', href: '/shop/seasonal' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, login, logout, loading, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Use relative path so it works under a GitHub Pages subpath too
      window.location.href = `search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-premium-accent/95 backdrop-blur-md shadow-lg' : 'bg-premium-accent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 tracking-tight">
              Unique T-shirts
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" aria-label="Main navigation">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`text-sm font-medium transition-colors hover:text-premium-badge ${
                  pathname === category.href ? 'text-premium-badge font-semibold' : 'text-gray-700'
                }`}
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/blog"
              className={`text-sm font-medium transition-colors hover:text-premium-badge ${
                pathname === '/blog' ? 'text-premium-badge font-semibold' : 'text-gray-700'
              }`}
            >
              Blog
            </Link>
          </nav>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-premium-hover rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-premium-badge transition-all"
                aria-label="Search products"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </form>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/wishlist"
              className="hidden sm:block p-2 hover:bg-premium-hover rounded-full transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5 text-gray-700" />
            </Link>
            
            {/* User Menu */}
            {loading ? (
              <div className="hidden sm:block p-2">
                <div className="h-5 w-5 border-2 border-gray-300 border-t-premium-badge rounded-full animate-spin" />
              </div>
            ) : user ? (
              <div className="hidden sm:block relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-premium-hover rounded-full transition-colors"
                  aria-label="User menu"
                >
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="h-8 w-8 rounded-full" />
                  ) : (
                    <User className="h-5 w-5 text-gray-700" />
                  )}
                  <ChevronDown className="h-4 w-4 text-gray-700" />
                </button>
                
                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-premium-hover transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        My Account
                      </Link>
                      <Link
                        href="/wishlist"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-premium-hover transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Heart className="h-4 w-4 mr-3" />
                        Wishlist
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 transition-colors border-t border-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:block">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      const idToken = credentialResponse.credential;
                      if (!idToken) {
                        throw new Error('No credential received from Google');
                      }
                      await login(idToken);
                    } catch (error) {
                      console.error('Login failed:', error);
                      const errorMessage = error instanceof Error ? error.message : 'Login failed';
                      alert(`Authentication failed: ${errorMessage}`);
                    }
                  }}
                  onError={() => {
                    console.error('Google Sign-In failed');
                    alert('Google Sign-In failed. Please try again.');
                  }}
                  useOneTap={false}
                  theme="outline"
                  size="medium"
                  shape="pill"
                  text="signin_with"
                  logo_alignment="left"
                />
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-premium-hover rounded-full transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-64 bg-premium-accent shadow-2xl lg:hidden z-50"
          >
            <div className="flex flex-col h-full pt-20 pb-6 px-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 bg-premium-hover rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-premium-badge"
                    aria-label="Search products"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </form>

              {/* Mobile Navigation */}
              <nav className="flex-1" aria-label="Mobile navigation">
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.name}>
                      <Link
                        href={category.href}
                        className={`block py-3 px-4 rounded-lg transition-colors ${
                          pathname === category.href
                            ? 'bg-premium-badge text-white font-semibold'
                            : 'hover:bg-premium-hover text-gray-700'
                        }`}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/blog"
                      className={`block py-3 px-4 rounded-lg transition-colors ${
                        pathname === '/blog'
                          ? 'bg-premium-badge text-white font-semibold'
                          : 'hover:bg-premium-hover text-gray-700'
                      }`}
                    >
                      Blog
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Mobile User Actions */}
              <div className="border-t border-premium-hover pt-4 space-y-2">
                {user ? (
                  <>
                    <div className="px-4 py-3 bg-premium-hover rounded-lg mb-2">
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/wishlist"
                      className="flex items-center py-3 px-4 hover:bg-premium-hover rounded-lg transition-colors text-gray-700"
                    >
                      <Heart className="h-5 w-5 mr-3" />
                      Wishlist
                    </Link>
                    <Link
                      href="/account"
                      className="flex items-center py-3 px-4 hover:bg-premium-hover rounded-lg transition-colors text-gray-700"
                    >
                      <User className="h-5 w-5 mr-3" />
                      Account
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center py-3 px-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-purple-600 font-semibold"
                      >
                        <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center py-3 px-4 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="w-full">
                    <GoogleLogin
                      onSuccess={async (credentialResponse) => {
                        try {
                          const idToken = credentialResponse.credential;
                          if (!idToken) {
                            throw new Error('No credential received from Google');
                          }
                          await login(idToken);
                        } catch (error) {
                          console.error('Login failed:', error);
                          const errorMessage = error instanceof Error ? error.message : 'Login failed';
                          alert(`Authentication failed: ${errorMessage}`);
                        }
                      }}
                      onError={() => {
                        console.error('Google Sign-In failed');
                        alert('Google Sign-In failed. Please try again.');
                      }}
                      useOneTap={false}
                      theme="outline"
                      size="large"
                      shape="pill"
                      text="signin_with"
                      logo_alignment="left"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40"
          />
        )}
      </AnimatePresence>
    </header>
  );
}
