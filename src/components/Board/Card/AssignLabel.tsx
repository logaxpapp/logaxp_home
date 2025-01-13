// src/components/Cards/AssignLabel.tsx

import React, { useEffect } from 'react';
import { useAddLabelToCardMutation, useRemoveLabelFromCardMutation } from '../../../api/cardApi';
import { useGetLabelsByBoardQuery } from '../../../api/tasksApi';
import { ILabel } from '../../../types/task';
import { useToast } from '../../../features/Toast/ToastContext';

interface AssignLabelProps {
  cardId: string;
  boardId: string;
  currentLabels: ILabel[];
  setCurrentLabels: React.Dispatch<React.SetStateAction<ILabel[]>>;
}

const AssignLabel: React.FC<AssignLabelProps> = ({ cardId, boardId, currentLabels, setCurrentLabels }) => {
  const { data: labels, isLoading: labelsLoading } = useGetLabelsByBoardQuery(boardId);
  const [addLabelToCard, { isLoading: adding }] = useAddLabelToCardMutation();
  const [removeLabelFromCard, { isLoading: removing }] = useRemoveLabelFromCardMutation();

  const { showToast } = useToast();
    // const labels: ILabel[] | undefined
    console.log('Current labels:', currentLabels);

  const handleLabelChange = async (labelId: string, isChecked: boolean) => {
    if (isChecked) {
      const updatedCard = await addLabelToCard({ cardId, labelId }).unwrap();
      setCurrentLabels(updatedCard.labels);
      showToast('Label assigned successfully!', 'success');
    } else {
      const updatedCard = await removeLabelFromCard({ cardId, labelId }).unwrap();
      setCurrentLabels(updatedCard.labels);
      showToast('Label removed successfully!', 'success');
    }
  };

  if (labelsLoading) return <p>Loading labels...</p>;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Assign Labels</h3>
      {labels && labels.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {labels.map((label) => (
            <label key={label._id} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={currentLabels.some((cl) => cl._id === label._id)}
                onChange={(e) => handleLabelChange(label._id, e.target.checked)}
                disabled={adding || removing}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span
                className="px-2 py-1 text-xs rounded"
                style={{ backgroundColor: label.color, color: '#fff' }}
              >
                {label.name}
              </span>
            </label>
          ))}
        </div>
      ) : (
        <p>No labels available. Create some labels first.</p>
      )}
    </div>
  );
};

export default AssignLabel;
