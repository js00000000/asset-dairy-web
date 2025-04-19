import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Lock, CreditCard } from 'lucide-react';
import { useCartStore } from '../modules/cart/cart-store';
import { CartItem } from '../types';
import { useAuthStore } from '../modules/auth/auth-store';
import { formatCurrency } from '../lib/utils';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

interface CheckoutForm {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  cardName: string;
  cardNumber: string;
  expDate: string;
  cvv: string;
}

const CheckoutPage: React.FC = () => {
  const { items, subtotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CheckoutForm>({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = ['fullName', 'email', 'address', 'city', 'state', 'zip', 'cardName', 'cardNumber', 'expDate', 'cvv'];
    const isEmpty = requiredFields.some(field => !formData[field as keyof CheckoutForm].trim());
    
    if (isEmpty) {
      setFormError('Please fill in all required fields');
      return;
    }
    
    setFormError('');
    setIsSubmitting(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      clearCart();
      navigate('/order-confirmation');
    } catch (error) {
      setFormError('An error occurred during checkout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const shippingCost = 0; // Free shipping for now
  const tax = subtotal * 0.0875; // Example tax rate
  const total = subtotal + shippingCost + tax;
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="mb-6">Please sign in to continue with the checkout process.</p>
          <Link to="/login">
            <Button variant="primary" size="lg">Sign In</Button>
          </Link>
          <div className="mt-4">
            <Link to="/register" className="text-primary-600 hover:underline">
              Don't have an account? Create one
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="mb-6">Add some products to your cart before proceeding to checkout.</p>
          <Link to="/shop">
            <Button variant="primary" size="lg">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-6">
        <Link to="/cart" className="inline-flex items-center text-primary-600">
          <ChevronLeft size={16} className="mr-1" />
          Back to cart
        </Link>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:w-2/3"
        >
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    label="Street Address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="City"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                    <Input
                      label="State / Province"
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="ZIP / Postal Code"
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        required
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    label="Name on Card"
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                  <Input
                    label="Card Number"
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    required
                    fullWidth
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiration Date"
                      type="text"
                      name="expDate"
                      value={formData.expDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      required
                      fullWidth
                    />
                    <Input
                      label="CVV"
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      required
                      fullWidth
                    />
                  </div>
                </div>
              </div>
              
              {formError && (
                <div className="mt-4 rounded-md bg-error-50 p-4">
                  <div className="flex">
                    <div className="text-sm text-error-700">
                      {formError}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                  leftIcon={<Lock size={18} />}
                >
                  {isSubmitting ? 'Processing...' : 'Complete Order'}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:w-1/3"
        >
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <ul className="divide-y divide-gray-200 mb-4">
              {items.map((item: CartItem, index: number) => (
                <li key={item.id} className="py-4 flex">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3 className="text-sm line-clamp-1">{item.title}</h3>
                      <p className="ml-4">
                        {formatCurrency((item.discountedPrice || item.price) * item.quantity)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (estimated)</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-500">
              <Lock size={14} />
              <span>Secure checkout powered by Stripe</span>
            </div>
            
            <div className="mt-4 flex justify-center">
              <CreditCard size={32} className="text-gray-400 mr-2" />
              <CreditCard size={32} className="text-gray-400 mr-2" />
              <CreditCard size={32} className="text-gray-400" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;