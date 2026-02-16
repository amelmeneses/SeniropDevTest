import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/utils';

interface FilterDropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: { label: string; value: string }[];
}

// Styled select dropdown with a custom chevron icon.
// Accepts an array of {label, value} options to render.
export const FilterDropdown = React.forwardRef<HTMLSelectElement, FilterDropdownProps>(
    ({ className, options, ...props }, ref) => {
        return (
            <div className="relative inline-block w-48">
                <select
                    ref={ref}
                    className={cn(
                        'w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
                        className
                    )}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
        );
    }
);
FilterDropdown.displayName = 'FilterDropdown';
