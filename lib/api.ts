// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unique-tshirt-backend.onrender.com';

function normalizeProducts(json: any): any[] {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.products)) return json.products;
  return [];
}

function normalizeProduct(json: any): any | null {
  if (Array.isArray(json)) return json[0] ?? null;
  if (json?.data) return json.data;
  if (json?.product) return json.product;
  return json ?? null;
}

// API Client
export const api = {
  // Products
  async getProducts(category?: string) {
    const url = category
      ? `${API_BASE_URL}/api/products?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/api/products`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch products');
    const json = await response.json();
    return { data: normalizeProducts(json) };
  },

  async getProduct(idOrSlug: string) {
    const response = await fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(idOrSlug)}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    const json = await response.json();
    return { data: normalizeProduct(json) };
  },

  async getProductBySlug(category: string, slug: string) {
    const response = await fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    const json = await response.json();
    return { data: normalizeProduct(json) };
  },

  // Try multiple slug endpoints and fall back to searching lists
  async getProductFlexible(slug: string) {
    const attempts = [
      `${API_BASE_URL}/api/products/${encodeURIComponent(slug)}`,
      `${API_BASE_URL}/api/products/slug/${encodeURIComponent(slug)}`,
      `${API_BASE_URL}/api/products?slug=${encodeURIComponent(slug)}`,
    ];
    for (const url of attempts) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const json = await res.json();
        const prod = normalizeProduct(json);
        if (prod && prod.slug) return { data: prod };
      } catch {}
    }
    try {
      const [limited, seasonal] = await Promise.all([
        api.getProducts('limited'),
        api.getProducts('seasonal'),
      ]);
      const all = [...limited.data, ...seasonal.data];
      const found = all.find((p: any) => p?.slug === slug) ?? null;
      return { data: found };
    } catch {
      return { data: null };
    }
  },

  // Health check
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error('Backend is unhealthy');
    return response.json();
  },
};

// Error handler
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

// Default export
export default api;
