// Generate static params for all limited edition products
export async function generateStaticParams() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unique-tshirt-backend.onrender.com';
    const response = await fetch(`${API_URL}/api/products?category=limited`, {
      cache: 'no-store'
    });
    const data = await response.json();
    
    // Handle different response formats
    let products: any[] = [];
    if (Array.isArray(data)) {
      products = data;
    } else if (data.products && Array.isArray(data.products)) {
      products = data.products;
    } else if (data.data && Array.isArray(data.data)) {
      products = data.data;
    }
    
    // Filter for limited category and map to slugs
    return products
      .filter((product: any) => product.category === 'limited')
      .map((product: any) => ({
        slug: product.slug,
      }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return empty array to allow dynamic fallback
    return [];
  }
}

export default function LimitedProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
