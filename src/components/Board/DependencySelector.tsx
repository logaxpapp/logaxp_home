// src/components/Board/Card/DependencySelector.tsx

import React from 'react';
import Select from 'react-select';
import { ICard } from '../../types/task';

interface DependencySelectorProps {
  allCards: ICard[]; // All available tasks
  selectedDependencies: string[]; // Currently selected dependencies
  onChange: (dependencies: string[]) => void; // Handler to update dependencies
}

const DependencySelector: React.FC<DependencySelectorProps> = ({
  allCards,
  selectedDependencies,
  onChange,
}) => {
  // Exclude the current task from possible dependencies to prevent circular dependencies
  const options = allCards
    .filter(card => !selectedDependencies.includes(card._id))
    .map(card => ({
      value: card._id,
      label: card.title,
    }));

  const handleChange = (selectedOptions: any) => {
    const dependencies = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    onChange(dependencies);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Dependencies</label>
      <Select
        isMulti
        options={options}
        value={options.filter(option => selectedDependencies.includes(option.value))}
        onChange={handleChange}
        className="mt-1"
        placeholder="Select dependencies..."
      />
    </div>
  );
};

export default DependencySelector;
