import React from 'react';
import Modal from '../common/Feedback/Modal';
import { IShift } from '../../types/payPeriodTypes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  shifts: IShift[];
}

const ShiftsModal: React.FC<Props> = ({ isOpen, onClose, shifts }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
            Shifts Assigned
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        {shifts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow">
              <thead className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Shift Type</th>
                  <th className="py-2 px-4 border-b text-left">Date</th>
                  <th className="py-2 px-4 border-b text-left">Start Time</th>
                  <th className="py-2 px-4 border-b text-left">End Time</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift) => (
                  <tr
                    key={shift._id}
                    className="hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    <td className="py-2 px-4 border-b">{shift.shiftType}</td>
                    <td className="py-2 px-4 border-b">
                      {new Date(shift.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">{shift.startTime}</td>
                    <td className="py-2 px-4 border-b">{shift.endTime}</td>
                    <td
                      className={`py-2 px-4 border-b ${
                        shift.status === 'Completed'
                          ? 'text-green-600'
                          : shift.status === 'Pending'
                          ? 'text-yellow-500'
                          : 'text-red-600'
                      }`}
                    >
                      {shift.status}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {shift.assignedTo || 'Unassigned'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300 mt-4">
            No shifts assigned to this pay period.
          </p>
        )}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ShiftsModal;
