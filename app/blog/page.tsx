import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';

export default function BlogPage() {
  const blogPosts = [
    {
      id: '1',
      title: 'The Art of T-Shirt Design',
      excerpt: 'Discover the creative process behind our unique designs and what makes each piece special.',
      author: 'Design Team',
      date: '2024-01-15',
      image: '🎨',
    },
    {
      id: '2',
      title: 'Sustainable Fashion Choices',
      excerpt: 'Learn about our commitment to eco-friendly materials and sustainable production practices.',
      author: 'Sustainability Team',
      date: '2024-01-10',
      image: '🌱',
    },
    {
      id: '3',
      title: 'Styling Tips for Every Season',
      excerpt: 'How to style your favorite t-shirts throughout the year with our expert fashion tips.',
      author: 'Fashion Editor',
      date: '2024-01-05',
      image: '✨',
    },
  ];

  return (
    <main className="min-h-screen bg-premium-base pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
            Our Blog
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Stories, style tips, and insights from the world of fashion and design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-premium-accent rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="aspect-video bg-premium-hover flex items-center justify-center">
                <div className="text-6xl">{post.image}</div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">
                  {post.title}
                </h2>
                <p className="text-gray-700 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
                <button className="w-full py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Read More
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center bg-premium-accent rounded-2xl p-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            More Content Coming Soon
          </h2>
          <p className="text-gray-700 mb-6">
            Stay tuned for more fashion insights, style guides, and behind-the-scenes stories.
          </p>
        </div>
      </div>
    </main>
  );
}
