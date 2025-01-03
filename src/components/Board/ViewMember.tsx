import React from 'react';
import { useFetchUserByIdQuery } from '../../api/usersApi';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft, AiOutlineMail, AiOutlinePhone, AiOutlineCalendar } from 'react-icons/ai';
import { FaUserTie, FaBuilding, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';

const ViewMember: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { data: member, error, isLoading } = useFetchUserByIdQuery(userId!);

  const navigate = useNavigate();

  if (isLoading) return <p className="text-gray-500">Loading member details...</p>;
  if (error) return <p className="text-red-500">Error loading member details.</p>;
  if (!member) return <p className="text-yellow-500">No member data available.</p>;

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium px-4 py-2 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200"
      >
        <AiOutlineArrowLeft className="text-lg" />
        Go Back
      </button>

      {/* Header Section */}
      <div className="flex items-center mb-8">
        <img
          src={member.profile_picture_url || '/placeholder-profile.png'}
          alt={member.name}
          className="w-28 h-28 rounded-full mr-6 shadow-md object-cover"
        />
        <div>
          <h1 className="text-4xl font-semibold text-gray-800">{member.name}</h1>
          <p className="text-lg text-gray-600 flex items-center gap-2">
            <FaUserTie className="text-gray-500" />
            {member.job_title || 'Not Provided'}
          </p>
        </div>
      </div>

      {/* Member Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <AiOutlineMail className="text-gray-500" />
            Personal Details
          </h2>
          <p className="text-gray-700 flex items-center gap-2">
            <AiOutlineMail className="text-gray-500" />
            <strong>Email:</strong> {member.email}
          </p>
          <p className="text-gray-700 flex items-center gap-2">
            <AiOutlineCalendar className="text-gray-500" />
            <strong>Date of Birth:</strong>{' '}
            {member.date_of_birth ? new Date(member.date_of_birth).toLocaleDateString() : 'Not Provided'}
          </p>
          <p className="text-gray-700 flex items-center gap-2">
            <AiOutlinePhone className="text-gray-500" />
            <strong>Phone Number:</strong> {member.phone_number || 'Not Provided'}
          </p>
          <p className="text-gray-700 flex items-center gap-2">
            <FaUserTie className="text-gray-500" />
            <strong>Employment Type:</strong> {member.employment_type || 'Not Provided'}
          </p>
        </div>

        {/* Job Details */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FaBuilding className="text-gray-500" />
            Job Details
          </h2>
          <p className="text-gray-700 flex items-center gap-2">
            <FaUserTie className="text-gray-500" />
            <strong>Role:</strong> {member.role}
          </p>
          <p className="text-gray-700 flex items-center gap-2">
            <FaBuilding className="text-gray-500" />
            <strong>Department:</strong> {member.department || 'Not Provided'}
          </p>
          <p className="text-gray-700">
            <strong>Applications Managed:</strong>{' '}
            {member.applications_managed && member.applications_managed.length > 0 ? (
              <ul className="list-disc list-inside ml-5">
                {member.applications_managed.map((app, index) => (
                  <li key={index} className="text-gray-700">{app}</li>
                ))}
              </ul>
            ) : (
              'None'
            )}
          </p>
          <p className="text-gray-700 flex items-center gap-2">
            <AiOutlineCalendar className="text-gray-500" />
            <strong>Status:</strong> {member.status}
          </p>
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-gray-50 p-4 rounded-md shadow-sm mt-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FaMapMarkerAlt className="text-gray-500" />
          Address
        </h2>
        {member.address && member.address.street ? (
          <p className="text-gray-700">
            {member.address.street}, {member.address.city}, {member.address.state}{' '}
            {member.address.zip}, {member.address.country}
          </p>
        ) : (
          <p className="text-gray-500">No address provided.</p>
        )}
      </div>

      {/* Additional Information */}
      <div className="bg-gray-50 p-4 rounded-md shadow-sm mt-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FaDollarSign className="text-gray-500" />
          Additional Information
        </h2>
        <p className="text-gray-700">
          <strong>Hourly Rate:</strong> ${member.hourlyRate || 'Not Provided'}
        </p>
        <p className="text-gray-700">
          <strong>Overtime Rate:</strong> {member.overtimeRate ? `${member.overtimeRate}x` : 'Not Provided'}
        </p>
      </div>
    </div>
  );
};

export default ViewMember;
