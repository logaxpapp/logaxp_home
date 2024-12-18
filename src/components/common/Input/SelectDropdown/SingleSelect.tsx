import React from 'react';
import ReactSelect, { GroupBase, SingleValue, ActionMeta } from 'react-select';

// Define the shape of each option
export interface OptionType {
  value: string;
  label: string;
}

// Define the props for SingleSelect
interface SingleSelectProps {
  label?: string;
  options: OptionType[];
  value: string | null; // Selected value
  onChange: (value: string | null) => void; // Callback to parent
  placeholder?: string;
  isDisabled?: boolean;
  required?: boolean;
  isLoading?: boolean; // Add loading state
}

const SingleSelect: React.FC<SingleSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  isDisabled = false,
  isLoading = false,
  ...rest
}) => {
  // Handle change event
  const handleChange = (
    selectedOption: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => {
    onChange(selectedOption ? selectedOption.value : null);
  };

  // Find the selected option based on the value
  const selectedOption = options.find((option) => option.value === value) || null;

  return (
    <div className="mb-4 font-secondary">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-50">
          {label}
        </label>
      )}
      <ReactSelect<OptionType, false, GroupBase<OptionType>>
        options={options}
        value={selectedOption}
        onChange={handleChange}
        isMulti={false}
        placeholder={placeholder}
        isDisabled={isDisabled || isLoading} // Disable if loading
        isLoading={isLoading} // Show loading indicator
        className="react-select-container"
        classNamePrefix="react-select"
        {...rest}
      />
    </div>
  );
};

export default SingleSelect;
