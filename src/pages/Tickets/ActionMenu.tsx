// src/components/Ticket/ActionMenu.tsx
import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FaEdit, FaTrash, FaEllipsisV } from 'react-icons/fa';

interface ActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onAssign: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ onEdit, onDelete, onAssign }) => (
  <Menu as="div" className="relative inline-block text-left">
    <Menu.Button className="inline-flex justify-center p-1 rounded-full hover:bg-gray-200">
      <FaEllipsisV className="text-gray-500 hover:text-gray-700" />
    </Menu.Button>
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="z-10 origin-top-right absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? 'bg-gray-100' : ''
              } flex items-center w-full px-2 py-2 text-sm text-gray-700`}
              onClick={onEdit}
            >
              <FaEdit className="mr-2" /> Edit
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? 'bg-gray-100' : ''
              } flex items-center w-full px-2 py-2 text-sm text-red-600`}
              onClick={onDelete}
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? 'bg-gray-100' : ''
              } flex items-center w-full px-2 py-2 text-sm text-blue-600`}
              onClick={onAssign}
            >
              Assign Ticket
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Transition>
  </Menu>
);

export default ActionMenu;
