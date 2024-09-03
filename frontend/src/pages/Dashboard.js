import React, { useState } from 'react';
import StepsComponent from '../components/StepsComponent';
import CompletionStatusPage from '../components/completionStatusPage';

const Dashboard = () => {
  const [showSteps, setShowSteps] = useState(true);
  const buttonClass = showSteps ? 'show-steps' : 'hide-steps';

  const toggleSteps = () => {
    setShowSteps(!showSteps);
  };

  return (
    <div>
    <button className={buttonClass} onClick={toggleSteps} style={{ float: 'right', margin: '10px' }}>
      {showSteps ? 'Hide Steps' : 'Show Steps'}
    </button>
    {showSteps ? (
      <StepsComponent onClose={toggleSteps} />
    ) : (
      <CompletionStatusPage />
    )}
  </div>
  );
};

export default Dashboard;
