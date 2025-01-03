import React, { useState } from 'react';
import { useCreateTeamMutation, useFetchSubContractorsQuery } from '../../api/usersApi';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { FiCheck, FiX } from 'react-icons/fi';

interface CreateTeamProps {
  onClose: () => void;
}

const CreateTeam: React.FC<CreateTeamProps> = ({ onClose }) => {
  const [createTeam, { isLoading }] = useCreateTeamMutation();
  const { data: subcontractors, error, isLoading: isSubLoading } = useFetchSubContractorsQuery();
  const user = useAppSelector(selectCurrentUser);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner: user?._id || '', // Automatically set owner as current user (managerId)
    members: [{ user: '', role: 'Member' }], // Default member
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMemberChange = (index: number, field: string, value: string) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData((prev) => ({ ...prev, members: updatedMembers }));
  };

  const addMember = () => {
    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, { user: '', role: 'Member' }],
    }));
  };

  const removeMember = (index: number) => {
    const updatedMembers = formData.members.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, members: updatedMembers }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Ensure the members array has valid user IDs
    const formattedData = {
      ...formData,
      owner: user?._id, // Ensure the owner is set as ObjectId
      members: formData.members.filter(member => member.user).map(member => ({
        user: member.user, // Send the user ID to the backend
        role: member.role,
      })),
    };
  
    try {
      console.log('Formatted data:', formattedData);
      await createTeam(formattedData).unwrap();
      alert('Team created successfully!');
      onClose();
    } catch (err) {
      console.error('Failed to create team:', err);
      alert('Failed to create team.');
    }
  };
  

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Team Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Team Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
    
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            rows={3}
          ></textarea>
        </div>
    
        {/* Owner */}
        <div>
          <label htmlFor="owner" className="block text-sm font-medium text-gray-700">
            Owner (Manager)
          </label>
          <input
            type="text"
            name="owner"
            id="owner"
            value={user?.name || ''} // Display name here
            disabled
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
          />
        </div>
    
        {/* Members */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Members</label>
          {isSubLoading ? (
            <p>Loading subcontractors...</p>
          ) : error ? (
            <p className="text-red-500">Failed to load subcontractors.</p>
          ) : (
            formData.members.map((member, index) => (
              <div key={index} className="flex space-x-2 items-center">
                <select
                  value={member.user}
                  onChange={(e) => handleMemberChange(index, 'user', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">Select Subcontractor</option>
                  {subcontractors?.map((sub: any) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name} {/* Display name */}
                    </option>
                  ))}
                </select>
                <select
                  value={member.role}
                  onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                  className="mt-1 block border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="Leader">Leader</option>
                  <option value="Member">Member</option>
                  <option value="Viewer">Viewer</option>
                </select>
                <button type="button" onClick={() => removeMember(index)} className="text-red-500">
                  Remove
                </button>
              </div>
            ))
          )}
          <button type="button" onClick={addMember} className="mt-2 text-teal-600 hover:underline">
            Add Member
          </button>
        </div>
    
        {/* Submit Button */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            <FiX className="mr-2" /> Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
          >
            <FiCheck className="mr-2" /> {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
      </div>
    );
}


export default CreateTeam;
