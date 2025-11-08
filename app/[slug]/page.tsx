import { notFound, redirect } from 'next/navigation';

async function fetchProduct(slug: string) {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  try {
    const res = await fetch(`${base}/api/products/${encodeURIComponent(slug)}`, {
      // Let this be dynamic to always resolve newly created products
      cache: 'no-store',
    });
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

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const product = await fetchProduct(slug);

  if (!product || !product.category) {
    notFound();
  }

  // Redirect to the canonical category route used by the app
  redirect(`/shop/${product.category}/${slug}`);
}
