import React, { useState } from 'react';
import { IPayPeriod } from '../../types/payPeriodTypes';
import {  FaDollarSign, FaEllipsisV } from 'react-icons/fa';

interface PayPeriodTableProps {
  payPeriods: IPayPeriod[];
  onEdit: (payPeriod: IPayPeriod) => void;
  onViewShifts: (shifts: any[]) => void;
  onDelete: (id: string) => void;
  onClose: (id: string) => void;
  onProcess: (id: string) => void;
}

const PayPeriodTable: React.FC<PayPeriodTableProps> = ({
  payPeriods,
  onEdit,
  onViewShifts,
  onDelete,
  onClose,
  onProcess,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setDropdownOpen((prev) => (prev === id ? null : id));
  };

  return (
    <div className="overflow-x-auto dark:text-gray-50">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md mb-20">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700 font-primary">
            <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">Start Date</th>
            <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">End Date</th>
            <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">Status</th>
            <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payPeriods.map((pp) => (
            <tr
              key={pp._id}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b"
            >
              <td className="py-3 px-4">{new Date(pp.startDate).toLocaleDateString()}</td>
              <td className="py-3 px-4">{new Date(pp.endDate).toLocaleDateString()}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded ${
                    pp.status === 'Open'
                      ? 'bg-green-100 text-green-700'
                      : pp.status === 'Closed'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {pp.status}
                </span>
              </td>
              <td className="py-3 px-4 relative">
                <button
                  onClick={() => toggleDropdown(pp._id)}
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none"
                >
                  <FaEllipsisV />
                </button>
                {dropdownOpen === pp._id && (
                  <div className="absolute right-60 top-0 mt-2 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-lg z-10">
                    <ul className="py-1 text-gray-700 dark:text-gray-300">
                      <li>
                        <button
                          onClick={() => {
                            onEdit(pp);
                            toggleDropdown(pp._id);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          Edit
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            onViewShifts(pp.shifts);
                            toggleDropdown(pp._id);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          View Shifts
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            onDelete(pp._id);
                            toggleDropdown(pp._id);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          Delete
                        </button>
                      </li>
                      {pp.status === 'Open' && (
                        <li>
                          <button
                            onClick={() => {
                              onClose(pp._id);
                              toggleDropdown(pp._id);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            Close
                          </button>
                        </li>
                      )}
                      {pp.status === 'Closed' && (
                        <li>
                          <button
                            onClick={() => {
                              onProcess(pp._id);
                              toggleDropdown(pp._id);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <FaDollarSign className="mr-2" />
                            Process Payroll
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayPeriodTable;
