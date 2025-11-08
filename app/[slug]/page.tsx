'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

async function fetchProductClient(slug: string) {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  try {
    const res = await fetch(`${base}/api/products/${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data)) return data[0] ?? null;
    if (data?.data) return data.data;
    if (data?.product) return data.product;
    return null;
  } catch {
    return null;
  }
}

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const [status, setStatus] = useState<'loading' | 'notfound'>('loading');

  useEffect(() => {
    let mounted = true;
    (async () => {
      const product = await fetchProductClient(slug);
      if (!mounted) return;
      if (product?.category) {
        router.replace(`/shop/${product.category}/${slug}`);
      } else {
        setStatus('notfound');
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router, slug]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-premium-base pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-premium-base pt-24 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-800 text-lg font-medium">Product not found</p>
      </div>
    </div>
  );
}
