// src/components/UserList/ActionMenu.tsx

import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisV, FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import { IUser } from '../../types/user';

interface ActionMenuProps {
  user: IUser;
  onEdit: () => void;
  onSuspend: () => void;
  onReactivate: () => void;
  onDelete: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  user,
  onEdit,
  onSuspend,
  onReactivate,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling to row's onClick
    setIsOpen(!isOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
    setIsOpen(false);
  };

  const handleSuspend = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSuspend();
    setIsOpen(false);
  };

  const handleReactivate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReactivate();
    setIsOpen(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
      >
        <FaEllipsisV className='text-blue-500'/>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 border rounded shadow-lg z-50">
          <button
            onClick={handleEdit}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-yellow-700"
          >
            <FaEdit className="mr-2" />
            Edit
          </button>
          {user.status === 'Active' ? (
            <button
              onClick={handleSuspend}
              className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-amber-300"
            >
              <FaUserPlus className="mr-2" />
              Suspend
            </button>
          ) : (
            <button
              onClick={handleReactivate}
              className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <FaUserPlus className="mr-2" />
              Reactivate
            </button>
          )}
          <button
            onClick={handleDelete}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <FaTrash className="mr-2" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
