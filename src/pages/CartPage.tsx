import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { useCartStore } from '../modules/cart/cart-store';
import { formatCurrency } from '../lib/utils';
import Button from '../components/ui/Button';

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCartStore();
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
            <div className="text-gray-500 mb-6">
              <svg
                className="w-16 h-16 mx-auto text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="mt-4 text-lg font-medium">Your cart is empty</p>
              <p className="mt-1 text-gray-500">Looks like you haven't added any products to your cart yet.</p>
            </div>
            <Link to="/shop">
              <Button variant="primary" size="lg" fullWidth>
                Browse Products
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const shippingCost = 0; // Free shipping for now
  const total = subtotal + shippingCost;

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <Link to="/shop" className="inline-flex items-center text-primary-600 mt-2">
            <ChevronLeft size={16} className="mr-1" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Cart Items ({items.length})</h2>
                  <button
                    onClick={() => clearCart()}
                    className="text-sm text-gray-500 hover:text-error-600 transition-colors flex items-center"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Clear cart
                  </button>
                </div>
              </div>

              <ul>
                {items.map((item) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-center">
                      <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-base font-medium text-gray-900">
                              <Link to={`/products/${item.productId}`}>{item.title}</Link>
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-base font-medium text-gray-900">
                              {formatCurrency(
                                (item.discountedPrice || item.price) * item.quantity
                              )}
                            </p>
                            {item.discountedPrice && (
                              <p className="mt-1 text-sm text-gray-500 line-through">
                                {formatCurrency(item.price * item.quantity)}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center border rounded-md">
                            <button
                              type="button"
                              className="p-2 text-gray-600 hover:text-gray-800"
                              onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4 py-2 text-gray-900">{item.quantity}</span>
                            <button
                              type="button"
                              className="p-2 text-gray-600 hover:text-gray-800"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <button
                            type="button"
                            className="text-sm text-gray-500 hover:text-error-600 transition-colors flex items-center"
                            onClick={() => removeItem(item.productId)}
                          >
                            <Trash2 size={16} className="mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="mt-6">
                <Link to="/checkout">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    rightIcon={<CreditCard size={18} />}
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By proceeding to checkout, you agree to our{' '}
                  <Link to="/terms" className="text-primary-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CartPage;