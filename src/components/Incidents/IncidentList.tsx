import React, { useState } from 'react';
import {
  useFetchIncidentsQuery,
  useDeleteIncidentMutation,
} from '../../api/incidentApiSlice';
import { IIncident, IncidentType, IncidentSeverity } from '../../types/incidentTypes';
import DataTable, { Column } from '../common/DataTable/DataTable';
import Pagination from '../common/Pagination/Pagination';
import Button from '../common/Button/Button';
import IncidentCreate from './IncidentCreate';
import IncidentEdit from './IncidentEdit';
import IncidentDetail from './IncidentDetail';
import DropdownMenu from '../common/DropdownMenu/DropdownMenu';

const IncidentList: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [typeFilter, setTypeFilter] = useState<IncidentType | undefined>(undefined);
  const [severityFilter, setSeverityFilter] = useState<IncidentSeverity | undefined>(undefined);
  const [search, setSearch] = useState('');

  const { data, error, isLoading } = useFetchIncidentsQuery({
    page,
    limit,
    type: typeFilter,
    severity: severityFilter,
    search,
  });
  const [deleteIncident] = useDeleteIncidentMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      try {
        await deleteIncident(id).unwrap();
      } catch (err) {
        console.error('Failed to delete the incident:', err);
      }
    }
  };

  const handleViewDetails = (id: string) => {
    setSelectedIncidentId(id);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedIncidentId(id);
    setIsEditModalOpen(true);
  };

  const columns: Column<IIncident>[] = [
    { header: 'Title', accessor: 'title' },
    { header: 'Type', accessor: 'type' },
    { header: 'Severity', accessor: 'severity' },
    { header: 'Location', accessor: 'location' },
    {
      header: 'Actions',
      accessor: (incident) => (
        <DropdownMenu
          options={[
            { label: 'View', onClick: () => handleViewDetails(incident._id) },
            { label: 'Edit', onClick: () => handleEdit(incident._id) },
            { label: 'Delete', onClick: () => handleDelete(incident._id) },
          ]}
        />
      ),
    },
  ];

  const totalPages = data?.total ? Math.ceil(data.total / limit) : 1; 

  return (
    <div className="p-8 bg-gray-50 rounded-lg shadow-lg font-secondary">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Incident Management</h2>
        <Button onClick={() => setIsCreateModalOpen(true)} variant="danger" className='bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900 '>
          + Post Incident
        </Button>
      </div>

      {isLoading ? (
        <p className="text-center text-blue-500 font-medium">Loading incidents...</p>
      ) : error ? (
        <p className="text-center text-red-500 font-medium">Error loading incidents.</p>
      ) : (
        <>
          <DataTable data={data?.incidents || []} columns={columns} />
          <div className="flex justify-center mt-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </>
      )}

      <IncidentCreate
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      {selectedIncidentId && (
        <IncidentEdit
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          incidentId={selectedIncidentId}
        />
      )}
      {selectedIncidentId && (
        <IncidentDetail
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          incidentId={selectedIncidentId}
        />
      )}
    </div>
  );
};

export default IncidentList;
