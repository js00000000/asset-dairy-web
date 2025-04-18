import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Home, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';

const OrderConfirmationPage: React.FC = () => {
  // Generate a random order number
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8"
      >
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-success-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. We've received your order and are processing it now.
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Order Details</h2>
            <span className="text-sm text-gray-500">May 24, 2025</span>
          </div>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number</span>
              <span className="font-medium">{orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium">Credit Card (****1234)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping Method</span>
              <span className="font-medium">Standard Shipping (3-5 business days)</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-4">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">$249.98</span>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">What's Next?</h2>
          
          <div className="space-y-4">
            <div className="flex">
              <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-4">
                <Package size={20} />
              </div>
              <div>
                <h3 className="font-medium">Processing Your Order</h3>
                <p className="text-sm text-gray-600 mt-1">
                  We're preparing your items for shipping. You'll receive a confirmation when your order ships.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-4">
                <Home size={20} />
              </div>
              <div>
                <h3 className="font-medium">Delivery</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Your order should arrive within 3-5 business days. We'll send tracking information once it's available.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-4">
          <Link to="/orders">
            <Button 
              variant="outline" 
              className="mr-4"
            >
              View My Orders
            </Button>
          </Link>
          
          <Link to="/shop">
            <Button 
              variant="primary"
              rightIcon={<ChevronRight size={16} />}
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderConfirmationPage;