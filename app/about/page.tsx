import Link from 'next/link';
import { ArrowLeft, Heart, Users, Award, Leaf } from 'lucide-react';

export default function AboutPage() {
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

        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
            About Unique T-shirts
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We're passionate about creating premium quality t-shirts that let you express your unique style. Every piece is crafted with care and attention to detail.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-premium-accent rounded-2xl p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6 text-center">
            Our Story
          </h2>
          <div className="prose prose-lg max-w-3xl mx-auto text-gray-700">
            <p>
              Founded with a vision to redefine casual fashion, Unique T-shirts started as a small passion project and has grown into a beloved brand known for quality and style.
            </p>
            <p>
              We believe that what you wear should be an extension of who you are. That's why we pour our hearts into every design, ensuring each piece is as unique as the person wearing it.
            </p>
            <p>
              From sourcing sustainable materials to working with talented artists, we're committed to creating t-shirts that not only look good but also make you feel good about your choices.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-premium-accent rounded-2xl p-6 text-center">
            <Heart className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
              Passion
            </h3>
            <p className="text-gray-700 text-sm">
              Every design is created with love and dedication to quality
            </p>
          </div>

          <div className="bg-premium-accent rounded-2xl p-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
              Community
            </h3>
            <p className="text-gray-700 text-sm">
              Building connections with our customers and supporting local artists
            </p>
          </div>

          <div className="bg-premium-accent rounded-2xl p-6 text-center">
            <Award className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
              Quality
            </h3>
            <p className="text-gray-700 text-sm">
              Premium materials and craftsmanship in every single piece
            </p>
          </div>

          <div className="bg-premium-accent rounded-2xl p-6 text-center">
            <Leaf className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
              Sustainability
            </h3>
            <p className="text-gray-700 text-sm">
              Committed to eco-friendly practices and sustainable sourcing
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-premium-accent rounded-2xl p-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Join Our Journey
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Be part of a community that values quality, creativity, and self-expression through fashion.
          </p>
          <Link
            href="/shop/limited"
            className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Shop Our Collections
          </Link>
        </div>
      </div>
    </main>
  );
}
