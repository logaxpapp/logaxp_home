// src/components/ReferenceDetail.tsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetReferenceQuery,
  useSendReferenceMutation,
  useReceiveReferenceMutation,
  useCompleteReferenceMutation,
  useRejectReferenceMutation,
  useDeleteReferenceMutation,
} from '../../api/referenceApi';
import { IReference, ReferenceStatus } from '../../types/reference';
import { useToast } from '../../features/Toast/ToastContext';

const ReferenceDetail: React.FC = () => {
  const { referenceId } = useParams<{ referenceId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // 1) Fetch the reference data
  const {
    data: reference,
    error,
    isLoading,
    refetch,
  } = useGetReferenceQuery(referenceId!, {});

  // 2) Mutations for actions
  const [sendReference, { isLoading: isSending }] = useSendReferenceMutation();
  const [receiveReference] = useReceiveReferenceMutation();
  const [completeReference] = useCompleteReferenceMutation();
  const [rejectReference] = useRejectReferenceMutation();
  const [deleteReference, { isLoading: isDeleting }] = useDeleteReferenceMutation();

  // Action handlers
  const handleSend = async () => {
    if (!referenceId) return;
    if (!window.confirm('Send this reference request now?')) return;
    try {
      await sendReference(referenceId).unwrap();
      showToast('Reference sent successfully!', 'success');
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to send reference.', 'error');
    }
  };

  const handleReceive = async () => {
    if (!referenceId) return;
    try {
      await receiveReference(referenceId).unwrap();
      showToast('Reference marked as received!', 'success');
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to mark as received.', 'error');
    }
  };

  const handleComplete = async () => {
    if (!referenceId) return;
    try {
      await completeReference(referenceId).unwrap();
      showToast('Reference marked as completed!', 'success');
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to complete reference.', 'error');
    }
  };

  const handleReject = async () => {
    if (!referenceId) return;
    const reason = prompt('Enter rejection reason:');
    if (!reason) {
      showToast('Rejection reason is required.', 'error');
      return;
    }
    try {
      await rejectReference({ id: referenceId, rejectionReason: reason }).unwrap();
      showToast('Reference rejected successfully!', 'success');
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to reject reference.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!referenceId) return;
    if (!window.confirm('Are you sure you want to delete this reference?')) return;
    try {
      await deleteReference(referenceId).unwrap();
      showToast('Reference deleted successfully!', 'success');
      navigate('/dashboard/references');
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to delete reference.', 'error');
    }
  };

  // Loading / Error states
  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading reference details...</p>
      </div>
    );
  }
  if (error || !reference) {
    return (
      <div className="p-6 text-red-600">
        <p>Failed to load reference or reference not found.</p>
      </div>
    );
  }

  // 3) Render Reference Details
  // ----------------------------------------------
  // Helper to format dates (if desired)
  const formatDate = (dateValue?: Date | string) => {
    if (!dateValue) return 'N/A';
    const dateObj = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    if (isNaN(dateObj.valueOf())) return 'N/A';
    return dateObj.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="mx-auto p-6 bg-white shadow-md rounded m-2 ">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline inline-block"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Reference Detail</h2>

      {/* Grid layout to group sections nicely */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Column: Applicant & Referee Summary */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Applicant & Referee</h3>
          
          {/* Applicant */}
          <div className="mb-3">
            <h4 className="text-sm text-gray-500">Applicant</h4>
            {typeof reference.applicant === 'object' ? (
              <p className="text-base text-gray-800 font-medium">
                {reference.applicant.name ?? '(No name)'} 
                {' | '} 
                {reference.applicant.email ?? '(No email)'}
              </p>
            ) : (
              <p className="text-base text-gray-800 font-medium">{String(reference.applicant)}</p>
            )}
          </div>

          {/* Referee */}
          <div className="mb-3">
            <h4 className="text-sm text-gray-500">Referee (From Referee Table)</h4>
            {typeof reference.referee === 'object' ? (
              <>
                <p className="text-base text-gray-800 font-medium">
                  {reference.referee.name ?? '(No name)'} 
                  {' | '} 
                  {reference.referee.email ?? '(No email)'}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  Position (Referee): {reference.referee.positionHeld || 'N/A'}
                </p>
                <p className="text-sm text-gray-700">
                  Company: {reference.referee.companyName || 'N/A'}
                </p>
              </>
            ) : (
              <p className="text-base text-gray-800 font-medium">{String(reference.referee)}</p>
            )}
          </div>

          {/* Reference's 'Created By' */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm text-gray-500">Created By</h4>
            {typeof reference.createdBy === 'object' ? (
              <p className="text-base text-gray-800 font-medium">
                {reference.createdBy.name ?? '(No name)'}
                {' | '}
                {reference.createdBy.email ?? '(No email)'}
              </p>
            ) : (
              <p className="text-base text-gray-800 font-medium">{String(reference.createdBy)}</p>
            )}
          </div>
        </div>

        {/* Right Column: The Reference Data from the Form */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Reference Submission</h3>
          
          {/* "name" and "address" from the Reference model (Referee filled out) */}
          <div className="mb-3">
            <h4 className="text-sm text-gray-500">Referee’s Name (From Reference Form)</h4>
            <p className="text-base text-gray-800 font-medium">
              {reference.name || 'N/A'}
            </p>
          </div>

          <div className="mb-3">
            <h4 className="text-sm text-gray-500">Address (From Reference Form)</h4>
            <p className="text-base text-gray-800 font-medium">
              {reference.address || 'N/A'}
            </p>
          </div>

          <div className="mb-3">
            <h4 className="text-sm text-gray-500">Company Name (From Reference Form)</h4>
            <p className="text-base text-gray-800 font-medium">
              {reference.companyName || 'N/A'}
            </p>
          </div>

          <div className="mb-3">
            <h4 className="text-sm text-gray-500">Relationship</h4>
            <p className="text-base text-gray-800 font-medium">
              {reference.relationship || 'N/A'}
            </p>
          </div>

          <div className="mb-3">
            <h4 className="text-sm text-gray-500">Position Held</h4>
            <p className="text-base text-gray-800 font-medium">
              {reference.positionHeld || 'N/A'}
            </p>
          </div>

          {/* Re-Employ */}
          <div className="mb-3">
            <h4 className="text-sm text-gray-500">Would You Re-employ Them?</h4>
            {reference.reEmploy || 'N/A'}
          </div>

          {/* Reason for Leaving, Salary, Days Absent, etc. */}
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm text-gray-500">Reason for Leaving</h4>
              <p className="text-base text-gray-800">{reference.reasonForLeaving || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500">Salary</h4>
              <p className="text-base text-gray-800">{reference.salary || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500">Days Absent</h4>
              <p className="text-base text-gray-800">{reference.daysAbsent || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500">Periods Absent</h4>
              <p className="text-base text-gray-800">{reference.periodsAbsent || 'N/A'}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm text-gray-500">Performance</h4>
              <p className="text-base text-gray-800">{reference.performance || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500">Conduct</h4>
              <p className="text-base text-gray-800">{reference.conduct || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500">Integrity</h4>
              <p className="text-base text-gray-800">{reference.integrity || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500">Additional Comments</h4>
              <p className="text-base text-gray-800">{reference.additionalComments || 'N/A'}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm text-gray-500">Start Date - End Date</h4>
            <p className="text-base text-gray-800 font-medium">
              {formatDate(reference.startDate)} — {formatDate(reference.endDate)}
            </p>
          </div>

          {/* Signature */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm text-gray-500">Referee Signature</h4>
            {reference.refereeSignature ? (
              <img
                src={reference.refereeSignature}
                alt="Signature"
                className="mt-2 max-w-xs border border-gray-300 rounded shadow"
              />
            ) : (
              <p className="text-base text-gray-800">N/A</p>
            )}
          </div>
        </div>
      </div>

      {/* Status & Actions */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-md font-semibold text-gray-700 mb-2">Reference Status</h3>
        <p
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium
          ${
            reference.status === ReferenceStatus.Pending
              ? 'bg-yellow-100 text-yellow-800'
              : reference.status === ReferenceStatus.Sent
              ? 'bg-blue-100 text-blue-800'
              : reference.status === ReferenceStatus.Received
              ? 'bg-green-100 text-green-800'
              : reference.status === ReferenceStatus.Completed
              ? 'bg-green-200 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {reference.status}
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          {/* SEND (Pending -> Sent) */}
          {reference.status === ReferenceStatus.Pending && (
            <button
              type="button"
              onClick={handleSend}
              disabled={isSending}
              className={`px-4 py-2 rounded-md text-white ${
                isSending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSending ? 'Sending...' : 'Send'}
            </button>
          )}

          {/* RECEIVE (Sent -> Received) */}
          {reference.status === ReferenceStatus.Sent && (
            <button
              type="button"
              onClick={handleReceive}
              className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
            >
              Mark as Received
            </button>
          )}

          {/* COMPLETE (Received -> Completed) */}
          {reference.status === ReferenceStatus.Received && (
            <button
              type="button"
              onClick={handleComplete}
              className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
            >
              Complete
            </button>
          )}

          {/* REJECT (Sent -> Rejected) */}
          {reference.status === ReferenceStatus.Sent && (
            <button
              type="button"
              onClick={handleReject}
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
            >
              Reject
            </button>
          )}

          {/* DELETE (Any status) */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className={`px-4 py-2 rounded-md text-white ${
              isDeleting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferenceDetail;
