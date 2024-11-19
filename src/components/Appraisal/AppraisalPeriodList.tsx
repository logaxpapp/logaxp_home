import React, { useState } from 'react';
import { 
  useFetchAppraisalPeriodsQuery, 
  useDeleteAppraisalPeriodMutation 
} from '../../api/apiSlice';
import { IAppraisalPeriod } from '../../types/AppraisalPeriod';
import DataTable, { Column } from '../../components/common/DataTable/DataTable'; // Import types for DataTable
import Button from '../../components/common/Button';
import AppraisalPeriodForm from './AppraisalPeriodForm';
import Modal from '../../components/common/Feedback/Modal';

const AppraisalPeriodList: React.FC = () => {
  const { data, error, isLoading, refetch } = useFetchAppraisalPeriodsQuery();
  const [deleteAppraisalPeriod] = useDeleteAppraisalPeriodMutation();
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPeriod, setSelectedPeriod] = useState<IAppraisalPeriod | null>(null);

  const handleEdit = (period: IAppraisalPeriod) => {
    setSelectedPeriod(period);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this appraisal period?')) {
      try {
        await deleteAppraisalPeriod(id).unwrap();
        refetch();
      } catch (err) {
        console.error('Failed to delete appraisal period:', err);
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

  // Define columns for the DataTable
  const columns: Column<IAppraisalPeriod>[] = [
    { header: 'Name', accessor: (period) => period.name, sortable: true },
    { header: 'Start Date', accessor: (period) => new Date(period.startDate).toLocaleDateString(), sortable: true },
    { header: 'End Date', accessor: (period) => new Date(period.endDate).toLocaleDateString(), sortable: true },
    { header: 'Submission Deadline', accessor: (period) => new Date(period.submissionDeadline).toLocaleDateString(), sortable: true },
    { header: 'Review Deadline', accessor: (period) => new Date(period.reviewDeadline).toLocaleDateString(), sortable: true },
    { header: 'Active', accessor: (period) => (period.isActive ? 'Yes' : 'No'), sortable: false },
    { 
      header: 'Actions', 
      accessor: (period) => (
        <div className="flex space-x-2">
          <Button variant="primary" onClick={() => handleEdit(period)} className="mr-2">
            Edit
          </Button>
          <Button variant="danger" onClick={() => handleDelete(period._id)}>
            Delete
          </Button>
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <div className="bg-blue-50 p-4">
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-2xl font-bold font-primary">Appraisal Periods</h2>
        <Button variant="primary" onClick={handleCreate}>
          Create New Period
        </Button>
      </div>

      {isLoading ? (
        <p>Loading appraisal periods...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load appraisal periods.</p>
      ) : data?.data?.length ? ( // Updated to check data.data.length
        <DataTable 
          data={data.data} // Access the nested data property
          columns={columns}
          sortColumn="name"
          sortDirection="asc"
          onSort={(column) => console.log(`Sorting by ${column}`)}
        />
      ) : (
        <p>No appraisal periods found.</p>
      )}

      {/* Modal for Create/Edit */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={selectedPeriod ? "Edit Period" : "Create Period"}
      >
        <AppraisalPeriodForm
          initialData={selectedPeriod || undefined}
          onSuccess={() => {
            console.log('Modal form submission successful. Refetching data...');
            refetch().then(() => handleCloseModal()); // Only close after successful refetch
          }}
        />
      </Modal>
    </div>
  );
};

export default AppraisalPeriodList;
