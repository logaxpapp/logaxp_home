import React, { useState, useMemo } from 'react';
import { useFetchAppraisalQuestionsQuery, useDeleteAppraisalQuestionMutation } from '../../api/appraisalQuestionApi';
import { IAppraisalQuestion } from '../../types/appraisalQuestion';
import DataTable from '../common/DataTable/DataTable';
import Pagination from '../common/Pagination/Pagination';
import ConfirmationModal from '../common/Modal/ConfirmationModal';
import DropdownMenu from '../common/DropdownMenu/DropdownMenu';


interface AppraisalQuestionsListProps {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

const AppraisalQuestionsList: React.FC<AppraisalQuestionsListProps> = ({ onView, onEdit }) => {
  const { data: questions, error, isLoading } = useFetchAppraisalQuestionsQuery();
  const [deleteAppraisalQuestion] = useDeleteAppraisalQuestionMutation();

  // State for managing the confirmation modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10; // Adjust as needed

  // Sorting state
  const [sortColumn, setSortColumn] = useState<keyof IAppraisalQuestion | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleDeleteClick = (id: string) => {
    setQuestionToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (questionToDelete) {
      try {
        await deleteAppraisalQuestion(questionToDelete).unwrap();
        alert('Appraisal question deleted successfully!');
      } catch (err) {
        console.error('Failed to delete appraisal question:', err);
        alert('Failed to delete appraisal question.');
      } finally {
        setIsModalOpen(false);
        setQuestionToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setQuestionToDelete(null);
  };

  // Define columns for the DataTable
  const columns = useMemo(() => [
    {
      header: 'Question Text',
      accessor: 'question_text' as keyof IAppraisalQuestion,
      sortable: true,
    },
    {
      header: 'Type',
      accessor: 'question_type' as keyof IAppraisalQuestion,
      sortable: true,
    },
    {
      header: 'Appraisal Type',
      accessor: 'appraisal_type' as keyof IAppraisalQuestion,
      sortable: true,
    },
    {
      header: 'Period',
      accessor: 'period' as keyof IAppraisalQuestion,
      sortable: true,
    },
    {
      header: 'Actions',
      accessor: (item: IAppraisalQuestion) => (
        <DropdownMenu

          options={[
            {
              label: 'View',
              onClick: () => onView(item._id),
            },
            {
              label: 'Edit',
              onClick: () => onEdit(item._id),
            },
            {
              label: 'Delete',
              onClick: () => handleDeleteClick(item._id),
            },
          ]}
        />
      ),
      sortable: false,
    },
  ], [onView, onEdit]);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!questions) return [];
    if (!sortColumn) return questions;

    const sorted = [...questions].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();

      if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [questions, sortColumn, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (column: keyof IAppraisalQuestion) => {
    if (sortColumn === column) {
      // Toggle sort direction
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  if (isLoading)
    return <p className="text-center text-gray-500">Loading appraisal questions...</p>;
  if (error)
    return <p className="text-center text-red-500">Error loading appraisal questions.</p>;

  return (
    <div className="bg-blue-50 p-4">
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
      <h1 className="text-3xl font-bold text-blue-700 font-primary">Appraisal Questions</h1>
      </div>
      <DataTable
        data={paginatedData}
        columns={columns}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
      <div className="flex justify-center mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this appraisal question?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default AppraisalQuestionsList;
