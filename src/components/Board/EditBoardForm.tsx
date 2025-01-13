import React, { useState, useEffect } from 'react';
import { useUpdateBoardMutation } from '../../api/tasksApi';
import { useFetchTeamsQuery, useCreateTeamMutation } from '../../api/usersApi';
import { useToast } from '../../features/Toast/ToastContext';
import { IBoard } from '../../types/task';
import { ITeam } from '../../types/team';
import { useNavigate } from 'react-router-dom';

interface EditBoardFormProps {
  board: IBoard;
  onClose: () => void;
}

const EditBoardForm: React.FC<EditBoardFormProps> = ({ board, onClose }) => {
  const [name, setName] = useState(board.name);
  const [description, setDescription] = useState(board.description || '');
  const [teamId, setTeamId] = useState<string>(board.team?._id || ''); // Initialize with the board's team ID
  const [teamName, setTeamName] = useState<string>(board.team?.name || ''); // Initialize with the team name

  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');

  const { data: teamsData, isLoading: loadingTeams } = useFetchTeamsQuery({ page: 1, limit: 100 });
  const [updateBoard, { isLoading: updatingBoard }] = useUpdateBoardMutation();
  const [createTeam, { isLoading: creatingTeam }] = useCreateTeamMutation();

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    // Ensure the initial team is properly set in the dropdown
    if ( teamsData) {
      const initialTeam = teamsData.teams.find((team: ITeam) => team._id === teamId);
      if (initialTeam) {
        setTeamId(initialTeam._id);
        setTeamName(initialTeam.name);
      }
    }
  }, [teamsData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !teamId.trim()) {
      showToast('Board name and team are required.', 'error');
      return;
    }

    try {
      await updateBoard({ _id: board._id, name: name.trim(), description: description.trim(), teamId }).unwrap();
      showToast('Board updated successfully!', 'success');
      onClose();
      navigate(`/dashboard/boards/${board._id}`);
    } catch (err: any) {
      console.error('Failed to update board:', err);
      showToast(err?.data?.message || 'Error updating board.', 'error');
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) {
      showToast('Team name is required.', 'error');
      return;
    }

    try {
      const createdTeam = await createTeam({
        name: newTeamName.trim(),
        description: newTeamDescription.trim(),
      }).unwrap();

      showToast('Team created successfully!', 'success');
      setTeamId(createdTeam._id);
      setTeamName(createdTeam.name);
      setNewTeamName('');
      setNewTeamDescription('');
      setIsCreatingTeam(false);
    } catch (err: any) {
      console.error('Failed to create team:', err);
      showToast(err?.data?.message || 'Error creating team.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Board Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Board Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Enter board name"
        />
      </div>

      {/* Board Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Board Description
        </label>
        <textarea
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Enter board description (optional)"
        />
      </div>

      {/* Team Selection or Creation */}
      {!isCreatingTeam ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Team <span className="text-red-500">*</span>
          </label>
          {loadingTeams ? (
            <p className="text-gray-500">Loading teams...</p>
          ) : (
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
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
      ) : (
        <div className="space-y-2">
          <h3 className="text-md font-semibold">Create a New Team</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Team Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              required
              placeholder="Enter team name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Team Description</label>
            <textarea
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
              value={newTeamDescription}
              onChange={(e) => setNewTeamDescription(e.target.value)}
              rows={3}
              placeholder="Enter team description (optional)"
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
          updatingBoard ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={updatingBoard}
      >
        {updatingBoard ? 'Updating...' : 'Update Board'}
      </button>
    </form>
  );
};

export default EditBoardForm;
