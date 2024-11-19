import React from 'react';
import { useFetchIncidentByIdQuery } from '../../api/incidentApiSlice';
import Modal from '../common/Feedback/Modal';
import Button from '../common/Button/Button';

interface IncidentDetailProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId: string; // Pass the incident ID directly
}

const IncidentDetail: React.FC<IncidentDetailProps> = ({ isOpen, onClose, incidentId }) => {
  const { data: incident, isLoading, error } = useFetchIncidentByIdQuery(incidentId, { skip: !incidentId });

  if (isLoading) return <Modal isOpen={isOpen} onClose={onClose} title="Loading...">Loading incident details...</Modal>;
  if (error || !incident) return <Modal isOpen={isOpen} onClose={onClose} title="Error">Error loading incident details.</Modal>;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Incident: ${incident.title}`}>
      <div className="space-y-4">
        <p><strong>Type:</strong> {incident.type}</p>
        <p><strong>Severity:</strong> {incident.severity}</p>
        <p><strong>Location:</strong> {incident.location}</p>
        <p><strong>Description:</strong> {incident.description}</p>
        <p><strong>Created By:</strong> {incident.createdBy.name}</p>
        <p><strong>Created At:</strong> {new Date(incident.createdAt).toLocaleString()}</p>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default IncidentDetail;
