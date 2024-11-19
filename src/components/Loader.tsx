// src/components/common/Loader.tsx

import React from 'react';


const Loader: React.FC = () => (
  <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-neutral-900">
    <div className="spinner">
      <div className="double-bounce1"></div>
      <div className="double-bounce2"></div>
    </div>
  </div>
);

export default Loader;
