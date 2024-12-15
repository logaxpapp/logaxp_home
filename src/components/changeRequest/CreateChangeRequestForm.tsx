import React, { useState } from 'react';
import { useCreateChangeRequestMutation } from '../../api/changeRequestApi';
import { useToast } from '../../features/Toast/ToastContext';
import FormField from './FormField';
import AddressFields from './AddressFields';
import Sidebar from './Sidebar';
import Header from './Header';
import ProgressBar from './ProgressBar';

const fieldConfigs = [
  { field: 'name', label: 'Full Name', type: 'text' },
  { field: 'email', label: 'Email Address', type: 'email' },
  { field: 'phone_number', label: 'Phone Number', type: 'text' },
  { field: 'address', label: 'Address', type: 'address' },
  { field: 'profile_picture_url', label: 'Profile Picture URL', type: 'url' },
  { field: 'date_of_birth', label: 'Date of Birth', type: 'date' },
  {
    field: 'employment_type',
    label: 'Employment Type',
    type: 'select',
    options: ['Full-Time', 'Part-Time', 'Contract'],
  },
  { field: 'hourlyRate', label: 'Hourly Rate', type: 'number' },
  { field: 'overtimeRate', label: 'Overtime Rate', type: 'number' },
  { field: 'job_title', label: 'Job Title', type: 'text' },
  { field: 'department', label: 'Department', type: 'text' },
];

const CreateChangeRequestForm: React.FC = () => {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [fieldsToChange, setFieldsToChange] = useState<Record<string, any>>({});
  const [createChangeRequest, { isLoading }] = useCreateChangeRequestMutation();
  const { showToast } = useToast();

  const handleFieldToggle = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );

    setFieldsToChange((prev) => {
      if (prev[field]) {
        const updatedFields = { ...prev };
        delete updatedFields[field];
        return updatedFields;
      }
      return prev;
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFieldsToChange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFields.length === 0) {
      showToast('Please select at least one field to change.', 'error');
      return;
    }
    try {
      await createChangeRequest({ fields_to_change: fieldsToChange }).unwrap();
      showToast('Change request submitted successfully.', 'success');
      setSelectedFields([]);
      setFieldsToChange({});
    } catch (error: any) {
      showToast(error?.data?.message || 'Failed to submit change request.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full mx-auto p-6 lg:px-8">
  <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden w-full">
    {/* Sidebar */}
    <Sidebar
      fieldConfigs={fieldConfigs}
      selectedFields={selectedFields}
      onFieldToggle={handleFieldToggle}
    />

    {/* Form Section */}
    <section className="md:w-3/4 p-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Submit Change Request
      </h2>
      <ProgressBar
        currentStep={selectedFields.length}
        totalSteps={fieldConfigs.length}
      />
      {selectedFields.length === 0 ? (
        <p className="text-gray-500">Select a field to begin making changes.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {selectedFields.map((field) => {
            const config = fieldConfigs.find((cfg) => cfg.field === field);
            if (!config) return null;

            if (config.type === 'address') {
              return (
                <AddressFields
                  key={field}
                  address={fieldsToChange.address || {}}
                  onChange={(addressField, value) =>
                    handleInputChange(`address.${addressField}`, value)
                  }
                />
              );
            }

            return (
              <FormField
                key={field}
                label={config.label}
                type={config.type}
                id={field}
                name={field}
                value={fieldsToChange[field] || ''}
                placeholder={`Enter new ${config.label}`}
                onChange={(e) => handleInputChange(field, e.target.value)}
                options={config.options}
              />
            );
          })}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-lg font-medium text-white ${
              isLoading ? 'bg-lemonGreen' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Submitting...' : 'Submit Change Request'}
          </button>
        </form>
      )}
    </section>
  </div>
</main>

    </div>
  );
};

export default CreateChangeRequestForm;
