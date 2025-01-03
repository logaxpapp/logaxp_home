// src/components/Admin/Contracts/ContractList.tsx

import React, { useState, useRef, useEffect } from 'react';
import { useFetchContractsQuery, useDeleteContractMutation } from '../../../api/contractApi';
import Pagination from '../../common/Pagination/Pagination';
import Button from '../../common/Button';
import { Link } from 'react-router-dom';
import { IContract, Currency } from '../../../types/contractTypes';
import { FaEllipsisV, FaEye, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import debounce from 'lodash/debounce';
import Modal from './Modal';
import Tooltip from './Tooltip';

const currencySymbols: { [key in Currency]: string } = {
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.GBP]: '£',
  [Currency.NGN]: '₦',
  // Add other currency symbols as needed
};

// Utility function for formatting currency
const formatCurrency = (amount: number, currency: Currency): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

const ContractList: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const skip = (page - 1) * limit;

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCurrency, setFilterCurrency] = useState<string>('All');

  // State to track which dropdown is open (by contract ID)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Reference to the container to detect outside clicks
  const containerRef = useRef<HTMLDivElement>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  // Fetch contracts with search and filter parameters
  const { data, error, isLoading, isFetching } = useFetchContractsQuery({
    skip,
    limit,
  });

  const [deleteContract] = useDeleteContractMutation();

  // Adjust based on your actual API response structure
  const contracts: IContract[] = Array.isArray(data) ? data : data?.contracts || [];
  const total: number = Array.isArray(data) ? data.length : data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Handle Delete Action with Modal Confirmation
  const handleDelete = (id: string) => {
    setSelectedContractId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedContractId) {
      try {
        await deleteContract(selectedContractId).unwrap();
        setIsModalOpen(false);
        setSelectedContractId(null);
        // Optionally, trigger a refetch or update state here
      } catch (err) {
        console.error('Failed to delete contract:', err);
        alert('Failed to delete contract. Please try again.');
      }
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setSelectedContractId(null);
  };

  // Toggle dropdown visibility
  const toggleDropdown = (id: string) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search to optimize performance
  const debouncedSearch = useRef(
    debounce((value: string) => {
      setSearchTerm(value);
      setPage(1); // Reset to first page on search
    }, 500)
  ).current;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-500">Loading Contracts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error fetching contracts:', error);
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500">Error fetching contracts. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 font-secondary" ref={containerRef}>
      {/* Confirmation Modal */}
      {isModalOpen && (
        <Modal
          title="Confirm Deletion"
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="red"
        >
          <p>Are you sure you want to delete this contract? This action cannot be undone.</p>
        </Modal>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <Link to="/dashboard/admin/contracts/create">
          <Button variant="primary">Create New Contract</Button>
        </Link>
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Project, Company, or Contractor"
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1); // Reset to first page on filter
            }}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Terminated">Terminated</option>
            <option value="Accepted">Accepted</option>
          </select>

          {/* Currency Filter */}
          <select
            value={filterCurrency}
            onChange={(e) => {
              setFilterCurrency(e.target.value);
              setPage(1); // Reset to first page on filter
            }}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Currencies</option>
            {Object.values(Currency).map((curr) => (
              <option key={curr} value={curr}>
                {currencySymbols[curr]} {curr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {contracts.length > 0 ? (
        <>
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="min-w-full bg-white dark:bg-gray-800">
              <thead>
                <tr>
                  <th className="py-3 px-6 bg-gray-100 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="py-3 px-6 bg-gray-100 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="py-3 px-6 bg-gray-100 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contractor
                  </th>
                  <th className="py-3 px-6 bg-gray-100 dark:bg-gray-700 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-6 bg-gray-100 dark:bg-gray-700 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Currency
                  </th>
                  <th className="py-3 px-6 bg-gray-100 dark:bg-gray-700 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Cost
                  </th>
                  <th className="py-3 px-6 bg-gray-100 dark:bg-gray-700 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-200">
                {contracts.map((contract: IContract) => (
                  <tr
                    key={contract._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm whitespace-nowrap">
                      {contract.projectName}
                    </td>
                    <td className="py-4 px-6 text-sm whitespace-nowrap">
                      {contract.companyName || 'Unknown'}
                    </td>
                    <td className="py-4 px-6 text-sm whitespace-nowrap">
                      {contract.contractor?.name || 'Unknown'}
                    </td>
                    <td className="py-4 px-6 text-sm text-center">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          contract.status === 'Active'
                            ? 'bg-green-200 text-green-800'
                            : contract.status === 'Draft'
                            ? 'bg-yellow-200 text-yellow-800'
                            : contract.status === 'Completed'
                            ? 'bg-blue-200 text-blue-800'
                            : contract.status === 'Terminated'
                            ? 'bg-red-200 text-red-800'
                            : contract.status === 'Pending'
                            ? 'bg-purple-200 text-purple-800'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {contract.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-center">
                      {contract.currency ? `${currencySymbols[contract.currency]} ${contract.currency}` : 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-sm text-center">
                      {contract.currency
                        ? formatCurrency(contract.totalCost, contract.currency)
                        : contract.totalCost.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-center relative">
                      {/* Dropdown Toggle Button */}
                      <Button
                        onClick={() => toggleDropdown(contract._id)}
                        aria-haspopup="true"
                        aria-expanded={openDropdownId === contract._id}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                      >
                        <FaEllipsisV />
                      </Button>

                      {/* Dropdown Menu */}
                      {openDropdownId === contract._id && (
                        <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1">
                            <Link
                              to={`/dashboard/admin/contracts/${contract._id}/details`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              <FaEye className="mr-2" />
                              View
                            </Link>
                            <Link
                              to={`/dashboard/admin/contracts/${contract._id}/edit`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              <FaEdit className="mr-2" />
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(contract._id)}
                              className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              <FaTrash className="mr-2" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination and Summary */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 space-y-4 md:space-y-0">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Showing {skip + 1} to {Math.min(skip + limit, total)} of {total} contracts
            </span>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      ) : (
        <div className="text-center mt-10">
          <p className="text-gray-500">No contracts found.</p>
        </div>
      )}
      {isFetching && (
        <div className="mt-4 text-center text-gray-500 dark:text-gray-300">
          Loading...
        </div>
      )}
    </div>
  );
};

export default ContractList;
