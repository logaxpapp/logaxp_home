import React, { useState } from 'react';
import { useAcceptContractMutation, useDeclineContractMutation } from '../../../api/contractApi';
import Pagination from '../../common/Pagination/Pagination';
import Button from '../../common/Button';
import { Link } from 'react-router-dom';
import { IContract } from '../../../types/contractTypes';
import { useToast } from '../../../features/Toast/ToastContext';

interface ContractorContractListProps {
  contracts: IContract[];
}

const ContractorContractList: React.FC<ContractorContractListProps> = ({ contracts }) => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const skip = (page - 1) * limit;

  const { showToast } = useToast();
  const [acceptContract] = useAcceptContractMutation();
  const [declineContract] = useDeclineContractMutation();

  // Debug Logs
  console.log('Contracts:', contracts);

  const handleAccept = async (id: string) => {
    try {
      await acceptContract(id).unwrap();
      showToast('Contract accepted successfully.', 'success');
    } catch (err) {
      console.error('Failed to accept contract:', err);
      showToast('Failed to accept the contract. Please try again.', 'error');
    }
  };

  const handleDecline = async (id: string) => {
    const reason = prompt('Please provide a reason for declining:');
    if (reason) {
      try {
        await declineContract({ id, reason }).unwrap();
        showToast('Contract declined successfully.', 'success');
      } catch (err) {
        console.error('Failed to decline contract:', err);
        showToast('Failed to decline the contract. Please try again.', 'error');
      }
    }
  };

  const paginatedContracts = contracts.slice(skip, skip + limit);
  console.log('Paginated Contracts:', paginatedContracts);

  const totalPages = Math.ceil(contracts.length / limit);

  return (
    <div className="mt-6 font-secondary">
      <header className="bg-gradient-to-t from-teal-600 via-cyan-800 to-gray-900 text-white p-4 sticky top-0 shadow-lg z-10">
        <div className="max-w-6xl mx-auto flex justify-start">
          <h2 className="text-xl font-extrabold tracking-wide">My Contracts</h2>
        </div>
      </header>
      {contracts.length === 0 ? (
        <div className="text-gray-500 text-center">No contracts found.</div>
      ) : (
        <>
          <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4">Project Name</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedContracts.map((contract) => (
                <tr key={contract._id} className="text-center border-t">
                  <td className="py-2 px-4">{contract.projectName}</td>
                  <td className="py-2 px-4">{contract.status}</td>
                  <td className="py-2 px-4 flex justify-center">
                    <Link to={`/dashboard/contractors/contracts/${contract._id}`}>
                      <Button variant="view" size="small" className="mr-2">
                        View
                      </Button>
                    </Link>
                    {contract.status === 'Pending' && (
                      <>
                        <Button
                          variant="success"
                          size="small"
                          className="mr-2"
                          onClick={() => handleAccept(contract._id)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => handleDecline(contract._id)}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default ContractorContractList;
