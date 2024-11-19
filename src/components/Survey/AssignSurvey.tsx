import React, { useState } from 'react';
import { useAssignSurveyMutation, useGetAllSurveysQuery } from '../../api/surveyApi';
import { useFetchAllUsersQuery } from '../../api/usersApi';
import MultiSelect, { OptionType } from '../../components/common/Input/SelectDropdown/MultiSelect';
import Button from '../../components/common/Button/Button';
import { FaCheck, FaCalendarAlt } from 'react-icons/fa';
import { useToast } from '../../features/Toast/ToastContext';

const AssignSurvey: React.FC = () => {
  const [assignSurvey] = useAssignSurveyMutation();
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const showToast = useToast().showToast; // Access the showToast function

  // Fetch all users and surveys
  const { data: users, isLoading: isUsersLoading } = useFetchAllUsersQuery({page: 1, limit: 1000 });
  const { data: surveys, isLoading: isSurveysLoading } = useGetAllSurveysQuery();

  // Convert users and surveys to OptionType for MultiSelect
  const userOptions: OptionType[] = users?.users.map((user) => ({
    value: user._id,
    label: `${user.name} (${user.email})`,
  })) || [];

  const surveyOptions: OptionType[] = surveys?.map((survey) => ({
    value: survey._id,
    label: survey.title,
  })) || [];

  const handleAssign = async () => {
    if (!selectedSurveyId) {
      showToast('Please select a survey to assign.', 'error');
      return;
    }

    try {
      await assignSurvey({ surveyId: selectedSurveyId, userIds: selectedUserIds, dueDate }).unwrap();
      showToast('Survey assigned successfully!', 'success'); // Show success toast
      setSelectedSurveyId(null); // Clear selections after success
      setSelectedUserIds([]);
      setDueDate('');
    } catch (error) {
      console.error("Failed to assign survey:", error);
      showToast("Failed to assign survey. Please try again.", "error"); // Show error toast
    }
  };

  return (
    <div className="bg-blue-50 p-4">
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
      <h2 className="text-3xl font-bold text-blue-700  font-primary text-center">Assign Survey</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Survey Selection */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">1. Choose a Survey</h3>
          <MultiSelect
            label="Select Survey"
            options={surveyOptions}
            value={selectedSurveyId ? [selectedSurveyId] : []}
            onChange={(values) => setSelectedSurveyId(values[0] || null)}
            placeholder="Select survey..."
            isDisabled={isSurveysLoading}
          />
        </div>

        {/* User Selection */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">2. Select Users</h3>
          <MultiSelect
            label="Assign to Users"
            options={userOptions}
            value={selectedUserIds}
            onChange={setSelectedUserIds}
            placeholder="Select users..."
            isDisabled={isUsersLoading}
          />
        </div>

        {/* Due Date Input */}
        <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">3. Set Due Date</h3>
          <div className="flex items-center gap-4">
            <FaCalendarAlt className="text-gray-500" />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="Select due date"
            />
          </div>
        </div>
      </div>

      {/* Assign Button */}
      <div className="mt-8 text-center">
        <Button
          variant="success"
          size="large"
          onClick={handleAssign}
          disabled={isUsersLoading || isSurveysLoading || !selectedSurveyId || selectedUserIds.length === 0}
          leftIcon={<FaCheck />}
          className="px-6 py-3 text-lg font-semibold bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors duration-200"
        >
          Assign Survey
        </Button>
      </div>
    </div>
  );
};

export default AssignSurvey;
