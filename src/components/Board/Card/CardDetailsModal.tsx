// src/components/Cards/CardDetailsModal.tsx

import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { ICard, ILabel } from '../../../types/task';
import { FiX } from 'react-icons/fi';
import AssignUserSection from './AssignUserSection';
import CommentSection from '../CommentSection';
import AttachmentSection from '../AttachmentSection';
import SubTaskSection from './SubTaskSection';
import TimeLogSection from './TimeLogSection';
import { useAppSelector } from '../../../app/hooks';
import { selectCurrentUser } from '../../../store/slices/authSlice';
import { IUser } from '../../../types/user';
import { useFetchAllUsersQuery } from '../../../api/usersApi';
import AssignLabel from './AssignLabel';
import { useGetLabelsByBoardQuery } from '../../../api/tasksApi';

interface CardDetailsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  card: ICard;
  boardId:string;
}

type CardTab = 'Assign' | 'Comments' | 'Attachments' | 'SubTasks' | 'TimeLogs';

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
  isOpen,
  onRequestClose,
  card,
  boardId,
}) => {
 console.log('Card Details Modal props:', card);

  // Retrieve the current user from the Redux store
  const user = useAppSelector(selectCurrentUser);
  const currentUserId = user?._id;

  // Fetch all users
  const { data, error, isLoading } = useFetchAllUsersQuery({ page: 1, limit: 1000 });

  // Fetch labels for the board associated with the card
  
  const { data: labelsData, isLoading: labelsLoading, error: labelsError } = useGetLabelsByBoardQuery(boardId);

  // Process assignees with enriched data
  const processedAssignees = card.assignees.map((assignee) => {
    // If assignee is an object with _id, extract it
    const assigneeId = typeof assignee === 'string' ? assignee : assignee._id;
         
    const user = data?.users.find((user: IUser) => user._id === assigneeId);
         
    if (!user) {
      console.warn(`User with ID ${assigneeId} not found in fetched users.`);
    }
         
    return user || { _id: assigneeId, name: 'Unknown User', email: 'N/A' };
  });

  // Local state to manage card details, including labels
  const [cardDetails, setCardDetails] = useState<ICard>(card);

  // Update local state when `card` prop changes
  useEffect(() => {
    setCardDetails(card);
  }, [card]);

  // Define a setter function that adheres to React.Dispatch<React.SetStateAction<ILabel[]>>
  const setLabels: React.Dispatch<React.SetStateAction<ILabel[]>> = (value) => {
    setCardDetails((prev) => ({
      ...prev,
      labels: typeof value === 'function' ? value(prev.labels) : value,
    }));
  };

  if (!currentUserId) {
    return (
     
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onRequestClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-30"
            leave="ease-in duration-200"
            leaveFrom="opacity-30"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto text-gray-900">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95 translate-y-4"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-4"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title as="h3" className="text-xl font-bold">
                      {card.title}
                    </Dialog.Title>
                    <button onClick={onRequestClose} className="text-gray-600 hover:text-gray-800">
                      <FiX size={24} />
                    </button>
                  </div>
                  <p className="text-center text-red-500">
                    You must be logged in to view this content.
                  </p>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
     
    );
  }

  return (
    
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onRequestClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-30"
          leave="ease-in duration-200"
          leaveFrom="opacity-30"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 opacity-75 text-gray-800" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto sidebar">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white text-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-2xl font-bold">
                    {card.title}
                  </Dialog.Title>
                  <button onClick={onRequestClose} className="text-gray-600 hover:text-gray-800">
                    <FiX size={24} />
                  </button>
                </div>
                <Tab.Group>
                  <Tab.List className="flex space-x-1 rounded bg-blue-500 p-1">
                    {['Assign', 'Comments', 'Attachments', 'SubTasks', 'TimeLogs'].map((tab) => (
                      <Tab
                        key={tab}
                        className={({ selected }) =>
                          `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                          ${selected 
                            ? 'bg-white text-blue-500 shadow-lg' 
                            : 'bg-blue-500 text-white hover:bg-blue-400 hover:text-gray-100'}`
                        }
                      >
                        {tab}
                      </Tab>
                    ))}
                  </Tab.List>
                  <Tab.Panels className="mt-2">
                    <Tab.Panel className="rounded-xl bg-white p-3 space-y-4">
                      {/* Assign User Section */}
                      {isLoading ? (
                        <p>Loading user data...</p>
                      ) : error || !data?.users ? (
                        <p className="text-red-500">Error fetching user data.</p>
                      ) : (
                        <AssignUserSection
                          cardId={cardDetails._id}
                          currentAssignees={processedAssignees}
                        />
                      )}

                      {/* Assign Label Section */}
                      {labelsLoading ? (
                        <p>Loading label data...</p>
                      ) : labelsError ? (
                        <p className="text-red-500">Error fetching label data. Please try again later.</p>
                      ) : labelsData?.length === 0 ? (
                        <p className="text-gray-500">No labels found for this board. You can create new labels in the board settings.</p>
                      ) : (
                        <AssignLabel
                          cardId={cardDetails._id}
                          boardId={boardId}
                          currentLabels={cardDetails.labels}
                          setCurrentLabels={setLabels} // Pass the compatible setter
                        />
                      )}

                    </Tab.Panel>
                    <Tab.Panel className="rounded-xl bg-white p-3">
                      <CommentSection cardId={cardDetails._id} currentUserId={currentUserId} />
                    </Tab.Panel>
                    <Tab.Panel className="rounded-xl bg-white p-3">
                      <AttachmentSection cardId={cardDetails._id} />
                    </Tab.Panel>
                    <Tab.Panel className="rounded-xl bg-white p-3">
                      <SubTaskSection card={cardDetails} />
                    </Tab.Panel>
                    <Tab.Panel className="rounded-xl bg-white p-3">
                      <TimeLogSection card={cardDetails} />
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
    
  );
};

export default CardDetailsModal;
