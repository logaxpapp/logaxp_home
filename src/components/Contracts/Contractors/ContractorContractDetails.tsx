import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useFetchContractByIdQuery,
  useAcceptContractMutation,
  useDeclineContractMutation,
} from '../../../api/contractApi';
import Button from '../../common/Button';
import Loader from '../../Loader';

const ContractorContractDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: contract, error, isLoading } = useFetchContractByIdQuery(id!);
  const [acceptContract, { isLoading: isAccepting }] = useAcceptContractMutation();
  const [declineContract, { isLoading: isDeclining }] = useDeclineContractMutation();

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-600 text-center mt-10">Error fetching contract.</div>;
  if (!contract) return <div className="text-gray-600 text-center mt-10">Contract not found.</div>;

  const handleAccept = async () => {
    try {
      await acceptContract(id!).unwrap();
      navigate('/dashboard/contractor/contracts');
    } catch (err) {
      console.error('Failed to accept contract:', err);
    }
  };

  const handleDecline = async () => {
    const reason = prompt('Please provide a reason for declining:');
    if (reason) {
      try {
        await declineContract({ id: id!, reason }).unwrap();
        navigate('/dashboard/contractor/contracts');
      } catch (err) {
        console.error('Failed to decline contract:', err);
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900  text-white p-2 mt-2 sticky top-0 shadow-md z-10">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">Contractor Dashboard</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <div className="bg-gray-50 rounded-lg  p-6 space-y-6">
          {/* Title */}
          <h1 className="text-3xl font-extrabold text-gray-800 text-center">
            Contract Details
          </h1>

          {/* Contract Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div>
              <p className="text-sm text-gray-500 uppercase">Project Name</p>
              <p className="text-lg font-semibold text-gray-800">{contract.projectName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">Description</p>
              <p className="text-lg text-gray-800 italic">{contract.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">Start Date</p>
              <p className="text-lg text-gray-800">
                {new Date(contract.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">End Date</p>
              <p className="text-lg text-gray-800">
                {new Date(contract.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">Payment Terms</p>
              <p className="text-lg text-gray-800">{contract.paymentTerms}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">Total Cost</p>
              <p className="text-lg font-semibold text-green-600">${contract.totalCost}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">Status</p>
              <p
                className={`text-lg font-semibold ${
                  contract.status === 'Pending'
                    ? 'text-yellow-500'
                    : contract.status === 'Accepted'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {contract.status}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">Deliverables</p>
              <p className="text-lg text-gray-800">{contract.deliverables.join(', ')}</p>
            </div>
          </div>

          {/* Action Buttons */}
          {contract.status === 'Pending' && (
            <div className="flex justify-center space-x-4 mt-6">
              <Button
                variant="success"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow"
                onClick={handleAccept}
                isLoading={isAccepting}
              >
                Accept
              </Button>
              <Button
                variant="danger"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded shadow"
                onClick={handleDecline}
                isLoading={isDeclining}
              >
                Decline
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractorContractDetails;
