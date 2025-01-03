// src/components/Team/EditTeam.tsx

import React, { useState, useEffect } from 'react';
import { useUpdateTeamMutation } from '../../api/usersApi';
import { FiCheck, FiX } from 'react-icons/fi';

interface EditTeamProps {
  team: any; // Replace `any` with your Team type
  onClose: () => void;
}

const EditTeam: React.FC<EditTeamProps> = ({ team, onClose }) => {
  const [updateTeam, { isLoading }] = useUpdateTeamMutation();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        description: team.description || '',
      });
    }
  }, [team]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTeam({ id: team._id, updates: formData }).unwrap();
      alert('Team updated successfully!');
      onClose(); // Close the modal
    } catch (err) {
      console.error('Failed to update team:', err);
      alert('Failed to update team.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Team Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Team Name</label>
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

      {/* Team Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          rows={3}
        ></textarea>
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
          <FiCheck className="mr-2" /> {isLoading ? 'Updating...' : 'Update'}
        </button>
      </div>
    </form>
  );
};

export default EditTeam;
