// src/components/Card/LikesModal.tsx

import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { IUser } from '../../types/user';
import { FiX } from 'react-icons/fi';

interface LikesModalProps {
  isOpen: boolean;
  onClose: () => void;
  likes: IUser[];
}

const LikesModal: React.FC<LikesModalProps> = ({ isOpen, onClose, likes }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-30"
          leave="ease-in duration-200"
          leaveFrom="opacity-30"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                    Likes
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    <FiX size={20} />
                  </button>
                </div>
                {likes.length > 0 ? (
                  <ul className="space-y-2">
                    {likes.map((user) => (
                      <li key={user._id} className="flex items-center space-x-2">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=32`}
                          alt={user.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-200">{user.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No likes yet.</p>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LikesModal;
