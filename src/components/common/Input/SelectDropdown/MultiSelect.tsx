import React from 'react';
import ReactSelect, { GroupBase, MultiValue, ActionMeta } from 'react-select';

// Define the shape of each option
export interface OptionType {
  value: string;
  label: string;
}

// Define the props for MultiSelect
interface MultiSelectProps {
  label?: string;
  options: OptionType[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  isDisabled?: boolean;
  // Add any other props you need to pass to ReactSelect
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  isDisabled = false,
  ...rest
}) => {
  // Handle change event
  const handleChange = (
    selectedOptions: MultiValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => {
    const values = selectedOptions.map((option) => option.value);
    onChange(values); // Always returns string[] and avoids null
  };

  // Find the selected options based on the value array
  const selectedValue = options.filter((option) => value.includes(option.value)) || [];

  return (
    <div className="mb-4 dark:text-gray-50">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-50">
          {label}
        </label>
      )}
      <ReactSelect<OptionType, true, GroupBase<OptionType>>
        options={options}
        value={selectedValue}
        onChange={handleChange}
        isMulti={true}
        placeholder={placeholder}
        isDisabled={isDisabled}
        className="react-select-container"
        classNamePrefix="react-select"
        {...rest}
      />
    </div>
  );
};

export default MultiSelect;
