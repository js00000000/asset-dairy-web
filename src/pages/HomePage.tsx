import React from 'react';
import { PiggyBank, TrendingUp, Wallet, Coins, PlusCircle, FileBarChart2, LayoutDashboard, Star, UserCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const testimonials = [
  {
    name: 'Alex Chen',
    title: 'Product Manager',

    quote: 'Asset Dairy transformed the way I track my investments and expenses. The dashboards are beautiful and intuitive!'
  },
  {
    name: 'Sophie Lee',
    title: 'Crypto Enthusiast',

    quote: 'The portfolio tracking is top-notch. I love the quick actions and the clean UI.'
  },
  {
    name: 'Michael Tan',
    title: 'Finance Blogger',

    quote: 'Finally, a finance app that looks as good as it works. Highly recommended!'
  }
];

const trustedBy = [
  { name: 'FinTech Today', icon: <Star className="w-5 h-5 text-yellow-400 inline" /> },
  { name: 'Money Matters', icon: <Star className="w-5 h-5 text-yellow-400 inline" /> },
  { name: 'CryptoWorld', icon: <Star className="w-5 h-5 text-yellow-400 inline" /> }
];

const HomePage: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 via-white to-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-blue-700 text-white pb-10 shadow-xl">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none" style={{background: 'radial-gradient(circle at 60% 30%, #60a5fa 0%, transparent 70%)'}}/>
        <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="lg:w-1/2 flex flex-col gap-8">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-8 h-8 text-white drop-shadow" />
              <span className="uppercase tracking-widest font-semibold text-blue-200">Welcome to</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-xl">
              Asset Dairy
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-xl">
              Your modern finance companion. Effortlessly log daily expenses, income, and transfers. Track your stock and crypto portfolios—all in one beautiful dashboard.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/register">
                <Button variant="primary" size="lg" className="animate-bounce shadow-xl">
                  Get Started
                </Button>
              </a>
              <a href="/login">
                <Button variant="outline" size="lg" className="hover:scale-105 transition-transform">
                  Log In
                </Button>
              </a>
            </div>
            <div className="flex items-center gap-4 mt-8">
              {trustedBy.map((org, i) => (
                <span key={org.name} className="flex items-center gap-1 text-blue-100 text-sm font-medium">
                  {org.icon} {org.name}
                  {i < trustedBy.length - 1 && <span className="mx-2 text-blue-300">|</span>}
                </span>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 relative flex items-center justify-center">
            <div className="absolute -top-8 -left-8 w-40 h-40 bg-blue-400 opacity-20 rounded-full blur-3xl z-0"/>
            <img
              src="https://images.pexels.com/photos/4386375/pexels-photo-4386375.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Finance dashboard preview"
              className="rounded-2xl shadow-2xl w-full max-w-lg border-4 border-white/20 relative z-10"
            />
            <div className="absolute bottom-6 right-6 bg-white/90 text-gray-900 p-4 rounded-lg shadow-xl max-w-xs z-20 animate-fade-in">
              <p className="font-semibold text-lg">“Take control of your finances and investments.”</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-900 to-transparent pointer-events-none"/>
      </section>

      {/* Quick Actions */}
      <section className="container mx-auto px-4 -mt-16 mb-8 z-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="/assets" className="group bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:bg-blue-50 transition-all border border-blue-100">
            <PlusCircle className="w-10 h-10 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-lg font-semibold">Add Asset</span>
            <span className="text-gray-500 text-sm mt-1">Track a new asset or holding</span>
          </a>
          <a href="/trades" className="group bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:bg-green-50 transition-all border border-green-100">
            <FileBarChart2 className="w-10 h-10 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-lg font-semibold">Log Trade</span>
            <span className="text-gray-500 text-sm mt-1">Record a buy, sell, or transfer</span>
          </a>
          <a href="/portfolio" className="group bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:bg-purple-50 transition-all border border-purple-100">
            <LayoutDashboard className="w-10 h-10 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-lg font-semibold">View Portfolio</span>
            <span className="text-gray-500 text-sm mt-1">See your portfolio at a glance</span>
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Why Asset Dairy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center gap-4 animate-fade-in-up delay-100">
              <Wallet className="w-10 h-10 text-blue-700 mb-2" />
              <h3 className="text-xl font-semibold">Daily Logging</h3>
              <p className="text-gray-600">Log expenses, income, and transfers with just a few clicks. Stay on top of your cash flow every day.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center gap-4 animate-fade-in-up delay-200">
              <PiggyBank className="w-10 h-10 text-green-600 mb-2" />
              <h3 className="text-xl font-semibold">Account Setup</h3>
              <p className="text-gray-600">Easy onboarding and secure account management. Your data, always protected.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center gap-4 animate-fade-in-up delay-300">
              <TrendingUp className="w-10 h-10 text-purple-700 mb-2" />
              <h3 className="text-xl font-semibold">Portfolio Tracking</h3>
              <p className="text-gray-600">Monitor your stock and crypto portfolio. Visualize performance and allocation.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center gap-4 animate-fade-in-up delay-400">
              <Coins className="w-10 h-10 text-yellow-600 mb-2" />
              <h3 className="text-xl font-semibold">Trade History</h3>
              <p className="text-gray-600">Detailed record of all your financial activity. Filter, search, and export anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-blue-900">What Users Say</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-blue-50 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center gap-4 flex-1 animate-fade-in-up delay-100">
                <span className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 border-4 border-blue-200 shadow-md mb-2">
                  <UserCircle className="w-8 h-8 text-blue-400" />
                </span>
                <p className="text-lg italic text-blue-900 mb-2">“{t.quote}”</p>
                <span className="font-semibold text-blue-800">{t.name}</span>
                <span className="text-blue-400 text-sm">{t.title}</span>
              </div>
            ))}
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