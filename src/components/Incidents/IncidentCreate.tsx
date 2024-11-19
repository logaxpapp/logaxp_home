import React, { useState } from 'react';
import { useCreateIncidentMutation } from '../../api/incidentApiSlice';
import Modal from '../common/Feedback/Modal';
import Button from '../common/Button/Button';
import { IncidentType, IncidentSeverity } from '../../types/incidentTypes';

interface IncidentCreateProps {
  isOpen: boolean;
  onClose: () => void;
}

const IncidentCreate: React.FC<IncidentCreateProps> = ({ isOpen, onClose }) => {
  const [createIncident, { isLoading }] = useCreateIncidentMutation();

  const [formData, setFormData] = useState({
    title: '',
    type: undefined as IncidentType | undefined,
    severity: undefined as IncidentSeverity | undefined,
    location: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value || undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(formData).some((field) => !field)) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      await createIncident(formData).unwrap();
      onClose();
      setFormData({ title: '', type: undefined, severity: undefined, location: '', description: '' });
    } catch (error) {
      console.error('Failed to create incident:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Incident">
      <form onSubmit={handleSubmit} className="space-y-4">
        {['title', 'location', 'description'].map((field) => (
          <div key={field}>
            <label className="block text-gray-700">
              {field.charAt(0).toUpperCase() + field.slice(1)}*
            </label>
            <input
              type="text"
              name={field}
              value={formData[field as keyof typeof formData] as string}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
        ))}
        <div>
          <label>Type*</label>
          <select
            name="type"
            value={formData.type || ''}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Type</option>
            {Object.values(IncidentType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Severity*</label>
          <select
            name="severity"
            value={formData.severity || ''}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Severity</option>
            {Object.values(IncidentSeverity).map((severity) => (
              <option key={severity} value={severity}>
                {severity}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} type="button" className="bg-gray-500 text-white px-4 py-2 rounded-md">
            Cancel
          </Button>
          <Button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md" disabled={isLoading}>
            {isLoading ? 'Posting...' : 'Create Incident'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default IncidentCreate;
