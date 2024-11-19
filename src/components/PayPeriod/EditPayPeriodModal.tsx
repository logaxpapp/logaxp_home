import React, { useState } from 'react';
import Modal from '../common/Feedback/Modal';
import { IPayPeriod } from '../../types/payPeriodTypes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  payPeriod: IPayPeriod | null;
  onUpdate: (id: string, startDate: string, endDate: string) => void;
}

const EditPayPeriodModal: React.FC<Props> = ({ isOpen, onClose, payPeriod, onUpdate }) => {
  const [startDate, setStartDate] = useState(payPeriod?.startDate || '');
  const [endDate, setEndDate] = useState(payPeriod?.endDate || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (payPeriod) {
      onUpdate(payPeriod._id, startDate, endDate);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
          Edit Pay Period
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="editStartDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Start Date
            </label>
            <input
              type="date"
              id="editStartDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="editEndDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              End Date
            </label>
            <input
              type="date"
              id="editEndDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditPayPeriodModal;
