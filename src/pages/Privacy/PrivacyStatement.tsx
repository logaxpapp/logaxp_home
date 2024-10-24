import React from 'react';

const PrivacyStatement: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-12">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Statement</h1>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Your privacy is important to us. This privacy statement explains the personal data LogaXP collects, how we use it, and for what purposes.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Information We Collect</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          We collect information that you voluntarily provide to us, such as when you sign up for our services, request support, or provide feedback. This information may include personal data such as your name, email address, and phone number.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">How We Use Your Information</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          LogaXP uses the information we collect to provide and improve our services, communicate with you, and respond to your inquiries. We may also use your information for internal purposes, such as data analysis and auditing.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Sharing of Information</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          We do not share your personal information with third parties except in the following circumstances:
        </p>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
          <li>When we have your consent to share the information.</li>
          <li>To comply with legal obligations or respond to valid legal processes.</li>
          <li>To protect the security or integrity of our services.</li>
          <li>To protect our rights or the rights of others.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Data Security</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          We take reasonable precautions to protect your personal data from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee the absolute security of your data.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Rights</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          You have the right to access, correct, or delete your personal information at any time. You may also withdraw your consent to our processing of your data by contacting us at <a href="mailto:support@logaxp.com" className="text-blue-600 hover:underline">support@logaxp.com</a>.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Changes to This Statement</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          We may update this privacy statement from time to time. Any changes will be posted on this page, and we encourage you to review this page periodically.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h2>
        <p className="text-gray-700 dark:text-gray-300">
          If you have any questions or concerns about this privacy statement, please contact us at <a href="mailto:support@logaxp.com" className="text-blue-600 hover:underline">support@logaxp.com</a>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyStatement;
