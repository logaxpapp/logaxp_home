// src/components/MultiSelect.tsx

import React from 'react';
import ReactSelect, { GroupBase, MultiValue, ActionMeta, StylesConfig } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import AsyncSelect from 'react-select/async';

// Define the shape of each option
export interface OptionType {
  value: string;
  label: string;
  group: 'Users' | 'Teams';
}

// Define the group type
export interface GroupedOptionType {
  label: string;
  options: OptionType[];
}

// Define the props for MultiSelect
interface MultiSelectProps {
  label?: string;
  options: GroupedOptionType[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isCreatable?: boolean;
  isAsync?: boolean;
  loadOptions?: (inputValue: string) => Promise<GroupedOptionType[]>;
  onCreateOption?: (inputValue: string) => void;
  // Add any other props you need to pass to ReactSelect
}

// Define custom styles
const customStyles: StylesConfig<OptionType, true, GroupBase<OptionType>> = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
    '&:hover': {
      borderColor: '#3b82f6',
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#d1eaff',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#1e3a8a',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#1e3a8a',
    ':hover': {
      backgroundColor: '#1e40af',
      color: 'white',
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#3b82f6'
      : state.isFocused
      ? '#d1eaff'
      : 'white',
    color: state.isSelected ? 'white' : 'black',
    cursor: 'pointer',
  }),
};

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  isDisabled = false,
  isCreatable = false,
  isAsync = false,
  loadOptions,
  onCreateOption,
  ...rest
}) => {
  // Handle change event
  const handleChange = (
    selectedOptions: MultiValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => {
    const values = selectedOptions.map((option) => option.value);
    onChange(values);
  };

  // Find the selected options based on the value array
  const selectedValue = options
    .flatMap((group) => group.options)
    .filter((option) => value.includes(option.value));

  return (
    <div className="mb-4 dark:text-gray-50">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-50">
          {label}
        </label>
      )}
      {isAsync ? (
        <AsyncSelect<OptionType, true, GroupBase<OptionType>>
          cacheOptions
          loadOptions={loadOptions}
          defaultOptions
          value={selectedValue}
          onChange={handleChange}
          isMulti={true}
          placeholder={placeholder}
          isDisabled={isDisabled}
          className="react-select-container"
          classNamePrefix="react-select"
          styles={customStyles}
          {...rest}
        />
      ) : isCreatable ? (
        <CreatableSelect<OptionType, true, GroupBase<OptionType>>
          options={options}
          value={selectedValue}
          onChange={handleChange}
          onCreateOption={onCreateOption}
          isMulti={true}
          placeholder={placeholder}
          isDisabled={isDisabled}
          className="react-select-container"
          classNamePrefix="react-select"
          styles={customStyles}
          {...rest}
        />
      ) : (
        <ReactSelect<OptionType, true, GroupBase<OptionType>>
          options={options}
          value={selectedValue}
          onChange={handleChange}
          isMulti={true}
          placeholder={placeholder}
          isDisabled={isDisabled}
          className="react-select-container"
          classNamePrefix="react-select"
          styles={customStyles}
          {...rest}
        />
      )}
    </div>
  );
};

export default MultiSelect;
