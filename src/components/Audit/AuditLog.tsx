import React, { useState } from 'react';
import { useFetchAuditLogsQuery, useCreateAuditLogMutation } from '../../api/auditApi';
import Loader from '../Loader';
import { IAuditLog } from '../../types/audit';
import Pagination from '../common/Pagination/Pagination';
import Button from '../common/Button/Button';
import Modal from '../common/Feedback/Modal';

const AuditLog: React.FC = () => {
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data, isLoading, error, refetch } = useFetchAuditLogsQuery({ page, limit: 10 });
  const [createAuditLog, { isLoading: isCreating }] = useCreateAuditLogMutation();

  const [formData, setFormData] = useState({
    user: '',
    changed_by: '',
    changes: '',
  });

  const handleCreateAuditLog = async () => {
    try {
      const parsedChanges = JSON.parse(formData.changes);
      await createAuditLog({
        user: formData.user,
        changed_by: formData.changed_by,
        changes: parsedChanges,
      }).unwrap();
      alert('Audit log created successfully!');
      refetch();
      setShowCreateModal(false);
    } catch (error: any) {
      alert('Failed to create audit log. Ensure the changes field is valid JSON.');
      console.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isLoading) return <Loader />;
  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-600 font-medium">Failed to load audit logs.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={refetch}
        >
          Retry
        </button>
      </div>
    );
  }

  const { logs, total, pages } = data || { logs: [], total: 0, pages: 0 };

  if (!logs.length) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500 font-medium">No audit logs found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-8 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Audit Logs</h2>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Create Audit Log
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
              <th className="py-3 px-6 text-left">User</th>
              <th className="py-3 px-6 text-left">Changed By</th>
              <th className="py-3 px-6 text-left">Changes</th>
              <th className="py-3 px-6 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
        {logs.map((log: IAuditLog, index: number) => (
          <tr key={log._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
            <td className="py-3 px-6">
              {typeof log.user === 'object' && log.user !== null ? (
                <>
                  <p className="font-medium text-gray-700">{log.user.name || 'Unknown User'}</p>
                  <p className="text-sm text-gray-500">{log.user.email || '-'}</p>
                </>
              ) : (
                <p className="text-gray-500">User ID: {log.user}</p>
              )}
            </td>
            <td className="py-3 px-6">
              {typeof log.changed_by === 'object' && log.changed_by !== null ? (
                <>
                  <p className="font-medium text-gray-700">{log.changed_by.name || 'System'}</p>
                  <p className="text-sm text-gray-500">{log.changed_by.email || '-'}</p>
                </>
              ) : (
                <p className="text-gray-500">Admin ID: {log.changed_by}</p>
              )}
            </td>
            <td className="py-3 px-6">
              {Object.entries(log.changes || {}).map(([field, change]) => {
                const { old, new: newValue } = change as { old: any; new: any };
                return (
                  <div key={field} className="text-sm text-gray-600">
                    <strong>{field}:</strong> <br />
                    <span className="text-gray-500">Old: {JSON.stringify(old)}</span> <br />
                    <span className="text-gray-700">New: {JSON.stringify(newValue)}</span>
                  </div>
                );
              })}
            </td>
            <td className="py-3 px-6 text-gray-600 text-sm">
              {new Date(log.timestamp).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>

        </table>
      </div>
      <Pagination
        currentPage={page}
        totalPages={pages}
        onPageChange={(newPage: number) => setPage(newPage)}
      />

      {/* Create Audit Log Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Audit Log"
        >
          <div>
            <label className="block text-gray-700 font-medium">User ID</label>
            <input
              type="text"
              name="user"
              value={formData.user}
              onChange={handleInputChange}
              className="w-full mt-2 p-2 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 font-medium">Changed By (Admin ID)</label>
            <input
              type="text"
              name="changed_by"
              value={formData.changed_by}
              onChange={handleInputChange}
              className="w-full mt-2 p-2 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 font-medium">Changes (JSON format)</label>
            <textarea
              name="changes"
              value={formData.changes}
              onChange={handleInputChange}
              className="w-full mt-2 p-2 border rounded-md"
              rows={4}
              placeholder='{"fieldName": {"old": "value", "new": "value"}}'
            />
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateAuditLog}
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AuditLog;
