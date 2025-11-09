'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, X, Image as ImageIcon, Package, DollarSign, Tag, Heart, Search as SearchIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  category: 'limited' | 'seasonal';
  images: string[];
  sizes?: string[];
  colors?: string[];
  description?: string;
  fabric?: string;
  fit?: string;
  care?: string;
  inStock: boolean;
}

interface AdminWishlistItem {
  _id: string;
  user: { id?: string; _id?: string; name?: string; email?: string; image?: string };
  product: { _id: string; name: string; images?: string[]; slug?: string; category?: string };
  createdAt?: string;
}

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);

  // Wishlist Insights
  const [wishlistItems, setWishlistItems] = useState<AdminWishlistItem[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [wishlistQuery, setWishlistQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'limited' as 'limited' | 'seasonal',
    description: '',
    fabric: '',
    fit: '',
    care: '',
    sizes: [] as string[],
    colors: [] as string[],
    inStock: true,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [loading, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      loadProducts();
      loadWishlistInsights();
    }
  }, [isAdmin]);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      console.log('Products API response:', data);
      
      // Handle different response formats
      let productsArray: Product[] = [];
      if (Array.isArray(data)) {
        productsArray = data;
      } else if (data.products && Array.isArray(data.products)) {
        productsArray = data.products;
      } else if (data.data && Array.isArray(data.data)) {
        productsArray = data.data;
      }
      
      setProducts(productsArray);
      console.log('Loaded products:', productsArray.length);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadWishlistInsights = async () => {
    try {
      setLoadingWishlist(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const headers: Record<string,string> = token ? { Authorization: `Bearer ${token}` } : {};
      // Prefer the only confirmed-working endpoint first to avoid 404 noise in logs
      const attempts = [
        `${API_BASE_URL}/api/wishlist?all=true`,
        `${API_BASE_URL}/api/admin/wishlist`,
        `${API_BASE_URL}/api/wishlist/all`,
      ];
      for (const url of attempts) {
        try {
          const res = await fetch(url, { headers });
          if (!res.ok) continue;
          const json = await res.json();
          const list = Array.isArray(json)
            ? json
            : (json.wishlist || json.items || json.data || []);
          const normalized: AdminWishlistItem[] = list.map((it: any) => ({
            _id: String(it._id || it.id || `${(it.user && (it.user._id || it.user.id || it.user.email)) || 'u'}_${(it.product && (it.product._id || it.product.id || it.product.name)) || 'p'}`),
            user: {
              id: it.user?._id || it.user?.id,
              name: it.user?.name || it.user?.fullName || it.user?.email?.split('@')[0] || 'User',
              email: it.user?.email,
              image: it.user?.image,
            },
            product: {
              _id: it.product?._id || it.product?.id,
              name: it.product?.name || 'Product',
              images: it.product?.images || [],
              slug: it.product?.slug,
              category: it.product?.category,
            },
            createdAt: it.createdAt || it.addedAt || undefined,
          }));
          setWishlistItems(normalized);
          break;
        } catch {}
      }
    } catch (e) {
      console.error('Failed to load wishlist insights', e);
      setWishlistItems([]);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length + imageUrls.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    setImageFiles([...imageFiles, ...files]);
  };

  const removeImageFile = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return imageUrls;

    setUploading(true);
    try {
      const formData = new FormData();
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) {
        alert('Authentication required');
        return imageUrls;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/images`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const uploadedUrls = data.images.map((img: { url: string }) => img.url);
      return [...imageUrls, ...uploadedUrls];
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images');
      return imageUrls;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Upload images first
    const allImageUrls = await uploadImages();
    if (allImageUrls.length === 0) {
      alert('Please add at least one image');
      return;
    }

    const productData = {
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      description: formData.description,
      fabric: formData.fabric,
      fit: formData.fit,
      care: formData.care,
      sizes: formData.sizes,
      colors: formData.colors,
      images: allImageUrls,
      inStock: formData.inStock,
    };

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) {
        alert('Authentication required');
        return;
      }

      if (editingProduct) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        });
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        });
      }

      // Reset form
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: 'limited',
      description: '',
      fabric: '',
      fit: '',
      care: '',
      sizes: [],
      colors: [],
      inStock: true,
    });
    setImageFiles([]);
    setImageUrls([]);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description || '',
      fabric: product.fabric || '',
      fit: product.fit || '',
      care: product.care || '',
      sizes: product.sizes || [],
      colors: product.colors || [],
      inStock: product.inStock,
    });
    setImageUrls(product.images);
    setImageFiles([]);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) {
        alert('Authentication required');
        return;
      }

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      loadProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product');
    }
  };

  if (loading || !isAdmin) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-premium-base to-blue-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center py-20">
          <div className="h-12 w-12 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-premium-base to-blue-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-purple-600 mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Manage your products and inventory</p>
            </div>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingProduct(null);
                resetForm();
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Product</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{products.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">In Stock</p>
                <p className="text-3xl font-bold text-green-600">
                  {products.filter(p => p.inStock).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Tag className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
                <p className="text-3xl font-bold text-red-600">
                  {products.filter(p => !p.inStock).length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <X className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'New Product'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="e.g., Premium Cotton T-Shirt"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as 'limited' | 'seasonal' })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="limited">Limited Edition</option>
                    <option value="seasonal">Seasonal</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm font-semibold text-gray-700">In Stock</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Describe your product..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Product Images * (Max 5)
                </label>
                <div className="space-y-4">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all">
                    <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 font-medium">Click to upload images</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                  {(imageUrls.length > 0 || imageFiles.length > 0) && (
                    <div className="grid grid-cols-5 gap-4">
                      {imageUrls.map((url, index) => (
                        <div key={`url-${index}`} className="relative group">
                          <img
                            src={url}
                            alt=""
                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImageUrl(index)}
                            className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {imageFiles.map((file, index) => (
                        <div key={`file-${index}`} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt=""
                            className="w-full h-24 object-cover rounded-lg border-2 border-purple-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeImageFile(index)}
                            className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Wishlist Insights */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" /> Wishlist Insights
            </h2>
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={wishlistQuery}
                onChange={(e) => setWishlistQuery(e.target.value)}
                placeholder="Filter by user or product..."
                className="w-full pl-10 pr-4 py-2 bg-premium-hover rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>

          {loadingWishlist ? (
            <div className="text-center py-10">
              <div className="h-10 w-10 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto" />
              <p className="text-gray-600 mt-3">Loading wishlist...</p>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-10">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No wishlist items yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistItems
                .filter((w) => {
                  const q = wishlistQuery.toLowerCase();
                  if (!q) return true;
                  return (
                    (w.user?.name || '').toLowerCase().includes(q) ||
                    (w.user?.email || '').toLowerCase().includes(q) ||
                    (w.product?.name || '').toLowerCase().includes(q)
                  );
                })
                .map((w) => (
                  <div key={w._id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
                    {(() => {
                      const raw = (w.product.images && w.product.images[0]) || '';
                      const src = raw
                        ? (raw.startsWith('http') || raw.startsWith('data:')
                            ? raw
                            : `${API_BASE_URL}${raw.startsWith('/') ? '' : '/'}${raw}`)
                        : '';
                      return (
                        <img
                          src={src || '/favicon.ico'}
                          alt={w.product.name}
                          className="w-14 h-14 object-cover rounded-lg border"
                        />
                      );
                    })()}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{w.product.name}</p>
                      <p className="text-xs text-gray-600 truncate">{w.user.name}{w.user.email ? ` • ${w.user.email}` : ''}</p>
                      {w.createdAt && (
                        <p className="text-[11px] text-gray-500">{new Date(w.createdAt).toLocaleString()}</p>
                      )}
                    </div>
                    {w.product.slug && (
                      <Link href={`/product?slug=${encodeURIComponent(w.product.slug)}`} className="px-3 py-1 text-xs bg-gray-900 text-white rounded-lg hover:bg-gray-800">View</Link>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Products List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">All Products</h2>
          {loadingProducts ? (
            <div className="text-center py-16">
              <div className="h-12 w-12 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto" />
              <p className="text-gray-600 mt-4">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No products yet</p>
              <p className="text-sm text-gray-500">Click "Add Product" to create your first product</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md hover:scale-[1.01] transition-all group"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-purple-300 transition-colors"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{product.name}</h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <DollarSign className="w-4 h-4" />
                        ₹{product.price}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.category === 'limited' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {product.category === 'limited' ? 'Limited Edition' : 'Seasonal'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.inStock 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
