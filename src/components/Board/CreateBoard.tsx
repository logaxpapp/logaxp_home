// src/components/CreateBoard.tsx
import React, { useState } from 'react';
import { useCreateBoardMutation } from '../../api/tasksApi';
import { useFetchTeamsQuery, useCreateTeamMutation } from '../../api/usersApi';
import { useToast } from '../../features/Toast/ToastContext';
import { useNavigate } from 'react-router-dom';

interface ITeam {
  _id: string;
  name: string;
  // ...other properties
}

const CreateBoard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [teamId, setTeamId] = useState('');

  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');

  const { data: teamsData, isLoading: loadingTeams } = useFetchTeamsQuery({ page: 1, limit: 10 });
  const [createBoard, { isLoading: creatingBoard }] = useCreateBoardMutation();
  const [createTeam, { isLoading: creatingTeam }] = useCreateTeamMutation();

  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmitBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !teamId.trim()) {
      showToast('Board name and team are required.', 'error');
      return;
    }

    try {
      // Create the board
      await createBoard({ name: name.trim(), description: description.trim(), teamId }).unwrap();
      showToast('Board created successfully!', 'success');

      // Reset fields
      setName('');
      setDescription('');
      setTeamId('');
      onClose();

      // Navigate to boards listing
      navigate('/dashboard/boards');
    } catch (err: any) {
      console.error('Failed to create board:', err);
      showToast(err?.data?.message || 'Error creating board.', 'error');
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) {
      showToast('Team name is required.', 'error');
      return;
    }

    try {
      // Create the team
      const createdTeam = await createTeam({
        name: newTeamName.trim(),
        description: newTeamDescription.trim(),
      }).unwrap();

      showToast('Team created successfully!', 'success');

      // Automatically select this new team in the dropdown
      setTeamId(createdTeam._id);

      // Reset create-team fields
      setNewTeamName('');
      setNewTeamDescription('');
      setIsCreatingTeam(false);
    } catch (err: any) {
      console.error('Failed to create team:', err);
      showToast(err?.data?.message || 'Error creating team.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmitBoard} className="space-y-4">
      {/* Board Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Board Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Board Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Board Description
        </label>
        <textarea
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      {/* Team Selection or Creation */}
      {!isCreatingTeam ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Team <span className="text-red-500">*</span>
            </label>
            {loadingTeams ? (
              <p>Loading teams...</p>
            ) : (
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">-- Select Team --</option>
                {teamsData?.teams.map((team: ITeam) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
            )}
            <button
              type="button"
              onClick={() => setIsCreatingTeam(true)}
              className="text-blue-600 hover:underline text-sm mt-2"
            >
              Or create a new team
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <h3 className="text-md font-semibold">Create a New Team</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Team Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Team Description</label>
            <textarea
              className="w-full p-2 border rounded"
              value={newTeamDescription}
              onChange={(e) => setNewTeamDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              onClick={() => setIsCreatingTeam(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
              onClick={handleCreateTeam}
              disabled={creatingTeam}
            >
              {creatingTeam ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
          creatingBoard ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={creatingBoard}
      >
        {creatingBoard ? 'Creating...' : 'Create Board'}
      </button>
    </form>
  );
};

export default CreateBoard;
