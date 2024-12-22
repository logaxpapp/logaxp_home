// src/components/Admin/Contractors/ContractorDetails.tsx

import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetchContractorByIdQuery } from '../../../api/contractApi';
import Button from '../../common/Button';
import { Link } from 'react-router-dom';
import { format } from 'date-fns'; // Ensure date-fns is installed: npm install date-fns

const ContractorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Log the id to ensure it's correctly obtained
  console.log("Contractor ID from URL:", id);

  // Fetch contractor data
  const { data: contractor, isLoading, error, isError } = useFetchContractorByIdQuery(id!, {
    // Optional: refetch on mount or arg change
    // refetchOnMountOrArgChange: true,
  });

  // Log the query result
  React.useEffect(() => {
    console.log("Contractor Data:", contractor);
    console.log("Is Error:", isError);
    console.log("Error:", error);
  }, [contractor, isError, error]);

  if (isLoading) return <div className="p-4">Loading Contractor Details...</div>;

  if (isError) {
    // Log the error details
    console.error("Error fetching contractor:", error);
    return <div className="p-4 text-red-500">Error loading contractor details.</div>;
  }

  if (!contractor) return <div className="p-4">No contractor found.</div>;

  return (
    <div className="p-2 bg-gray-100 min-h-screen">
      <div className=" mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900  text-white px-6 py-4">
          <h2 className="text-2xl font-semibold">Contractor Details</h2>
          <Link to={`/dashboard/admin/contractors/${contractor._id}/edit`}>
            <Button variant="edit">Edit Contractor</Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Section */}
          <div className="flex flex-col items-center md:items-start">
            {/* Profile Picture */}
            <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center mb-4">
              {contractor.profilePicture ? (
                <img
                  src={contractor.profilePicture}
                  alt={`${contractor.name} Profile`}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-4xl font-bold text-gray-700">
                  {contractor.name.charAt(0)}
                </span>
              )}
            </div>
            {/* Basic Info */}
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold">{contractor.name}</h3>
              <p className="text-gray-600">{contractor.role}</p>
              <p className="text-gray-600">{contractor.email}</p>
              <p className="text-gray-600">{contractor.phone_number}</p>
            </div>
          </div>

          {/* Detailed Info */}
          <div className="space-y-4">
            {/* Status Section */}
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="text-lg font-semibold mb-2">Status</h4>
              <p><span className="font-medium">Account Status:</span> {contractor.status}</p>
              <p><span className="font-medium">Online Status:</span> {contractor.onlineStatus}</p>
            </div>

            {/* Rates Section */}
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="text-lg font-semibold mb-2">Rates</h4>
              <p><span className="font-medium">Hourly Rate:</span> ₦{contractor.hourlyRate.toFixed(2)}</p>
              <p><span className="font-medium">Overtime Rate:</span> ₦{contractor.overtimeRate.toFixed(2)} per hour</p>
            </div>

            {/* Employment Details */}
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="text-lg font-semibold mb-2">Employment Details</h4>
              <p><span className="font-medium">Employee ID:</span> {contractor.employee_id}</p>
              <p><span className="font-medium">Joined At:</span> {format(new Date(contractor.createdAt), 'PPP')}</p>
              <p><span className="font-medium">Last Login:</span> {format(new Date(contractor.lastLoginAt), 'PPP p')}</p>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Address</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p><span className="font-medium">Street:</span> {contractor.address.street}</p>
            <p><span className="font-medium">City:</span> {contractor.address.city}</p>
            <p><span className="font-medium">State:</span> {contractor.address.state}</p>
            <p><span className="font-medium">Country:</span> {contractor.address.country}</p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Information */}
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="text-lg font-semibold mb-2">Account Information</h4>
            <p><span className="font-medium">Password Changed At:</span> {format(new Date(contractor.passwordChangedAt), 'PPP p')}</p>
            <p><span className="font-medium">Password Expiry Notified:</span> {contractor.passwordExpiryNotified ? 'Yes' : 'No'}</p>
            <p><span className="font-medium">Google Connected:</span> {contractor.googleConnected ? 'Yes' : 'No'}</p>
          </div>

          {/* Policies and History */}
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="text-lg font-semibold mb-2">Policies and History</h4>
            <p><span className="font-medium">Acknowledged Policies:</span> {contractor.acknowledgedPolicies.length > 0 ? contractor.acknowledgedPolicies.join(', ') : 'None'}</p>
            <p><span className="font-medium">Password History:</span> {contractor.passwordHistory.length > 0 ? `${contractor.passwordHistory.length} entries` : 'None'}</p>
            <p><span className="font-medium">Onboarding Steps Completed:</span> {contractor.onboarding_steps_completed.length > 0 ? contractor.onboarding_steps_completed.join(', ') : 'None'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorDetails;
