import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    label, 
    helperText, 
    error, 
    leftIcon, 
    rightIcon, 
    fullWidth = false,
    id, 
    ...props 
  }, ref) => {
    const inputId = id || Math.random().toString(36).substring(2, 9);
    
    return (
      <div className={cn('flex flex-col', fullWidth && 'w-full')}>
        {label && (
          <label 
            htmlFor={inputId} 
            className="mb-1 text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              {leftIcon}
            </div>
          )}
          
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "block rounded-md shadow-sm border transition-colors",
              "focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
              leftIcon ? "pl-10" : "pl-4",
              rightIcon ? "pr-10" : "pr-4",
              "py-2 w-full",
              error
                ? "border-error-500 text-error-900 placeholder-error-300 focus:ring-error-500 focus:border-error-500"
                : "border-gray-300 placeholder-gray-400",
              className
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-description` : undefined}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
        
        {helperText && !error && (
          <p id={`${inputId}-description`} className="mt-1 text-xs text-gray-500">
            {helperText}
          </p>
        )}
        
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-xs text-error-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;