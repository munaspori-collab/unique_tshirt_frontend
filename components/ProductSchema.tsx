interface ProductSchemaProps {
  name: string;
  description: string;
  image: string[];
  price: number;
  category: string;
  inStock: boolean;
  url: string;
}

export default function ProductSchema({ name, description, image, price, category, inStock, url }: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'INR',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url,
    },
    brand: {
      '@type': 'Brand',
      name: 'Unique T-shirts',
    },
    category,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
