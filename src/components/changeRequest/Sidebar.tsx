import React from 'react';

const Sidebar: React.FC<{
  fieldConfigs: any[];
  selectedFields: string[];
  onFieldToggle: (field: string) => void;
}> = ({ fieldConfigs, selectedFields, onFieldToggle }) => {
  return (
    <aside className="md:w-1/4 p-6 border-r bg-gray-50 border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Fields to Change</h2>
      <ul className="space-y-3">
        {fieldConfigs.map((config) => (
          <li key={config.field}>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedFields.includes(config.field)}
                onChange={() => onFieldToggle(config.field)}
                className="h-5 w-5 text-blue-600 focus:ring focus:ring-blue-400 rounded"
              />
              <span className="text-gray-700">{config.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
