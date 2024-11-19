import React, { useState } from 'react';
import {
  useFetchAppraisalPeriodsQuery,
  useDeleteAppraisalPeriodMutation,
} from '../../api/apiSlice';
import { IAppraisalPeriod } from '../../types/AppraisalPeriod';
import DataTable, { Column } from '../../components/common/DataTable/DataTable';
import Button from '../../components/common/Button';
import IconButton from '../../components/common/IconButton';
import AppraisalPeriodForm from './AppraisalPeriodForm';
import Modal from '../../components/common/Feedback/Modal';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Loader from '../../components/Loader';
import { useToast } from '../../features/Toast/ToastContext';

const AdminAppraisalPeriodList: React.FC = () => {
  const { data, error, isLoading, refetch } = useFetchAppraisalPeriodsQuery();
  const [deleteAppraisalPeriod] = useDeleteAppraisalPeriodMutation();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPeriod, setSelectedPeriod] = useState<IAppraisalPeriod | null>(null);

  const { showToast } = useToast();

  const handleEdit = (period: IAppraisalPeriod) => {
    setSelectedPeriod(period);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this appraisal period?')) {
      try {
        await deleteAppraisalPeriod(id).unwrap();
        showToast('Appraisal period deleted successfully!');
        refetch();
      } catch (err) {
        console.error('Failed to delete appraisal period:', err);
        showToast('Failed to delete appraisal period.');
      }
    }
  };

  const handleCreate = () => {
    setSelectedPeriod(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const columns: Column<IAppraisalPeriod>[] = [
    { header: 'Name', accessor: (period) => period.name, sortable: true },
    {
      header: 'Start Date',
      accessor: (period) => new Date(period.startDate).toLocaleDateString(),
      sortable: true,
    },
    {
      header: 'End Date',
      accessor: (period) => new Date(period.endDate).toLocaleDateString(),
      sortable: true,
    },
    {
      header: 'Submission Deadline',
      accessor: (period) =>
        new Date(period.submissionDeadline).toLocaleDateString(),
      sortable: true,
    },
    {
      header: 'Review Deadline',
      accessor: (period) => new Date(period.reviewDeadline).toLocaleDateString(),
      sortable: true,
    },
    {
      header: 'Active',
      accessor: (period) => (period.isActive ? 'Yes' : 'No'),
      sortable: false,
      Cell: ({ value }) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            value === 'Yes'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (period) => (
        <div className="flex space-x-2">
          <IconButton
            variant="warning"
            icon={<FaEdit />}
            tooltip="Edit"
            ariaLabel="Edit Appraisal Period"
            onClick={() => handleEdit(period)}
          />
          <IconButton
            variant="danger"
            icon={<FaTrash />}
            tooltip="Delete"
            ariaLabel="Delete Appraisal Period"
            onClick={() => handleDelete(period._id)}
          />
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <div className="bg-blue-50 p-4 min-h-screen">
      <div className="flex flex-wrap justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-2xl font-bold font-primary">Appraisal Periods</h2>
        <Button variant="primary" onClick={handleCreate}>
          Create New Period
        </Button>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500">Failed to load appraisal periods.</p>
      ) : data?.data?.length ? (
        <div className="overflow-x-auto">
          <DataTable
            data={data.data}
            columns={columns}
            sortColumn="name"
            sortDirection="asc"
          />
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500">No appraisal periods found.</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          selectedPeriod ? 'Edit Appraisal Period' : 'Create Appraisal Period'
        }
      >
        <AppraisalPeriodForm
          initialData={selectedPeriod || undefined}
          onSuccess={() => {
            showToast('Appraisal period saved successfully!');
            refetch().then(() => handleCloseModal());
          }}
        />
      </Modal>
    </div>
  );
};

export default AdminAppraisalPeriodList;
