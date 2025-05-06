import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../lib/toast';
import { KeyRound, Mail } from 'lucide-react';
import { forgotPassword, verifyResetCode } from '@/auth/auth-api';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [stage, setStage] = useState<'email' | 'verify'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes = 180 seconds
  const navigate = useNavigate();

  const { success, error: showError } = useToast();
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const startCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    countdownRef.current = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
          }
          navigate('/login');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [navigate]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    if (stage === 'verify') {
      cleanup = startCountdown();
    }
    return () => {
      if (cleanup) cleanup();
    };
  }, [stage, startCountdown]);

  const handleSendVerificationCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPassword(email);
      success('Verification code sent to your email');
      setStage('verify');
      setTimeRemaining(180);
    } catch (err: any) {
      showError(err.message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyResetCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await verifyResetCode(email, verificationCode);
      success('Password reset successfully');
      navigate('/login');
    } catch (err: any) {
      showError(err.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {stage === 'email' ? 'Forgot Password' : 'Verify Reset Code'}
          </h2>
        </div>
        <form 
          onSubmit={stage === 'email' 
            ? handleSendVerificationCode 
            : handleVerifyResetCode
          } 
          className="mt-8 space-y-6"
        >
          {stage === 'email' ? (
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  leftIcon={<Mail />}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="verification-code" className="sr-only">Verification Code</label>
                <Input
                  id="verification-code"
                  name="verification-code"
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Verification Code"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  leftIcon={<KeyRound />}
                />
              </div>
            </div>
          )}

          <div>
            {stage === 'verify' && (
              <div className="flex items-center justify-center text-gray-600 mb-4 space-x-4">
                <span>Time Remaining: {formatTime(timeRemaining)}</span>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSendVerificationCode(e as unknown as React.FormEvent<HTMLFormElement>);
                  }}
                  className="text-indigo-600 hover:text-indigo-800 underline text-sm"
                  disabled={isLoading}
                >
                  Resend Code
                </button>
              </div>
            )}
            <Button 
              type="submit" 
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading 
                ? 'Processing...' 
                : (stage === 'email' 
                    ? 'Send Verification Code' 
                    : 'Verify Reset Code')
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;