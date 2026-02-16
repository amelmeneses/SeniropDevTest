import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../atoms/Button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    rowsPerPage: number;
    totalItems: number;
}

// Displays "start–end of total" info and prev/next navigation buttons.
// Controlled component: parent owns currentPage and handles onPageChange.
export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    rowsPerPage,
    totalItems,
}) => {
    // Calculate the visible item range for the current page.
    const start = (currentPage - 1) * rowsPerPage + 1;
    const end = Math.min(currentPage * rowsPerPage, totalItems);

    return (
        <div className="flex items-center justify-end space-x-4 border-t border-gray-100 px-4 py-3 text-sm text-gray-500 bg-white">
            <span>
                Rows per page: {rowsPerPage}
            </span>
            <span>
                {start}-{end} of {totalItems}
            </span>
            <div className="flex items-center space-x-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};
