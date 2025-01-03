import React, { useState } from 'react';
import { useFetchSentDocumentsQuery } from '../../api/documentApi';
import Button from '../common/Button/Button';
import { Link } from 'react-router-dom';
import { FiRefreshCw, FiFileText, FiArrowRight } from 'react-icons/fi';

const SentDocuments: React.FC = () => {
  const [filter, setFilter] = useState<'toMe' | 'byMe'>('toMe');
  const { data: docs, isLoading, isError, refetch } = useFetchSentDocumentsQuery({ filter });

  // Handle refresh
  const handleRefresh = () => {
    refetch();
  };
 console.log('Docs:', docs);
  // Render recipient information dynamically
  const renderRecipientInfo = (doc: any) => {
    if (doc.recipientEmail) {
      return (
        <p className="text-sm text-gray-500">
          Sent to: <span className="font-medium">{doc.recipientEmail}</span> (external email)
        </p>
      );
    }
    if (doc.recipientUser && doc.recipientUser.name) {
      return (
        <p className="text-sm text-gray-500">
          Sent to: <span className="font-medium">{doc.recipientUser.name}</span> (
          {doc.recipientUser.email})
        </p>
      );
    }
    return <p className="text-sm text-gray-500">Recipient:
    <span>{doc.sentBy.name}</span>(
        {doc.sentBy.email}) </p>;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header (Filters and Refresh) */}
      <div className="bg-white shadow-md p-4 flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {filter === 'toMe' ? 'Documents Sent to Me' : 'Documents I Sent'}
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={handleRefresh}
          >
            <FiRefreshCw />
            <span>Refresh</span>
          </Button>
          <Button
            variant={filter === 'toMe' ? 'primary' : 'outline'}
            onClick={() => setFilter('toMe')}
          >
            To Me
          </Button>
          <Button
            variant={filter === 'byMe' ? 'primary' : 'outline'}
            onClick={() => setFilter('byMe')}
          >
            By Me
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Loading, Error, Empty States */}
        {isLoading && <p className="text-gray-600 text-lg animate-pulse">Loading documents...</p>}
        {isError && (
          <p className="text-red-600 text-lg font-semibold">Oops! Error loading documents.</p>
        )}
        {!isLoading && docs && docs.length === 0 && (
          <p className="text-gray-500 text-lg">No documents found for this filter.</p>
        )}

        {/* Documents List */}
        {docs && docs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs.map((doc) => (
              <div
                key={doc._id}
                className="p-4 bg-white rounded-md shadow hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FiFileText className="text-blue-600" size={24} />
                    <h2 className="text-xl font-semibold text-gray-800">{doc.title}</h2>
                  </div>
                  <p className="text-gray-600 mb-2">
                    {doc.description || 'No description available.'}
                  </p>
                  {/* Recipient Info */}
                  {renderRecipientInfo(doc)}
                </div>
                {/* Action Buttons */}
                <div className="mt-4 flex items-center gap-3">
                  <Link
                    to={`/dashboard/documents/${doc._id}/details`}
                    className="flex items-center text-blue-600 hover:underline text-sm gap-1"
                  >
                    Open <FiArrowRight />
                  </Link>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => console.log('Resend clicked')}
                  >
                    Resend
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SentDocuments;
