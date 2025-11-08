import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Unique T-shirts - Premium Fashion',
    short_name: 'Unique T-shirts',
    description: 'Discover premium quality t-shirts crafted with care. From classic designs to limited editions, express your unique style with our curated collections.',
    start_url: '/',
    display: 'standalone',
    background_color: '#EDEDE9',
    theme_color: '#D5BDAF',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
