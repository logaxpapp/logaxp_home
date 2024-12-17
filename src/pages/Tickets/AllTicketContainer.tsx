// src/containers/AllTicketContainer.tsx
import React, { useState } from 'react';
import {
  useFetchTicketsQuery,
  useFetchAdvancedTicketsQuery,
  useDeleteTicketMutation,
  useUpdateTicketMutation,
  useAssignTicketMutation,
} from '../../api/ticketsApi';
import { useFetchAllUsersQuery } from '../../api/usersApi';
import { useNavigate } from 'react-router-dom';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import Button from '../../components/common/Button/Button';
import PaginationControl from './PaginationControl';
import TicketTable from './TicketTable';
import SearchBar from './SearchBar';
import StatusFilter from './StatusFilter';
import AdvancedFilters from './AdvancedFilters';
import CreateEditTicketModal from './CreateEditTicketModal';
import ViewTicketModal from './ViewTicketModal';
import AssignTicketModal from './AssignTicketModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { ITicket } from '../../types/ticket';
import { useToast } from '../../features/Toast/ToastContext';
import ChangeStatusModal from './ChangeStatusModal'; // New Modal Component

const AllTicketContainer: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 12;

  const [deleteTicket] = useDeleteTicketMutation();
  const [updateTicket] = useUpdateTicketMutation();
  const [assignTicket] = useAssignTicketMutation();

  const { data: usersData, isLoading: isUsersLoading } = useFetchAllUsersQuery({ page: 1, limit: 100 });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    department: '',
    startDate: '',
    endDate: '',
    dueStartDate: '',
    dueEndDate: '',
  });

  const isAdvanced =
    filters.search ||
    filters.status ||
    filters.priority ||
    filters.department ||
    filters.startDate ||
    filters.endDate ||
    filters.dueStartDate ||
    filters.dueEndDate;

  // Use one query depending on isAdvanced
  const {
    data: ticketsData,
    isLoading: ticketsLoading,
    isError: ticketsError,
    error: ticketsErrorData,
    refetch: refetchTickets,
  } = isAdvanced
    ? useFetchAdvancedTicketsQuery({
        search: filters.search,
        status: filters.status,
        priority: filters.priority,
        department: filters.department,
        startDate: filters.startDate,
        endDate: filters.endDate,
        dueStartDate: filters.dueStartDate,
        dueEndDate: filters.dueEndDate,
      })
    : useFetchTicketsQuery({
        skip: (currentPage - 1) * ticketsPerPage,
        limit: ticketsPerPage,
      });

  const totalTickets = ticketsData?.total || 0;
  const totalPages = Math.ceil(totalTickets / ticketsPerPage);

  // State variables for sorting
  const [sortColumn, setSortColumn] = useState<keyof ITicket>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // State variables for modals
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [selectedTicketForEdit, setSelectedTicketForEdit] = useState<ITicket | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTicketForView, setSelectedTicketForView] = useState<ITicket | null>(null);

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [ticketToAssign, setTicketToAssign] = useState<ITicket | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // New state for ChangeStatusModal
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);
  const [ticketToChangeStatus, setTicketToChangeStatus] = useState<ITicket | null>(null);

  const { showToast } = useToast();

  // Handlers for modals
  const openCreateEditModal = (ticket?: ITicket) => {
    setSelectedTicketForEdit(ticket || null);
    setIsCreateEditModalOpen(true);
  };

  const closeCreateEditModal = () => setIsCreateEditModalOpen(false);

  const openViewModal = (ticket: ITicket) => {
    setSelectedTicketForView(ticket);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => setIsViewModalOpen(false);

  const openAssignModal = (ticket: ITicket) => {
    setTicketToAssign(ticket);
    setSelectedUserId(null);
    setIsAssignModalOpen(true);
  };

  const closeAssignModal = () => {
    setIsAssignModalOpen(false);
    setTicketToAssign(null);
    setSelectedUserId(null);
  };

  const openChangeStatusModal = (ticket: ITicket) => {
    setTicketToChangeStatus(ticket);
    setIsChangeStatusModalOpen(true);
  };

  const closeChangeStatusModal = () => {
    setIsChangeStatusModalOpen(false);
    setTicketToChangeStatus(null);
  };

  // Handler for successful create/edit
  const handleSuccess = () => {
    refetchTickets();
  };

  // Handlers for basic search and status filter
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, status: e.target.value });
    setCurrentPage(1);
  };

  // Handler for sorting
  const handleSort = (column: keyof ITicket) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Handlers for deleting tickets
  const handleDelete = (ticket: ITicket) => {
    setTicketToDelete(ticket._id);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (ticketToDelete) {
      try {
        await deleteTicket(ticketToDelete).unwrap();
        showToast('Ticket deleted successfully!', 'success');
        refetchTickets();
      } catch (err: any) {
        const errorMessage =
          err?.data?.message || 'Failed to delete ticket. Please try again later.';
        showToast(errorMessage, 'error');
      } finally {
        setIsConfirmDeleteOpen(false);
        setTicketToDelete(null);
      }
    }
  };

  // Handlers for assigning tickets
  const handleAssignTicket = async () => {
    if (ticketToAssign && selectedUserId) {
      try {
        await assignTicket({
          ticketId: ticketToAssign._id,
          assigneeId: selectedUserId,
        }).unwrap();
        showToast('Ticket assigned successfully!', 'success');
        refetchTickets();
        closeAssignModal();
      } catch (err: any) {
        const errorMessage =
          err?.data?.message || 'Failed to assign ticket. Please try again later.';
        showToast(errorMessage, 'error');
      }
    } else {
      showToast('Please select a user to assign.', 'error');
    }
  };

  // Handler for changing ticket status
  const handleStatusChange = async (newStatus: ITicket['status']) => {
    if (ticketToChangeStatus) {
      try {
        await updateTicket({ ticketId: ticketToChangeStatus._id, updates: { status: newStatus } }).unwrap();
        showToast('Ticket status updated successfully!', 'success');
        refetchTickets();
        closeChangeStatusModal();
      } catch (err: any) {
        const errorMessage =
          err?.data?.message || 'Failed to update ticket status. Please try again later.';
        showToast(errorMessage, 'error');
      }
    }
  };

  // Handler to navigate back
  const handleTickets = () => {
    navigate(-1);
  };

  // Handle loading and error states
  if (ticketsLoading) {
    return <div className="text-center mt-10">Loading tickets...</div>;
  }

  if (ticketsError) {
    return (
      <div className="text-center mt-10 text-red-500">
        Failed to load tickets: {ticketsErrorData?.toString()}
      </div>
    );
  }

  // Sorting and Pagination Logic
  const sortedTickets = [...(ticketsData?.tickets || [])].sort((a, b) => {
    let compare = 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      compare = aValue - bValue;
    } else if (typeof aValue === 'string' && typeof bValue === 'string') {
      compare = aValue.localeCompare(bValue);
    } else {
      compare = 0;
    }
    return sortDirection === 'asc' ? compare : -compare;
  });

  const currentTickets = sortedTickets.slice(
    (currentPage - 1) * ticketsPerPage,
    currentPage * ticketsPerPage
  );

  return (
    <div className="p-6 min-h-screen bg-blue-50 dark:bg-gray-700">
      {/* Back Button */}
      <div className="mb-4">
        <FaArrowAltCircleLeft
          className="bg-red-500 text-white h-8 w-8 p-1 rounded-full cursor-pointer"
          onClick={handleTickets}
          title="Go Back"
        />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-blue-800 dark:text-blue-500">
          All Tickets ({totalTickets})
        </h1>
        <Button
          variant="primary"
          size="medium"
          onClick={() => setIsCreateEditModalOpen(true)}
        >
          + New Ticket
        </Button>
      </div>

      {/* Basic Filters */}
      <div className="flex flex-col md:flex-row md:items-center font-primary mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <SearchBar searchTerm={filters.search} onSearchChange={handleSearchChange} />
        <StatusFilter statusFilter={filters.status} onStatusChange={handleStatusFilterChange} />
        <Button
          variant="secondary"
          size="small"
          onClick={() => setShowAdvancedFilters((prev) => !prev)}
        >
          {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <AdvancedFilters
          filters={filters}
          setFilters={setFilters}
          onApply={refetchTickets}
          onClear={() => {
            setFilters({
              search: '',
              status: '',
              priority: '',
              department: '',
              startDate: '',
              endDate: '',
              dueStartDate: '',
              dueEndDate: '',
            });
            refetchTickets();
          }}
        />
      )}

      {/* Ticket Table */}
      <TicketTable
        tickets={currentTickets}
        onEdit={openCreateEditModal}
        onDelete={handleDelete}
        onAssign={openAssignModal}
        onView={openViewModal}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        onStatusChange={openChangeStatusModal} // Pass the handler to open the modal
      />

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Showing {currentTickets.length > 0 ? (currentPage - 1) * ticketsPerPage + 1 : 0} to{' '}
          {currentPage * ticketsPerPage > totalTickets ? totalTickets : currentPage * ticketsPerPage}{' '}
          of {totalTickets} tickets
        </div>
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modals */}
      <CreateEditTicketModal
        isOpen={isCreateEditModalOpen}
        onClose={closeCreateEditModal}
        onSuccess={handleSuccess}
        ticket={selectedTicketForEdit}
      />

      <ViewTicketModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        ticket={selectedTicketForView}
      />

      <AssignTicketModal
        isOpen={isAssignModalOpen}
        onClose={closeAssignModal}
        users={usersData?.users || []}
        isLoading={isUsersLoading}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
        onAssign={handleAssignTicket}
        ticketTitle={ticketToAssign?.title || ''}
      />

      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this ticket? This action cannot be undone."
      />

      {/* New ChangeStatusModal */}
      <ChangeStatusModal
        isOpen={isChangeStatusModalOpen}
        onClose={closeChangeStatusModal}
        onChangeStatus={handleStatusChange}
        currentStatus={ticketToChangeStatus?.status || 'Open'}
      />
    </div>
  );
};

export default AllTicketContainer;
