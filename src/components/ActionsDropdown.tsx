// src/components/ActionsDropdown.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  FaEllipsisV,
  FaCheckCircle,
  FaTimesCircle,
  FaPlusCircle,
  FaTrash,
} from 'react-icons/fa';
import { IApprovalRequest } from '../types/approval';
import { useAppSelector } from '../app/hooks';
import { selectCurrentUser } from '../store/slices/authSlice';

interface ActionsDropdownProps {
  request: IApprovalRequest;
  onApprove: () => void;
  onReject: () => void;
  onAddStep: () => void;
  onDelete: () => void;
}

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({
  request,
  onApprove,
  onReject,
  onAddStep,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentUser = useAppSelector(selectCurrentUser);

  // Determine if the current user is the approver
  const isApprover =
    request?.steps?.[request.current_step]?.approver?._id === currentUser?._id;

  // Close dropdown when clicking outside
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

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Actions"
      >
        <FaEllipsisV />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {/* Approve */}
            {isApprover && (
              <button
                onClick={() => {
                  onApprove();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-100 flex items-center transition-colors duration-200"
                role="menuitem"
              >
                <FaCheckCircle className="mr-2" /> Approve
              </button>
            )}

            {/* Reject */}
            {isApprover && (
              <button
                onClick={() => {
                  onReject();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100 flex items-center transition-colors duration-200"
                role="menuitem"
              >
                <FaTimesCircle className="mr-2" /> Reject
              </button>
            )}

            {/* Approve and Add Step */}
            {isApprover && (
              <button
                onClick={() => {
                  onAddStep();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-100 flex items-center transition-colors duration-200"
                role="menuitem"
              >
                <FaPlusCircle className="mr-2" /> Approve & Add Step
              </button>
            )}

            {/* Delete */}
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors duration-200"
              role="menuitem"
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionsDropdown;
