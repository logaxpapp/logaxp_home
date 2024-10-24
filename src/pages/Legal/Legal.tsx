import React from 'react';

const Legal: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-12">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Legal Notice</h1>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Terms of Service</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          By accessing and using our services, you agree to comply with the following terms and conditions. These terms apply to all visitors, users, and others who access or use the service.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User Responsibilities</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Users are responsible for any activity that occurs under their account. You agree not to misuse our services. This includes but is not limited to hacking, spamming, or disrupting our systems. Failure to comply may result in suspension or termination of your account.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Disclaimer of Warranties</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Our services are provided on an "as is" and "as available" basis. We make no warranties, whether expressed or implied, about the reliability or suitability of the services for any particular purpose. We do not guarantee that the service will be uninterrupted or error-free.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Limitation of Liability</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          To the fullest extent permitted by applicable law, LogaXP will not be liable for any indirect, incidental, punitive, or consequential damages arising out of your use of our services, even if we have been advised of the possibility of such damages.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Governing Law</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          These terms and conditions are governed by and construed in accordance with the laws of the United States. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts located in Tennessee.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Changes to These Terms</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          We reserve the right to modify or replace these terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. By continuing to use our services after those revisions become effective, you agree to be bound by the revised terms.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
        <p className="text-gray-700 dark:text-gray-300">
          If you have any questions about these terms, please contact us at <a href="mailto:support@logaxp.com" className="text-blue-600 hover:underline">support@logaxp.com</a>.
        </p>
      </div>
    </div>
  );
};

export default Legal;
