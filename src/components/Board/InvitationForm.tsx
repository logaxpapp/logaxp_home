// src/components/InvitationForm.tsx

import React, { useState } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { useCreateInvitationMutation, useDeclineInvitationMutation } from '../../api/tasksApi';
import { useToast } from '../../features/Toast/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

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
 * It also allows declining an invitation with a reason.
 */
function InvitationForm({ boardId }: InvitationFormProps) {
  const [invitedEmail, setInvitedEmail] = useState('');
  const [role, setRole] = useState('subContractor');

  // For declining an invitation
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

  // Animation variants for the form container
  const formContainerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  // Animation variants for input fields and select dropdown
  const inputVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  // Animation variants for buttons
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  // State to toggle decline section
  const [isDeclineSectionOpen, setIsDeclineSectionOpen] = useState(false);

  // Toggle function
  const toggleDeclineSection = () => {
    setIsDeclineSectionOpen((prev) => !prev);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="max-w-md mx-auto mt-8 p-6 border border-gray-300 rounded shadow-lg bg-white"
        variants={formContainerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Send or Decline Invitation
        </h2>

        {/* FORM TO CREATE/SEND INVITATION */}
        <form onSubmit={handleInvite} className="space-y-6">
          <motion.div
            className="space-y-1"
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-gray-700">
              Invitee Email
            </label>
            <input
              type="email"
              value={invitedEmail}
              onChange={(e) => setInvitedEmail(e.target.value)}
              placeholder="john.doe@example.com"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </motion.div>

          <motion.div
            className="space-y-1"
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-700">
              Invitee Role
            </label>
            <motion.select
              className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <option value="subContractor">SubContractor</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </motion.select>
          </motion.div>

          <motion.button
            type="submit"
            disabled={isCreating}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {isCreating ? 'Inviting...' : 'Send Invitation'}
          </motion.button>
        </form>

        {/* Toggle Decline Section */}
        <motion.button
          type="button"
          onClick={toggleDeclineSection}
          className="w-full mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors duration-200"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {isDeclineSectionOpen ? 'Hide Decline Invitation' : 'Decline Invitation'}
        </motion.button>

        {/* Decline Invitation Section */}
        <AnimatePresence>
          {isDeclineSectionOpen && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              <form onSubmit={handleDecline} className="space-y-4">
                <motion.div
                  className="space-y-1"
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Reason for Decline
                  </label>
                  <textarea
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="Optional reason..."
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={3}
                  ></textarea>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={isDeclining}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400 transition-colors duration-200"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {isDeclining ? 'Declining...' : 'Decline Invitation'}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

export default InvitationForm;
