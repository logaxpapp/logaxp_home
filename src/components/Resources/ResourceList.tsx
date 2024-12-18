import React, { useState, useMemo } from 'react';
import { useFetchResourcesQuery, useDeleteResourceMutation } from '../../api/resourceApiSlice';
import { IResource, ResourceType } from '../../types/resourceTypes';
import { useNavigate } from 'react-router-dom';
import DataTable, { Column } from '../common/DataTable/DataTable';
import Pagination from '../common/Pagination/Pagination';
import ResourceCreate from './ResourceCreate';
import ResourceEdit from './ResourceEdit';
import SendResource from './SendResource';
import DropdownMenu from '../common/DropdownMenu/DropdownMenu';
import Button from '../common/Button/Button';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';

const ResourceList: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [typeFilter, setTypeFilter] = useState<ResourceType | undefined>(undefined);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const { data, error, isLoading, refetch } = useFetchResourcesQuery({ page, limit, type: typeFilter, search });
  const [deleteResource] = useDeleteResourceMutation();

  const currentUser = useAppSelector(selectCurrentUser);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState<boolean>(false);
  const [selectedResourceForSend, setSelectedResourceForSend] = useState<IResource | null>(null);
  const [selectedResource, setSelectedResource] = useState<IResource | null>(null);

  // Handle actions
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteResource(id).unwrap();
        refetch();
      } catch (err) {
        console.error('Failed to delete the resource:', err);
      }
    }
  };

  const handleView = (resourceId: string) => {
    navigate(`/dashboard/resources/${resourceId}`);
  };

  const handleEdit = (resource: IResource) => {
    setSelectedResource(resource);
    setIsEditModalOpen(true);
  };

  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as ResourceType;
    setTypeFilter(value || undefined);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSend = (resource: IResource) => {
    setSelectedResourceForSend(resource);
    setIsSendModalOpen(true);
  };

  // Define columns for DataTable
  const columns: Column<IResource>[] = useMemo(
    () => [
      {
        header: 'Title',
        accessor: 'title',
        sortable: true,
      },
      {
        header: 'Type',
        accessor: 'type',
        sortable: true,
      },
      {
        header: 'Created By',
        accessor: (resource) => resource.createdBy?.name || 'Unknown',
      },
      {
        header: 'Actions',
        accessor: (resource) => {
          const isCreatedByCurrentUser = resource.createdBy?._id === currentUser?._id;
          const isAdmin = currentUser?.role === 'admin';

          return (
            <DropdownMenu
              options={[
                { label: 'View', onClick: () => handleView(resource._id) },
                ...(isAdmin || isCreatedByCurrentUser
                  ? [{ label: 'Edit', onClick: () => handleEdit(resource) }]
                  : []),
                ...(isAdmin || isCreatedByCurrentUser
                  ? [{ label: 'Delete', onClick: () => handleDelete(resource._id) }]
                  : []),
                ...(isAdmin
                  ? [{ label: 'Send', onClick: () => handleSend(resource) }]
                  : []),
              ]}
            />
          );
        },
      },
    ],
    [currentUser, handleDelete, handleEdit, handleSend, handleView]
  );

  return (
    <div className="container mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      {/* Header */}
      <header className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Resource Management</h2>
        {currentUser?.role === 'admin' && (
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2"
          >
            + Add Resource
          </Button>
        )}
      </header>

      {/* Filters */}
      <div className="flex justify-between items-center my-4">
        <div className="flex space-x-4">
          <select
            value={typeFilter || ''}
            onChange={handleTypeFilterChange}
            className="border rounded-lg px-4 py-2 text-gray-600"
          >
            <option value="">All Types</option>
            {Object.values(ResourceType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={handleSearchChange}
            className="border rounded-lg px-4 py-2 text-gray-600"
          />
        </div>
      </div>

      {/* DataTable */}
      {isLoading ? (
        <p className="text-center text-blue-500 font-medium">Loading resources...</p>
      ) : error ? (
        <p className="text-center text-red-500 font-medium">Error loading resources.</p>
      ) : (
        <>
        <div className="flex justify-center  overflow-auto">
          <DataTable data={data?.resources || []} columns={columns} />
          </div>
          <div className="mt-4 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={data ? Math.ceil(data.total / limit) : 1}
              onPageChange={(page) => setPage(page)}
            />
          </div>
        </>
      )}

      {/* Create Resource Modal */}
      <ResourceCreate isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      {/* Edit Resource Modal */}
      {selectedResource && (
        <ResourceEdit
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          resourceId={selectedResource._id}
        />
      )}

      {/* Send Resource Modal */}
      {selectedResourceForSend && (
        <SendResource
          isOpen={isSendModalOpen}
          onClose={() => setIsSendModalOpen(false)}
          resourceId={selectedResourceForSend._id}
        />
      )}
    </div>
  );
};

export default ResourceList;
