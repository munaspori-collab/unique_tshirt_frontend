// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unique-tshirt-backend.onrender.com';

function normalizeImages(imgs: any): string[] {
  if (!imgs) return [];
  const arr = Array.isArray(imgs) ? imgs : [imgs];
  return arr
    .map((it: any) => {
      const raw0 = typeof it === 'string' ? it : (it?.url || it?.src || '');
      if (!raw0) return '';
      const raw = String(raw0).trim();
      if (raw.startsWith('http') || raw.startsWith('data:')) return raw;
      // Fix Windows-style backslashes and ensure leading slash
      const cleaned = raw.replace(/\\/g, '/');
      const withSlash = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
      return `${API_BASE_URL}${withSlash}`;
    })
    .filter(Boolean);
}

function withNormalizedProductImages(p: any | null): any | null {
  if (!p) return p;
  const rawImages = p?.images ?? p?.image ?? p?.media ?? [];
  const normalized = normalizeImages(rawImages);
  return { ...p, images: normalized };
}

function normalizeProducts(json: any): any[] {
  const list = Array.isArray(json)
    ? json
    : (Array.isArray(json?.data) ? json.data : (Array.isArray(json?.products) ? json.products : []));
  return list.map((p: any) => withNormalizedProductImages(p));
}

function normalizeProduct(json: any): any | null {
  const p = Array.isArray(json)
    ? (json[0] ?? null)
    : (json?.data ?? json?.product ?? json ?? null);
  return withNormalizedProductImages(p);
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
        if (prod && (prod.slug || prod._id)) return { data: prod };
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
