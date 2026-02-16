import React, { useState, type ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from '../organisms/Sidebar';
import { SearchBar } from '../molecules/SearchBar';

interface DashboardLayoutProps {
    children: ReactNode;
    searchQuery?: string;
    onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Main layout template: renders the Sidebar on the left and
// a top header bar with a SearchBar, followed by the page content.
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, searchQuery, onSearchChange }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen w-full bg-[#f3f4f6]">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Dashboard Overview — fills remaining space after sidebar */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Header */}
                <header className="flex h-[88px] items-center justify-between bg-white px-4 md:px-[40px] py-[32px] gap-3 md:gap-[40px]">
                    {/* Hamburger menu — mobile only */}
                    <button
                        className="md:hidden text-gray-600 hover:text-gray-900"
                        onClick={() => setIsSidebarOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="hidden md:flex items-center text-sm text-gray-400 font-medium">
                        Dashboard overview
                    </div>
                    <div className="flex-1">
                        <SearchBar
                            placeholder="Search"
                            value={searchQuery}
                            onChange={onSearchChange}
                        />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};
