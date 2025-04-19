import React from 'react';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4 py-20">
      <div className="max-w-lg text-center">
        <h1 className="text-7xl font-extrabold text-blue-700 mb-4 drop-shadow-lg">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          Oops! The page you’re looking for doesn’t exist or has been moved.<br />
          Let’s get you back to something inspiring.
        </p>
        <a href="/">
          <Button variant="primary" size="lg">Go Home</Button>
        </a>
      </div>
      <img
        src="https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=800"
        alt="Lost in the clouds"
        className="mt-12 rounded-xl shadow-2xl w-full max-w-md border-4 border-white/20"
      />
    </div>
  );
};

export default NotFoundPage;
