import React, { type ReactNode } from 'react';
import { Label } from '../atoms/Label';
import { cn } from '../../utils/utils';

interface FormFieldProps {
    label: string;
    htmlFor?: string;
    error?: string;
    children: ReactNode;
    className?: string;
    required?: boolean;
}

// Wraps any form input with a Label and optional error message.
// Renders a red asterisk when the field is required.
export const FormField: React.FC<FormFieldProps> = ({ label, htmlFor, error, children, className, required }) => {
    return (
        <div className={cn('space-y-2', className)}>
            <Label htmlFor={htmlFor} className="text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            {children}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};
