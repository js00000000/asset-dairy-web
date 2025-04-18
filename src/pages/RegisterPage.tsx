import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '../store/auth-store';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [formError, setFormError] = useState('');
  
  const { signup, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setFormError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    
    // Clear form error
    setFormError('');
    
    try {
      await signup(name, email, password, role);
      navigate('/');
    } catch (error) {
      // Error is already handled in the auth store
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <Link to="/" className="flex items-center">
            <ShoppingBag className="h-10 w-10 text-primary-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">Elite</span>
          </Link>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6 text-center text-3xl font-extrabold text-gray-900"
        >
          Create your account
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-2 text-center text-sm text-gray-600"
        >
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Full name"
              type="text"
              id="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User size={18} />}
              required
              fullWidth
            />

            <Input
              label="Email address"
              type="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={18} />}
              required
              fullWidth
            />

            <Input
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={18} />}
              helperText="Password must be at least 6 characters"
              required
              fullWidth
            />

            <Input
              label="Confirm password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock size={18} />}
              required
              fullWidth
            />

            <div>
              <label className="text-sm font-medium text-gray-700">Account type</label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div
                  className={`
                    cursor-pointer rounded-md border p-3 transition-colors
                    ${role === 'buyer' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-300 hover:bg-gray-50'}
                  `}
                  onClick={() => setRole('buyer')}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="buyer"
                      name="accountType"
                      value="buyer"
                      checked={role === 'buyer'}
                      onChange={() => setRole('buyer')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label htmlFor="buyer" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                      Buyer
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">I want to shop on Elite</p>
                </div>
                
                <div
                  className={`
                    cursor-pointer rounded-md border p-3 transition-colors
                    ${role === 'seller' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-300 hover:bg-gray-50'}
                  `}
                  onClick={() => setRole('seller')}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="seller"
                      name="accountType"
                      value="seller"
                      checked={role === 'seller'}
                      onChange={() => setRole('seller')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label htmlFor="seller" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                      Seller
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">I want to sell on Elite</p>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link to="/terms" className="font-medium text-primary-600 hover:text-primary-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-medium text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {(formError || error) && (
              <div className="rounded-md bg-error-50 p-4">
                <div className="flex">
                  <div className="text-sm text-error-700">
                    {formError || error}
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
              >
                Create account
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;