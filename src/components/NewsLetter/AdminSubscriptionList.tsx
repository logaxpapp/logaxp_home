import React, { useState } from 'react';
import {
  useListSubscriptionsQuery,
  useDeleteSubscriptionMutation,
  useSuspendSubscriptionMutation,
  useConfirmSubscriptionByIdMutation,
} from '../../api/newsletterApi';
import { INewsletterSubscription } from '../../types/Newsletter';
import { useToast } from '../../features/Toast/ToastContext';
import { Dialog, Transition } from '@headlessui/react';
import Pagination from '../common/Pagination/Pagination';
import { Fragment } from 'react';

const AdminSubscriptionList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20); // Items per page

  const { data, error, isLoading, refetch } = useListSubscriptionsQuery({ page: currentPage, limit });
  const [deleteSubscription] = useDeleteSubscriptionMutation();
  const [suspendSubscription] = useSuspendSubscriptionMutation();
  const [confirmSubscriptionById] = useConfirmSubscriptionByIdMutation();
  const { showToast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [actionType, setActionType] = useState<'delete' | 'suspend' | 'confirm'>('delete');
  const [selectedSubscription, setSelectedSubscription] = useState<INewsletterSubscription | null>(null);

  const openModal = (subscription: INewsletterSubscription, action: 'delete' | 'suspend' | 'confirm') => {
    setSelectedSubscription(subscription);
    setActionType(action);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedSubscription(null);
    setActionType('delete');
    setIsOpen(false);
  };

  const handleAction = async () => {
    if (!selectedSubscription) return;

    try {
      if (actionType === 'delete') {
        await deleteSubscription(selectedSubscription._id).unwrap();
        showToast('Subscription deleted successfully.');
      } else if (actionType === 'suspend') {
        await suspendSubscription(selectedSubscription._id).unwrap();
        showToast('Subscription suspended successfully.');
      } else if (actionType === 'confirm') {
        await confirmSubscriptionById(selectedSubscription._id).unwrap();
        showToast('Subscription confirmed successfully.');
      }

      closeModal();
      refetch();
    } catch (err: any) {
      showToast(err.data?.message || 'Action failed.');
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    refetch();
  };

  if (isLoading) return <p className="text-center mt-10">Loading subscriptions...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error loading subscriptions.</p>;

  const totalPages = data?.total ? Math.ceil(data.total / limit) : 0;

  return (
    <div className="container mx-auto px-4 py-8 font-secondary">
      <h2 className="text-xl italic font-semibold mb-6">Newsletter Subscriptions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-6 bg-gray-200 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((subscription) => (
              <tr key={subscription._id} className="border-b">
                <td className="py-4 px-6 text-sm text-gray-900">{subscription.email}</td>
                <td className={`py-4 px-6 text-sm font-medium ${getStatusColor(subscription.status)}`}>
                  {subscription.status}
                </td>
                <td className="py-4 px-6 text-sm text-center">
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => openModal(subscription, 'delete')}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => openModal(subscription, 'suspend')}
                      className="text-yellow-600 hover:text-yellow-900 font-medium"
                    >
                      Suspend
                    </button>
                    <button
                      onClick={() => openModal(subscription, 'confirm')}
                      className="text-green-600 hover:text-green-900 font-medium"
                    >
                      Confirm
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center">
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </div>

      {/* Confirmation Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Confirm {actionType === 'delete' ? 'Deletion' : actionType === 'suspend' ? 'Suspension' : 'Confirmation'}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to {actionType} the subscription for{' '}
                      <span className="font-semibold">{selectedSubscription?.email}</span>? This action cannot be undone.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md hover:bg-gray-300 focus:outline-none"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white ${
                        actionType === 'delete'
                          ? 'bg-red-600 hover:bg-red-700'
                          : actionType === 'suspend'
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-green-600 hover:bg-green-700'
                      } border border-transparent rounded-md focus:outline-none`}
                      onClick={handleAction}
                    >
                      {actionType === 'delete' ? 'Delete' : actionType === 'suspend' ? 'Suspend' : 'Confirm'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Confirmed':
      return 'text-green-600';
    case 'Pending':
      return 'text-yellow-500';
    case 'Unsubscribed':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export default AdminSubscriptionList;
