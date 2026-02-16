import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../atoms/Input';
import { cn } from '../../utils/utils';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> { }

// Composes the Input atom with a search icon overlay.
// Forwards ref to the underlying input for external focus control.
export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
    ({ className, ...props }, ref) => {
        return (
            <div className={cn('relative', className)}>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                    ref={ref}
                    className="pl-10 bg-gray-50 border-gray-200"
                    placeholder="Search"
                    {...props}
                />
            </div>
        );
    }
);
SearchBar.displayName = 'SearchBar';
