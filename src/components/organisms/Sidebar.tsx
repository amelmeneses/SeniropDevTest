import React from 'react';
import { LayoutDashboard, Users, FileText, BarChart, Settings, type LucideIcon } from 'lucide-react';
import { cn } from '../../utils/utils';

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    active?: boolean;
}

// Individual navigation link with icon; highlights when active.
const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active }) => {
    return (
        <div
            className={cn(
                "flex items-center space-x-3 px-6 py-3.5 text-sm font-medium transition-colors cursor-pointer",
                active ? "text-white" : "text-gray-400 hover:text-gray-200 hover:bg-sidebar-hover"
            )}
        >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
        </div>
    );
};

// Fixed vertical sidebar with logo, navigation items, and a logout button.
export const Sidebar: React.FC = () => {
    return (
        <div className="flex flex-col h-full w-48 bg-sidebar text-white">
            {/* Logo */}
            <div className="px-5 py-6">
                <div className="flex items-center space-x-2">
                    <div className="text-white flex-shrink-0">
                        <svg width="28" height="32" viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="37" cy="4" r="3.2" fill="white" />
                            <path d="M34 10 C34 10, 34 14, 30 18 C26 22, 18 24, 14 28 C10 32, 10 36, 14 40 C18 44, 26 46, 30 50 C34 54, 34 58, 34 58" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                            <path d="M30 10 C30 10, 30 14, 26 18 C22 22, 14 24, 10 28 C6 32, 6 36, 10 40 C14 44, 22 46, 26 50 C30 54, 30 58, 30 58" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                            <path d="M26 10 C26 10, 26 14, 22 18 C18 22, 10 24, 6 28 C2 32, 2 36, 6 40 C10 44, 18 46, 22 50 C26 54, 26 58, 26 58" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                            <path d="M22 10 C22 10, 22 14, 18 18 C14 22, 6 24, 2 28 C-2 32, -2 36, 2 40 C6 44, 14 46, 18 50 C22 54, 22 58, 22 58" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                            <path d="M18 10 C18 10, 18 14, 14 18 C10 22, 2 24, -2 28 C-6 32, -6 36, -2 40 C2 44, 10 46, 14 50 C18 54, 18 58, 18 58" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span className="text-lg font-semibold tracking-widest" style={{ fontFamily: "'Courier New', Courier, monospace", letterSpacing: '0.15em' }}>senirop</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-2">
                <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
                <SidebarItem icon={Users} label="User management" />
                <SidebarItem icon={FileText} label="Documents" />
                <SidebarItem icon={BarChart} label="Statistics" />
                <SidebarItem icon={Settings} label="Settings" />
            </nav>

            {/* Logout */}
            <div>
                <button className="flex items-center justify-center w-full bg-logout-bg hover:bg-logout-hover text-white text-sm font-medium px-4 py-3 transition-colors">
                    Logout
                </button>
            </div>
        </div>
    );
};
