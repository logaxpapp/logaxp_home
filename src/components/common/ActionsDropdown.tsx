// src/components/common/ActionsDropdown.tsx

import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisV, FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';

interface ActionsDropdownProps {
  onEdit: () => void;
  onDelete: () => void;
  onAssign?: () => void; // 'onAssign' is now optional
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
      >
        <FaEllipsisV />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-50">
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
          >
            <FaEdit className="mr-2" />
            Edit
          </button>
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            <FaTrash className="mr-2" />
            Delete
          </button>
          {onAssign && (
            <button
              onClick={() => {
                onAssign();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
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
