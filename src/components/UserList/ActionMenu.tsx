import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FaEdit, FaTrash, FaBan, FaCheckCircle, FaEllipsisV } from 'react-icons/fa';
import { IUser } from '../../types/user';

interface ActionMenuProps {
  user: IUser;
  onEdit: () => void;
  onSuspend: () => void;
  onReactivate: () => void;
  onDelete: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ user, onEdit, onSuspend, onReactivate, onDelete }) => (
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
      <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg focus:outline-none z-10">
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={onEdit}
              className={`${
                active ? 'bg-gray-100 dark:bg-gray-600' : ''
              } flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
            >
              <FaEdit className="mr-2" /> Edit
            </button>
          )}
        </Menu.Item>
        {user.status !== 'suspended' ? (
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onSuspend}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-600' : ''
                } flex items-center w-full px-4 py-2 text-sm text-yellow-600`}
              >
                <FaBan className="mr-2" /> Suspend
              </button>
            )}
          </Menu.Item>
        ) : (
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onReactivate}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-600' : ''
                } flex items-center w-full px-4 py-2 text-sm text-green-600`}
              >
                <FaCheckCircle className="mr-2" /> Reactivate
              </button>
            )}
          </Menu.Item>
        )}
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={onDelete}
              className={`${
                active ? 'bg-gray-100 dark:bg-gray-600' : ''
              } flex items-center w-full px-4 py-2 text-sm text-red-600`}
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Transition>
  </Menu>
);

export default ActionMenu;
