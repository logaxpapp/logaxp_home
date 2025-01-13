import React from 'react';
import { useSearchParams } from 'react-router-dom';

const ThankYou: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  // If we used "?refName=John%20Doe", we can retrieve it:
  const refName = searchParams.get('refName') || 'Referee';

  return (
    <div className="mx-auto p-6 max-w-lg text-center flex flex-col items-center min-h-screen shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Thank You, {refName}!
      </h1>

      <p className="text-base text-gray-700 mb-6">
        We appreciate you taking the time to submit this reference. 
        Your feedback helps us make informed decisions for the candidate.
      </p>

      <p className="text-sm text-gray-600">
        You can close this window or return to your inbox. 
        If you have any questions, feel free to contact us.
      </p>
    </div>
  );
};

export default ThankYou;
