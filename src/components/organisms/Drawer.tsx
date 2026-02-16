import React, { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/utils';

// Generic slide-in panel that opens from the right edge of the screen.
// Renders a semi-transparent backdrop, a header with close button,
// a scrollable body, and an optional footer.
interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
    width?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    width = "w-[600px]" // Default width, adjustable
}) => {
    // Prevent background scrolling while the drawer is open.
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer Panel */}
            <div className={cn("relative z-10 flex h-full flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out transform translate-x-0", width)}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 flex items-center text-sm font-medium"
                    >
                        <X className="h-4 w-4 mr-1" />
                        CLOSE
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};
