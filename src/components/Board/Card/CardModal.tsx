// src/components/Card/CardModal.tsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import { ICard } from '../../../types/task';
import EditCardForm from './EditCardForm';
import SubTaskSection from './SubTaskSection';
import TimeLogSection from './TimeLogSection';
import CustomFieldSection from './CustomFieldSection';
import { FiX, FiList, FiClock, FiEdit3 } from 'react-icons/fi';

interface CardModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  card: ICard;
}

// For styling the modal overlay, etc.
Modal.setAppElement('#root');

const CardModal: React.FC<CardModalProps> = ({ isOpen, onRequestClose, card }) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'subtasks' | 'timelogs' | 'customfields'>('edit');

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Card Details"
      className="mx-auto mt-20 bg-white p-4 rounded-md shadow-lg outline-none max-w-2xl"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Card Details</h2>
        <button onClick={onRequestClose} className="text-gray-600 hover:text-gray-800">
          <FiX size={20} />
        </button>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab('edit')}
          className={`px-3 py-1 rounded ${activeTab === 'edit' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <FiEdit3 className="inline mr-1" />
          Edit
        </button>
        <button
          onClick={() => setActiveTab('subtasks')}
          className={`px-3 py-1 rounded ${activeTab === 'subtasks' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <FiList className="inline mr-1" />
          Sub-Tasks
        </button>
        <button
          onClick={() => setActiveTab('timelogs')}
          className={`px-3 py-1 rounded ${activeTab === 'timelogs' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <FiClock className="inline mr-1" />
          Time Logs
        </button>
        <button
          onClick={() => setActiveTab('customfields')}
          className={`px-3 py-1 rounded ${activeTab === 'customfields' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          CF
        </button>
      </div>

      {/* TAB CONTENT */}
      <div>
        {activeTab === 'edit' && <EditCardForm card={card} onClose={onRequestClose} />}
        {activeTab === 'subtasks' && <SubTaskSection card={card} />}
        {activeTab === 'timelogs' && <TimeLogSection card={card} />}
        {activeTab === 'customfields' && <CustomFieldSection card={card} />}
      </div>
    </Modal>
  );
};

export default CardModal;
