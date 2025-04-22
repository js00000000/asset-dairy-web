import React from 'react';
import { PiggyBank, TrendingUp, Wallet, Coins } from 'lucide-react';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 flex flex-col gap-8">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
              Asset Dairy
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-xl">
              Your modern finance companion. Effortlessly log daily expenses, income, and transfers. Track your stock and crypto portfolios—all in one beautiful dashboard.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/register">
                <Button variant="primary" size="lg">
                  Get Started
                </Button>
              </a>
              <a href="/login">
                <Button variant="outline" size="lg">
                  Log In
                </Button>
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 relative flex items-center justify-center">
            <img
              src="https://images.pexels.com/photos/4386375/pexels-photo-4386375.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Finance dashboard preview"
              className="rounded-2xl shadow-2xl w-full max-w-lg border-4 border-white/20"
            />
            <div className="absolute bottom-6 right-6 bg-white/90 text-gray-900 p-4 rounded-lg shadow-xl max-w-xs">
              <p className="font-semibold text-lg">“Take control of your finances and investments.”</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">Why Asset Dairy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center gap-4">
              <Wallet className="w-10 h-10 text-blue-700 mb-2" />
              <h3 className="text-xl font-semibold">Daily Logging</h3>
              <p className="text-gray-600">Log expenses, income, and transfers with just a few clicks. Stay on top of your cash flow every day.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center gap-4">
              <PiggyBank className="w-10 h-10 text-green-600 mb-2" />
              <h3 className="text-xl font-semibold">Account Setup</h3>
              <p className="text-gray-600">Easy onboarding and secure account management. Your data, always protected.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center gap-4">
              <TrendingUp className="w-10 h-10 text-purple-700 mb-2" />
              <h3 className="text-xl font-semibold">Portfolio Tracking</h3>
              <p className="text-gray-600">Monitor your stock and crypto portfolio. Visualize performance and allocation.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center gap-4">
              <Coins className="w-10 h-10 text-yellow-600 mb-2" />
              <h3 className="text-xl font-semibold">Transaction History</h3>
              <p className="text-gray-600">Detailed record of all your financial activity. Filter, search, and export anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 flex flex-col gap-6">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">See Your Finances at a Glance</h2>
            <ul className="space-y-3 text-lg text-gray-700">
              <li>• Beautiful dashboards for spending, income, and portfolio value</li>
              <li>• Real-time charts and insights</li>
              <li>• Secure, cloud-based access from anywhere</li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="/register">
                <Button variant="primary" size="md">Create Account</Button>
              </a>
              <a href="/login">
                <Button variant="secondary" size="md">Demo Login</Button>
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex items-center justify-center">
            <img
              src="https://images.pexels.com/photos/6693657/pexels-photo-6693657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Dashboard preview"
              className="rounded-2xl shadow-2xl w-full max-w-md border-4 border-blue-100"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;