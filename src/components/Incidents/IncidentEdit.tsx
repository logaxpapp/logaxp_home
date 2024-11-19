import React, { useState, useEffect } from 'react';
import { useUpdateIncidentMutation, useFetchIncidentByIdQuery } from '../../api/incidentApiSlice';
import Modal from '../common/Feedback/Modal';
import Button from '../common/Button/Button';
import { IncidentType, IncidentSeverity } from '../../types/incidentTypes';

interface IncidentEditProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId: string;
}

const IncidentEdit: React.FC<IncidentEditProps> = ({ isOpen, onClose, incidentId }) => {
  const { data: incident, isLoading: isFetching } = useFetchIncidentByIdQuery(incidentId, { skip: !incidentId });
  const [updateIncident, { isLoading: isUpdating }] = useUpdateIncidentMutation();

  const [formData, setFormData] = useState({
    title: '',
    type: undefined as IncidentType | undefined,
    severity: undefined as IncidentSeverity | undefined,
    location: '',
    description: '',
  });

  useEffect(() => {
    if (incident) {
      setFormData({
        title: incident.title,
        type: incident.type,
        severity: incident.severity,
        location: incident.location,
        description: incident.description,
      });
    }
  }, [incident]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateIncident({ id: incidentId, updates: formData }).unwrap(); // Pass the formData as 'updates'
      onClose();
    } catch (error) {
      console.error('Failed to update incident:', error);
    }
  };

  if (isFetching) return <p>Loading incident details...</p>;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Incident">
      <form onSubmit={handleSubmit} className="space-y-4">
        {['title', 'location', 'description'].map((field) => (
          <div key={field}>
            <label className="block text-gray-700">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field === 'description' ? 'textarea' : 'text'}
              name={field}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
        ))}
        <div>
          <label>Type</label>
          <select
            name="type"
            value={formData.type}
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
          <label>Severity</label>
          <select
            name="severity"
            value={formData.severity}
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
          <Button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md"
            disabled={isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default IncidentEdit;
