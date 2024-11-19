import React, { useState, useMemo } from 'react';
import { useFetchAppraisalMetricsQuery, useDeleteAppraisalMetricMutation } from '../../api/appraisalMetricApi';
import { IAppraisalMetric } from '../../types/AppraisalMetric';
import ConfirmationModal from '../common/Modal/ConfirmationModal';
import DataTable from '../common/DataTable/DataTable';
import Pagination from '../common/Pagination/Pagination';
import DropdownMenu from '../common/DropdownMenu/DropdownMenu';

interface AppraisalMetricsListProps {
  onEdit: (id: string) => void;
}

const AppraisalMetricsList: React.FC<AppraisalMetricsListProps> = ({ onEdit }) => {
  const { data: metrics, error, isLoading } = useFetchAppraisalMetricsQuery();
  const [deleteAppraisalMetric] = useDeleteAppraisalMetricMutation();

  // State for managing the confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [metricToDelete, setMetricToDelete] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting state
  const [sortColumn, setSortColumn] = useState<keyof IAppraisalMetric | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleDeleteClick = (id: string) => {
    setMetricToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (metricToDelete) {
      try {
        await deleteAppraisalMetric(metricToDelete).unwrap();
        alert('Appraisal Metric deleted successfully.');
      } catch (err) {
        console.error('Failed to delete appraisal metric:', err);
        alert('Failed to delete appraisal metric. Please try again.');
      } finally {
        setIsModalOpen(false);
        setMetricToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setMetricToDelete(null);
  };

  // Define columns for the DataTable
  const columns = useMemo(() => [
    {
      header: 'Metric Name',
      accessor: 'metric_name' as keyof IAppraisalMetric,
      sortable: true,
    },
    {
      header: 'Description',
      accessor: 'description' as keyof IAppraisalMetric,
      sortable: false,
    },
    {
      header: 'Scale',
      accessor: 'scale' as keyof IAppraisalMetric,
      sortable: true,
    },
    {
      header: 'Associated Questions',
      accessor: (item: IAppraisalMetric) => item.associated_questions.length,
      sortable: false,
    },
    {
      header: 'Actions',
      accessor: (item: IAppraisalMetric) => (
        <DropdownMenu
          
          options={[
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
  ], [onEdit]);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!metrics) return [];
    if (!sortColumn) return metrics;

    const sorted = [...metrics].sort((a, b) => {
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
  }, [metrics, sortColumn, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (column: keyof IAppraisalMetric) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  if (isLoading)
    return <div className="text-center text-gray-500">Loading Appraisal Metrics...</div>;
  if (error)
    return <div className="text-center text-red-500">Error fetching Appraisal Metrics.</div>;

  return (
    <div className="bg-blue-50 p-4">
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
      <h1 className="text-3xl font-bold text-blue-700 ">Appraisal Metrics</h1>
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
        message="Are you sure you want to delete this appraisal metric?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default AppraisalMetricsList;
