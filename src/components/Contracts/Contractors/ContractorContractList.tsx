// src/components/Admin/Contracts/ContractorContractList.tsx

import React, { useState } from 'react';
import {
  useAcceptContractMutation,
  useDeclineContractMutation,
} from '../../../api/contractApi';
import Pagination from '../../common/Pagination/Pagination';
import Button from '../../common/Button';
import ConfirmationModal from './ConfirmationModal';
import { Link } from 'react-router-dom';
import { IContract } from '../../../types/contractTypes';
import { useToast } from '../../../features/Toast/ToastContext';
import { FaEllipsisV, FaEye } from 'react-icons/fa';

interface ContractorContractListProps {
  contracts: IContract[];
}

const ContractorContractList: React.FC<ContractorContractListProps> = ({
  contracts,
}) => {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'Accept' | 'Decline' | null>(
    null
  );
  const [selectedContractId, setSelectedContractId] = useState<string | null>(
    null
  );
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const limit = 10;
  const skip = (page - 1) * limit;

  const { showToast } = useToast();
  const [acceptContract] = useAcceptContractMutation();
  const [declineContract] = useDeclineContractMutation();

  const handleActionClick = (action: 'Accept' | 'Decline', id: string) => {
    setModalAction(action);
    setSelectedContractId(id);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedContractId || !modalAction) return;
    try {
      if (modalAction === 'Accept') {
        await acceptContract(selectedContractId).unwrap();
        showToast('Contract accepted successfully.', 'success');
      } else {
        const reason = prompt('Please provide a reason for declining:');
        if (reason) {
          await declineContract({ id: selectedContractId, reason }).unwrap();
          showToast('Contract declined successfully.', 'success');
        }
      }
    } catch (err) {
      console.error(`Failed to ${modalAction.toLowerCase()} contract:`, err);
      showToast(
        `Failed to ${modalAction.toLowerCase()} the contract. Please try again.`,
        'error'
      );
    } finally {
      setIsModalOpen(false);
      setModalAction(null);
      setSelectedContractId(null);
    }
  };

  const toggleDropdown = (id: string) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const paginatedContracts = contracts.slice(skip, skip + limit);
  const totalPages = Math.ceil(contracts.length / limit);

  return (
    <>
      {/* Main Container */}
      <section className="container mx-auto px-4 py-8">
        {/* Vital Message */}
        <div className="mb-6 border-l-4 border-blue-600 bg-blue-50 p-4 rounded-r-md shadow-sm">
          <p className="text-blue-900 text-sm">
            <strong>Vital Message:</strong> Review your contracts carefully.
            Accepting or declining a contract is final, so be sure to provide a
            clear reason if declining.
          </p>
        </div>

        {contracts.length === 0 ? (
          <div className="text-gray-500 text-center">No contracts found.</div>
        ) : (
          <>
            {/* Contracts Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full table-auto border border-gray-200">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">Project Name</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedContracts.map((contract) => (
                    <tr
                      key={contract._id}
                      className="border-b hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="py-3 px-4 text-gray-700">
                        {contract.projectName}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {contract.status}
                      </td>
                      <td className="py-3 px-4 text-center relative">
                        {/* Dropdown Trigger */}
                        <button
                          className="text-gray-600 hover:text-gray-800 focus:outline-none"
                          onClick={() => toggleDropdown(contract._id)}
                        >
                          <FaEllipsisV />
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen === contract._id && (
                          <div
                            className="origin-top-right absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-20"
                            style={{ animation: 'fadeIn 0.2s ease-out' }}
                          >
                            <ul>
                              <li>
                                <Link
                                  to={`/dashboard/contractors/contracts/${contract._id}`}
                                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
                                >
                                  <FaEye className="inline mr-2" />
                                  View
                                </Link>
                              </li>
                              {contract.status === 'Pending' && (
                                <>
                                  <li>
                                    <button
                                      onClick={() =>
                                        handleActionClick('Accept', contract._id)
                                      }
                                      className="block w-full text-left px-4 py-2 text-green-700 hover:bg-gray-100"
                                    >
                                      Accept
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      onClick={() =>
                                        handleActionClick(
                                          'Decline',
                                          contract._id
                                        )
                                      }
                                      className="block w-full text-left px-4 py-2 text-red-700 hover:bg-gray-100"
                                    >
                                      Decline
                                    </button>
                                  </li>
                                </>
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

            {/* Pagination */}
            <div className="mt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isModalOpen}
          title={`${modalAction} Contract`}
          message={`Are you sure you want to ${modalAction?.toLowerCase()} this contract?`}
          onConfirm={handleConfirmAction}
          onCancel={() => setIsModalOpen(false)}
        />
      </section>
    </>
  );
};

export default ContractorContractList;
