import React, { useState } from 'react';
import { useFetchContractsQuery, useDeleteContractMutation } from '../../../api/contractApi';
import Pagination from '../../common/Pagination/Pagination';
import Button from '../../common/Button';
import { Link } from 'react-router-dom';
import { IContract } from '../../../types/contractTypes';

const ContractList: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const skip = (page - 1) * limit;

  // Fetch contracts with proper structure handling
  const { data, error, isLoading, isFetching } = useFetchContractsQuery({ skip, limit });
  const [deleteContract] = useDeleteContractMutation();

  const contracts = Array.isArray(data) ? data : data?.contracts || [];
  const total = Array.isArray(data) ? data.length : data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      try {
        await deleteContract(id).unwrap();
        alert('Contract deleted successfully.');
      } catch (err) {
        console.error('Failed to delete contract:', err);
        alert('Failed to delete contract. Please try again.');
      }
    }
  };

  if (isLoading) return <div>Loading Contracts...</div>;
  if (error) {
    console.error('Error fetching contracts:', error);
    return <div>Error fetching contracts.</div>;
  }

  return (
    <div className="p-4">
      
      <Link to="/dashboard/admin/contracts/create">
        <Button variant="primary" className="mb-4">Create New Contract</Button>
      </Link>
      {contracts.length > 0 ? (
        <>
          <table className="min-w-full bg-white font-secondary">
            <thead>
              <tr>
                <th className="py-2">Project Name</th>
                <th className="py-2">Contractor</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract: IContract) => (
                <tr key={contract._id} className="text-center border-t">
                  <td className="py-2">{contract.projectName}</td>
                  <td className="py-2">{contract.contractor?.name || 'Unknown'}</td>
                  <td className="py-2">{contract.status}</td>
                  <td className="py-2 flex justify-center">
                    <Link to={`/dashboard/admin/contracts/${contract._id}`}>
                      <Button variant="view" size="small" className="mr-2">View</Button>
                    </Link>
                    <Link to={`/dashboard/admin/contracts/${contract._id}/edit`}>
                      <Button variant="edit" size="small" className="mr-2">Edit</Button>
                    </Link>
                    <Button
                      variant="delete"
                      size="small"
                      onClick={() => handleDelete(contract._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : (
        <div className="text-gray-500 text-center">No contracts found.</div>
      )}
      {isFetching && <div>Updating...</div>}
    </div>
  );
};

export default ContractList;
