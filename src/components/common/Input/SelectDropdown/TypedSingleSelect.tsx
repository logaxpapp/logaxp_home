
import ReactSelect, { GroupBase, SingleValue, ActionMeta } from 'react-select';

// Define the shape of each option
export interface OptionType<T> {
  value: T;
  label: string;
}

// Define the props for TypedSingleSelect
interface TypedSingleSelectProps<T> {
  label?: string;
  options: OptionType<T>[]; // Array of options with typed value
  value: T | null; // Selected value
  onChange: (value: T | null) => void; // Callback to parent
  placeholder?: string;
  isDisabled?: boolean;
  required?: boolean;
  isLoading?: boolean; // Loading state
}

const TypedSingleSelect = <T extends unknown>({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  isDisabled = false,
  isLoading = false,
  ...rest
}: TypedSingleSelectProps<T>) => {
  // Handle change event
  const handleChange = (
    selectedOption: SingleValue<OptionType<T>>,
    actionMeta: ActionMeta<OptionType<T>>
  ) => {
    onChange(selectedOption ? selectedOption.value : null);
  };

  // Find the selected option based on the value
  const selectedOption = options.find((option) => option.value === value) || null;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-50">
          {label}
        </label>
      )}
      <ReactSelect<OptionType<T>, false, GroupBase<OptionType<T>>>
        options={options}
        value={selectedOption}
        onChange={handleChange}
        isMulti={false}
        placeholder={placeholder}
        isDisabled={isDisabled || isLoading}
        isLoading={isLoading}
        className="react-select-container"
        classNamePrefix="react-select"
        {...rest}
      />
    </div>
  );
};

export default TypedSingleSelect;
