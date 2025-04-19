import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, DollarSign, Users, Package, Plus, Settings, TrendingUp, BarChart4 } from 'lucide-react';
import { useAuthStore } from '../modules/auth/auth-store';
import Button from '../components/ui/Button';

const SellerDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  
  if (!user || user.role !== 'seller') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-6">You don't have permission to access the seller dashboard.</p>
        <Link to="/">
          <Button variant="primary">Return to Home</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Seller Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user.name}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/seller/products/new">
              <Button variant="primary" leftIcon={<Plus size={16} />}>
                Add New Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">$12,426.80</h3>
                <span className="text-xs inline-flex items-center text-success-700 bg-success-50 px-2 py-0.5 rounded-full mt-2">
                  <TrendingUp size={12} className="mr-1" />
                  12.5% increase
                </span>
              </div>
              <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                <DollarSign size={18} />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Orders</p>
                <h3 className="text-2xl font-bold mt-1">256</h3>
                <span className="text-xs inline-flex items-center text-success-700 bg-success-50 px-2 py-0.5 rounded-full mt-2">
                  <TrendingUp size={12} className="mr-1" />
                  8.2% increase
                </span>
              </div>
              <div className="h-10 w-10 bg-accent-100 rounded-full flex items-center justify-center text-accent-600">
                <ShoppingBag size={18} />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Products</p>
                <h3 className="text-2xl font-bold mt-1">48</h3>
                <span className="text-xs inline-flex items-center px-2 py-0.5 rounded-full mt-2 text-gray-600 bg-gray-100">
                  6 out of stock
                </span>
              </div>
              <div className="h-10 w-10 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600">
                <Package size={18} />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Customers</p>
                <h3 className="text-2xl font-bold mt-1">1,862</h3>
                <span className="text-xs inline-flex items-center text-success-700 bg-success-50 px-2 py-0.5 rounded-full mt-2">
                  <TrendingUp size={12} className="mr-1" />
                  24.3% increase
                </span>
              </div>
              <div className="h-10 w-10 bg-error-100 rounded-full flex items-center justify-center text-error-600">
                <Users size={18} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Recent Orders</h2>
              <Link to="/seller/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View all
              </Link>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #ORD-7890
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Emma Wilson
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    May 24, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-success-100 text-success-800">
                      Delivered
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $125.00
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #ORD-7889
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    James Johnson
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    May 23, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-warning-100 text-warning-800">
                      Processing
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $250.00
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #ORD-7888
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Sophie Taylor
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    May 22, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                      Shipped
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $89.99
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links and Revenue Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/seller/products" className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                  <Package className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-sm text-gray-700">Manage Products</span>
                </Link>
              </li>
              <li>
                <Link to="/seller/orders" className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                  <ShoppingBag className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-sm text-gray-700">View Orders</span>
                </Link>
              </li>
              <li>
                <Link to="/seller/analytics" className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                  <BarChart4 className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-sm text-gray-700">Analytics</span>
                </Link>
              </li>
              <li>
                <Link to="/seller/settings" className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                  <Settings className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-sm text-gray-700">Settings</span>
                </Link>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
            <div className="h-60 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart4 className="h-16 w-16 mx-auto text-gray-300 mb-2" />
                <p>Revenue chart would be displayed here</p>
                <p className="text-sm">Showing data from the last 30 days</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SellerDashboardPage;