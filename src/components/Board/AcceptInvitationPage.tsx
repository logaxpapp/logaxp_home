import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../features/Toast/ToastContext';
import {
  useAcceptInvitationMutation,
  useDeclineInvitationMutation,
} from '../../api/tasksApi';
// Eye icons (react-icons)
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

function AcceptOrDeclineInvitationPage() {
  // 1) Grab the token from the URL, e.g. ?token=abc123
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  // 2) RTK Query hooks
  const [acceptInvitation, { isLoading: acceptLoading }] = useAcceptInvitationMutation();
  const [declineInvitation, { isLoading: declineLoading }] = useDeclineInvitationMutation();

  // 3) Local state
  const [hasAccount, setHasAccount] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');

  // For toggling visibility of the password field
  const [showPassword, setShowPassword] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tokenFromUrl) {
      showToast('No token found in the URL!', 'error');
      return;
    }

    try {
      if (isDeclining) {
        // Decline path
        await declineInvitation({ token: tokenFromUrl, reason }).unwrap();
        showToast('Invitation declined.', 'success');
        navigate('/'); // or a different route after declining
      } else {
        // Accept path
        const resp = await acceptInvitation({
          token: tokenFromUrl,
          name: hasAccount ? undefined : name,
          password: hasAccount ? undefined : password,
        }).unwrap();

        showToast(resp.message, 'success');
        // Optionally redirect user to the board's Kanban, etc.
        navigate(`/dashboard/boards/${resp.boardId}/kanban`);
      }
    } catch (err: any) {
      const errMsg = err?.data?.message || 'Something went wrong.';
      showToast(errMsg, 'error');
      console.error('Invitation error:', errMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
                      shadow-xl rounded-lg p-8 relative">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2">
          {isDeclining ? 'Decline Invitation' : 'Accept Invitation'}
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          {isDeclining 
            ? 'Provide a reason or simply decline.'
            : 'Join the board by accepting this invitation.'}
        </p>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Toggle for Decline */}
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="declineCheck"
              checked={isDeclining}
              onChange={(e) => setIsDeclining(e.target.checked)}
              className="h-5 w-5 text-red-600 rounded border-gray-300 focus:ring-red-500"
            />
            <label
              htmlFor="declineCheck"
              className="ml-2 text-sm text-gray-800 dark:text-gray-300 cursor-pointer"
            >
              I want to decline this invitation
            </label>
          </div>

          {/* Reason for Declining (animated collapse) */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isDeclining ? 'max-h-96' : 'max-h-0'
            }`}
          >
            {isDeclining && (
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">
                  Reason (optional)
                </label>
                <textarea
                  className="w-full p-3 border rounded-lg focus:outline-none 
                             focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-gray-200"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Why you're declining (optional)..."
                />
              </div>
            )}
          </div>

          {/* Accept UI (animated collapse) */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              !isDeclining ? 'max-h-screen' : 'max-h-0'
            }`}
          >
            {!isDeclining && (
              <>
                {/* Already have an account? */}
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="hasAccountCheck"
                    checked={hasAccount}
                    onChange={(e) => setHasAccount(e.target.checked)}
                    className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="hasAccountCheck"
                    className="ml-2 text-sm text-gray-800 dark:text-gray-300 cursor-pointer"
                  >
                    I already have an account
                  </label>
                </div>

                {/* If user is brand-new => show name/password fields */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    !hasAccount ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  {!hasAccount && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                          type="text"
                          className="w-full p-3 border rounded-lg focus:outline-none 
                                     focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full p-3 border rounded-lg focus:outline-none 
                                       focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 pr-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 
                                       hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                          >
                            {showPassword ? (
                              <AiOutlineEyeInvisible size={22} />
                            ) : (
                              <AiOutlineEye size={22} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={acceptLoading || declineLoading}
            className={`w-full py-3 rounded-lg font-semibold text-white 
                        shadow-lg focus:outline-none focus:ring-2 
                        transition-all duration-300 
                        ${
                          isDeclining
                            ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                        }
                        disabled:opacity-70`}
          >
            {isDeclining
              ? declineLoading
                ? 'Declining...'
                : 'Decline Invitation'
              : acceptLoading
              ? 'Accepting...'
              : 'Accept Invitation'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AcceptOrDeclineInvitationPage;
