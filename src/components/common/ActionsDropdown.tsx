// src/components/common/ActionsDropdown.tsx

import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisV, FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';

interface ActionsDropdownProps {
  onEdit: () => void;
  onDelete: () => void;
  onAssign?: () => void; // 'onAssign' is optional
}

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({
  onEdit,
  onDelete,
  onAssign,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering row's onClick
    setIsOpen(!isOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
    setIsOpen(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
    setIsOpen(false);
  };

  const handleAssign = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAssign) {
      onAssign();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-2 rounded-full hover:bg-gray-200 focus:outline-none "
      >
        <FaEllipsisV className='text-blue-500'/>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 border rounded shadow-lg z-50">
          <button
            onClick={handleEdit}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700"
          >
            <FaEdit className="mr-2 text-gray-700" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <FaTrash className="mr-2" />
            Delete
          </button>
          {onAssign && (
            <button
              onClick={handleAssign}
              className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-green-500"
            >
              <FaUserPlus className="mr-2" />
              Assign
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionsDropdown;
