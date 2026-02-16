import React, { type ReactNode } from 'react';
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
    return (
        <div className="flex h-screen w-full bg-[#f3f4f6]">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Header */}
                <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-[#f9f9f9] px-6">
                    <div className="flex items-center text-sm text-gray-400 font-medium">
                        Dashboard overview
                    </div>
                    <div className="w-80">
                        <SearchBar
                            placeholder="Search"
                            value={searchQuery}
                            onChange={onSearchChange}
                        />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};
