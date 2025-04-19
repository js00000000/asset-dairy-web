import React from 'react';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 flex flex-col gap-8">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
              Chronicle Your Life, Inspire the World
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-xl">
              Welcome to <span className="font-bold text-accent-200">Life Chronicle</span> — a vibrant community where you can share your stories, read inspiring articles, and connect with others on their journeys. Your life is a story worth telling.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/register">
                <Button variant="primary" size="lg">
                  Join Now
                </Button>
              </a>
              <a href="/explore">
                <Button variant="outline" size="lg">
                  Explore Stories
                </Button>
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 relative flex items-center justify-center">
            <img
              src="https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="People sharing stories"
              className="rounded-2xl shadow-2xl w-full max-w-lg border-4 border-white/20"
            />
            <div className="absolute bottom-6 right-6 bg-white/90 text-gray-900 p-4 rounded-lg shadow-xl max-w-xs">
              <p className="font-semibold text-lg">“Everyone has a story. Start sharing yours today.”</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Preview Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">Latest From The Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample Feed Cards */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
              <img src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Travel story" className="w-full h-48 object-cover" />
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-2">Backpacking Across Europe</h3>
                <p className="text-gray-600 flex-1">From the bustling streets of Paris to the serene Alps, follow my journey of self-discovery and adventure.</p>
                <span className="mt-4 text-sm text-blue-700 font-medium">by @adventurer</span>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
              <img src="https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Family story" className="w-full h-48 object-cover" />
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-2">A Letter to My Future Self</h3>
                <p className="text-gray-600 flex-1">Reflections, hopes, and dreams penned for tomorrow. What would you say to your future self?</p>
                <span className="mt-4 text-sm text-blue-700 font-medium">by @dreamer</span>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
              <img src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Inspiration story" className="w-full h-48 object-cover" />
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-2">How I Overcame My Fears</h3>
                <p className="text-gray-600 flex-1">A candid story of resilience and finding courage in the face of the unknown.</p>
                <span className="mt-4 text-sm text-blue-700 font-medium">by @braveheart</span>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <a href="/explore">
              <Button variant="secondary" size="lg">
                See More Stories
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;