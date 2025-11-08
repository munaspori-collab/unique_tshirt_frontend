import LimitedProductClient from '@/components/product/LimitedProductClient';

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unique-tshirt-backend.onrender.com';
    const res = await fetch(`${API_URL}/api/products?category=limited`);
    if (!res.ok) return [];
    const data = await res.json();

    let products: any[] = [];
    if (Array.isArray(data)) products = data;
    else if (data?.data && Array.isArray(data.data)) products = data.data;
    else if (data?.products && Array.isArray(data.products)) products = data.products;

    return products.map((p: any) => ({ slug: p.slug })).filter((p: any) => !!p.slug);
  } catch {
    return [];
  }
}

export default function Page({ params }: { params: { slug: string } }) {
  return <LimitedProductClient slug={params.slug} />;
}
