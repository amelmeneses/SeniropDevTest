import React from 'react';
import { cn } from '../../utils/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

// Base text input atom with consistent styling and focus ring.
// Forwards ref for form library integration and programmatic focus.
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
                    error
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-primary',
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = 'Input';
