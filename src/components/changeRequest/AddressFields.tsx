// src/components/AddressFields.tsx

import React from 'react';
import { IAddress } from '../../types/user';

interface AddressFieldsProps {
  address: Partial<IAddress>;
  onChange: (addressField: keyof IAddress, value: string) => void;
}

const AddressFields: React.FC<AddressFieldsProps> = ({ address, onChange }) => {
  const fields: (keyof IAddress)[] = ['street', 'city', 'state', 'zip', 'country'];

  return (
    <div className="border border-gray-300 p-4 rounded-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Address Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              id={field}
              name={field}
              value={address[field] || ''}
              onChange={(e) => onChange(field, e.target.value)}
              placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressFields;
