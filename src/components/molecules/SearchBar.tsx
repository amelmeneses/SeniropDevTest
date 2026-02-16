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
                <Search className="absolute left-[15px] top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                    ref={ref}
                    id="search"
                    name="search"
                    className="h-[40px] w-full rounded-[4px] border border-[#E2E8F0] bg-white pl-[47px] pr-[15px] py-[10px] placeholder:text-gray-400"
                    placeholder="Search"
                    aria-label="Search"
                    {...props}
                />
            </div>
        );
    }
);
SearchBar.displayName = 'SearchBar';
