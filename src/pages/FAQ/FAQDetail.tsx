// src/components/FAQ/FAQDetail.tsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetFAQByIdQuery } from '../../api/faqApi';
import Button from '../../components/common/Button/Button';
import { FaArrowLeft } from 'react-icons/fa';
import { useToast } from '../../features/Toast/ToastContext';


export enum Application {
    DocSend = 'DocSend',
    TimeSync = 'TimeSync',
    TaskBrick = 'TaskBrick',
    Beautyhub = 'Beautyhub',
    BookMiz = 'BookMiz',
    GatherPlux = 'GatherPlux',
  }

const FAQDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract ID from URL
  const { data: faq, isLoading, error } = useGetFAQByIdQuery(id || '');
  const { showToast } = useToast();

  if (isLoading) return <div>Loading FAQ details...</div>;
  if (error) {
    showToast('Error loading FAQ details.', 'error');
    return <div>Error loading FAQ details.</div>;
  }
  if (!faq) {
    showToast('FAQ not found.', 'error');
    return <div>FAQ not found.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mx-auto">
      <Link to="/dashboard/faqs">
        <Button variant="secondary" leftIcon={<FaArrowLeft />}>
          Back to FAQs
        </Button>
      </Link>
      
      <h2 className="text-2xl font-bold mt-4 mb-2">{faq.question}</h2>
      <p className="text-gray-700 mb-4">{faq.answer}</p>
      <p className="text-sm text-gray-500">
        Application: <span className="font-medium">{faq.application}</span>
      </p>
      <p className="text-sm text-gray-500">
        Created At: <span className="font-medium">{new Date(faq.createdAt).toLocaleString()}</span>
      </p>
      {faq.updatedAt && (
        <p className="text-sm text-gray-500">
          Updated At: <span className="font-medium">{new Date(faq.updatedAt).toLocaleString()}</span>
        </p>
      )}
    </div>
  );
};

export default FAQDetail;
