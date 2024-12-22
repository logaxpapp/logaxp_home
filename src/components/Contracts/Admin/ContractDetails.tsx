// src/components/Admin/Contractors/ContractorDetails.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetchContractorByIdQuery } from '../../../api/contractApi';
import Button from '../../common/Button';
import { formatDate } from '../../../utils/formatDate';

const ContractorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: contractor, error, isLoading } = useFetchContractorByIdQuery(id!);

  if (isLoading) return <div>Loading Contractor...</div>;
  if (error) return <div>Error fetching contractor.</div>;
  if (!contractor) return <div>Contractor not found.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Contractor Details</h1>
      <div className="mb-4">
        <p><strong>Name:</strong> {contractor.name}</p>
        <p><strong>Email:</strong> {contractor.email}</p>
        <p><strong>Joined:</strong> {formatDate(contractor.createdAt)}</p>
        {/* Add more fields as necessary */}
      </div>
      <Link to={`/admin/contractors/${id}/edit`}>
        <Button variant="edit">Edit Contractor</Button>
      </Link>
    </div>
  );
};

export default ContractorDetails;
