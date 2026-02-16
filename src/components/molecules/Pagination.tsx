import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../atoms/Button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    rowsPerPage: number;
    onRowsPerPageChange: (rows: number) => void;
    totalItems: number;
}

// Displays a rows-per-page selector, "start–end of total" info, and prev/next buttons.
// Controlled component: parent owns currentPage and rowsPerPage.
export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    rowsPerPage,
    onRowsPerPageChange,
    totalItems,
}) => {
    // Calculate the visible item range for the current page.
    const start = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
    const end = Math.min(currentPage * rowsPerPage, totalItems);

    return (
        <div className="flex items-center justify-end space-x-4 border-t border-gray-100 px-4 py-3 text-sm text-gray-500 bg-white">
            <span className="flex items-center gap-1">
                Rows per page:
                <select
                    value={rowsPerPage}
                    onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                    className="appearance-none bg-transparent pr-4 font-medium cursor-pointer focus:outline-none"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
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
