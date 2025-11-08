import ClientProductRedirect from '@/components/ClientProductRedirect';

export async function generateStaticParams() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unique-tshirt-backend.onrender.com';
    // Fetch both categories to collect all slugs
    const [limitedRes, seasonalRes] = await Promise.all([
      fetch(`${API_URL}/api/products?category=limited`),
      fetch(`${API_URL}/api/products?category=seasonal`),
    ]);

    const parse = async (res: Response): Promise<any[]> => {
      if (!res.ok) return [];
      const data = await res.json();
      if (Array.isArray(data)) return data;
      if (data?.data && Array.isArray(data.data)) return data.data;
      if (data?.products && Array.isArray(data.products)) return data.products;
      return [];
    };

    const [limited, seasonal] = await Promise.all([parse(limitedRes), parse(seasonalRes)]);
    const all = [...limited, ...seasonal];
    const slugs = Array.from(new Set(all.map((p: any) => p.slug).filter(Boolean)));
    return slugs.map((slug) => ({ slug }));
  } catch (e) {
    console.error('generateStaticParams /[slug] failed:', e);
    return [];
  }
}

export default function Page({ params }: { params: { slug: string } }) {
  return <ClientProductRedirect slug={params.slug} />;
}
