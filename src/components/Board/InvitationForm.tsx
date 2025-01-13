import React, { useState } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { useCreateInvitationMutation, useDeclineInvitationMutation } from '../../api/tasksApi';
import { useToast } from '../../features/Toast/ToastContext';

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    const maybeError = error as FetchBaseQueryError;
    if ('data' in maybeError && maybeError.data) {
      const dataObj = maybeError.data as { message?: string };
      if (dataObj.message) {
        return dataObj.message;
      }
    }
  }
  return String(error);
}

interface InvitationFormProps {
  boardId: string;
}

/**
 * InvitationForm
 *
 * This component sends invitations to a given boardId.
 * For demonstration, it also shows how you might decline
 * an invitation with a second button (though typically,
 * declining is done by the invitee, not the sender).
 */
function InvitationForm({ boardId }: InvitationFormProps) {
  const [invitedEmail, setInvitedEmail] = useState('');
  const [role, setRole] = useState('subContractor');

  // For demonstration of "decline" with a reason:
  const [declineReason, setDeclineReason] = useState('');
  const [invitationToken, setInvitationToken] = useState('');

  const [createInvitation, { isLoading: isCreating }] = useCreateInvitationMutation();
  const [declineInvitation, { isLoading: isDeclining }] = useDeclineInvitationMutation();

  const { showToast } = useToast();

  // Handler to create/send invitation
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!boardId.trim() || !invitedEmail.trim()) {
      showToast('Please fill in both Board ID and Invitee Email!', 'error');
      return;
    }

    try {
      const result = await createInvitation({ boardId, invitedEmail, role }).unwrap();
      showToast('Invitation created & email sent!', 'success');

      // Possibly retrieve the newly created invitation token from `result`:
      if (result.invitation?.inviteToken) {
        setInvitationToken(result.invitation.inviteToken);
      }

      // Reset local state
      setInvitedEmail('');
      setRole('subContractor');
    } catch (err) {
      const message = getErrorMessage(err);
      console.error('Failed to create invitation:', message);
      showToast(`Failed to invite: ${message}`, 'error');
    }
  };

  // Handler to decline an invitation
  const handleDecline = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invitationToken) {
      showToast('No invitation token found to decline!', 'error');
      return;
    }

    try {
      await declineInvitation({ token: invitationToken, reason: declineReason }).unwrap();
      showToast('Invitation declined successfully!', 'success');

      // Reset local state
      setInvitationToken('');
      setDeclineReason('');
    } catch (err) {
      const message = getErrorMessage(err);
      console.error('Failed to decline invitation:', message);
      showToast(`Failed to decline: ${message}`, 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border border-gray-300 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Send or Decline Invitation
      </h2>

      {/* FORM TO CREATE/SEND INVITATION */}
      <form onSubmit={handleInvite} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Invitee Email
          </label>
          <input
            type="email"
            value={invitedEmail}
            onChange={(e) => setInvitedEmail(e.target.value)}
            placeholder="john.doe@example.com"
            className="w-full px-3 py-2 border rounded 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Invitee Role
          </label>
          <select
            className="w-full px-3 py-2 border rounded 
                       text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="subContractor">SubContractor</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isCreating}
          className="bg-blue-600 text-white px-4 py-2 rounded 
                     hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isCreating ? 'Inviting...' : 'Send Invitation'}
        </button>
      </form>

      {/* FORM TO DECLINE INVITATION */}
      <form onSubmit={handleDecline} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Invitation Token (to decline)
          </label>
          <input
            type="text"
            value={invitationToken}
            onChange={(e) => setInvitationToken(e.target.value)}
            placeholder="Paste invitation token here..."
            className="w-full px-3 py-2 border rounded 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Declining (optional)
          </label>
          <textarea
            className="w-full px-3 py-2 border rounded 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isDeclining}
          className="bg-red-600 text-white px-4 py-2 rounded 
                     hover:bg-red-700 disabled:bg-gray-400"
        >
          {isDeclining ? 'Declining...' : 'Decline Invitation'}
        </button>
      </form>
    </div>
  );
}

export default InvitationForm;
