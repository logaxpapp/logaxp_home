import React from 'react';
import Select from 'react-select';
import { ICard } from '../../../types/task';
import { hasCircularDependency } from '../../../utils/cycleDetection';

interface DependencySelectorProps {
  allCards: ICard[];
  selectedDependencies: string[];
  currentTaskId: string;
  onChange: (dependencies: string[]) => void;
}

const DependencySelector: React.FC<DependencySelectorProps> = ({
  allCards,
  selectedDependencies,
  currentTaskId,
  onChange,
}) => {
  // Exclude the current task from possible dependencies to prevent self-dependency
  const options = allCards
    .filter((card) => card._id !== currentTaskId)
    .map((card) => ({
      value: card._id,
      label: card.title,
    }));

  // Map selectedDependencies to options
  const selectedOptions = options.filter((option) =>
    selectedDependencies.includes(option.value)
  );

  const handleChange = (selectedOptions: any) => {
    const dependencies = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];

    // Validate for circular dependencies
    for (const depId of dependencies) {
      if (hasCircularDependency(allCards, currentTaskId, depId)) {
        alert(`Cannot add dependency to "${allCards.find((card) => card._id === depId)?.title}" as it creates a circular dependency.`);
        return;
      }
    }

    onChange(dependencies);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Dependencies</label>
      <Select
        isMulti
        options={options}
        value={selectedOptions} // Map selected dependencies
        onChange={handleChange}
        className="mt-1"
        placeholder="Select dependencies..."
      />
    </div>
  );
};

export default DependencySelector;
