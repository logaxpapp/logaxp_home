
import React, { useState } from 'react';
import { useShareTestCasesMutation } from '../../api/usersApi'; // <--- import your new RTK hook

/**
 * A modern Tailwind-styled form for an Admin user to generate & send
 * a share link for test cases in a specific application.
 */
function AdminShareTestCasesForm() {
  const [application, setApplication] = useState('GatherPlux');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [daysValid, setDaysValid] = useState(7);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // use the mutation hook
  const [shareTestCases, { isLoading }] = useShareTestCasesMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // call the mutation with our data
      const result = await shareTestCases({ application, recipientEmail, daysValid }).unwrap();
      setMessage(result.message);
    } catch (err: any) {
      console.error('Error creating share link:', err);
      // err.data?.message might contain the server error
      setError(err.data?.message || 'Server error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      {/* Outer container with glassmorphism effect */}
      <div className="bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Share Test Cases
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Application field */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Application:
            </label>
            <select
              value={application}
              onChange={(e) => setApplication(e.target.value)}
              className="block w-full bg-white/90 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="GatherPlux">GatherPlux</option>
              <option value="BookMiz">BookMiz</option>
              <option value="BeautyHub">BeautyHub</option>
              <option value="TimeSync">TimeSync</option>
              <option value="TaskBrick">TaskBrick</option>
              <option value="ProFixer">ProFixer</option>
              <option value="DocSend">DocSend</option>
              <option value="LogaXP">LogaXP</option>
              <option value="CashVent">CashVent</option>
            </select>
          </div>

          {/* Recipient Email field */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Recipient Email:
            </label>
            <input
              type="email"
              required
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="block w-full bg-white/90 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="recipient@example.com"
            />
          </div>

          {/* Days Valid field */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Days Valid:
            </label>
            <input
              type="number"
              value={daysValid}
              onChange={(e) => setDaysValid(Number(e.target.value))}
              className="block w-full bg-white/90 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              min={1}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Generate & Send Link
          </button>
        </form>

        {/* Feedback messages */}
        {error && (
          <p className="mt-6 text-center text-red-600 font-medium bg-red-50/50 p-3 rounded-lg border border-red-100">
            {error}
          </p>
        )}
        {message && (
          <p className="mt-6 text-center text-green-600 font-medium bg-green-50/50 p-3 rounded-lg border border-green-100">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminShareTestCasesForm;