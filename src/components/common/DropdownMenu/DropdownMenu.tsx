// src/components/common/DropdownMenu/DropdownMenu.tsx

import React from 'react';
import { Menu } from '@headlessui/react';
import { FaEllipsisV } from 'react-icons/fa';

interface DropdownOption {
  label: string;
  onClick: () => void;
}

interface DropdownMenuProps {
  options: DropdownOption[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ options }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="focus:outline-none p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
        <FaEllipsisV />
      </Menu.Button>
      <Menu.Items className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md z-20 focus:outline-none">
        {options.map((option, idx) => (
          <Menu.Item key={idx}>
            {({ active }) => (
              <button
                onClick={option.onClick}
                className={`${
                  active
                    ? 'bg-gray-100 dark:bg-gray-700'
                    : ''
                } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
              >
                {option.label}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};

export default DropdownMenu;
