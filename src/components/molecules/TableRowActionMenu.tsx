import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Edit2, Eye, Trash2 } from 'lucide-react';
import { Button } from '../atoms/Button';

interface TableRowActionMenuProps {
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

// Dropdown action menu for table rows with View, Edit, and Delete options.
// Closes automatically when clicking outside thanks to a mousedown listener.
export const TableRowActionMenu: React.FC<TableRowActionMenuProps> = ({ onView, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close the menu when the user clicks outside of it.
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </Button>

            {isOpen && (
                <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <button
                            onClick={() => {
                                onEdit();
                                setIsOpen(false);
                            }}
                            className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <Edit2 className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                onView();
                                setIsOpen(false);
                            }}
                            className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <Eye className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                            View
                        </button>
                        <button
                            onClick={() => {
                                onDelete();
                                setIsOpen(false);
                            }}
                            className="group flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="mr-3 h-4 w-4 text-red-500 group-hover:text-red-600" />
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
