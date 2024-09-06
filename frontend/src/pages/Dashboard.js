import React, { useState, useEffect } from 'react';
import StepsComponent from '../components/StepsComponent';
import CompletionStatusPage from '../components/completionStatusPage';
import Scoreboard from '../components/Scoreboard';
import { updateFormCompletionStatus , fetchCurrentUser, checkFormCompletion } from '../api/userApi'; // Assume this gets the current logged-in user
import { useNavigate} from 'react-router-dom';


const Dashboard = () => {
  const [showSteps, setShowSteps] = useState(true);
  const buttonClass = showSteps ? 'show-steps' : 'hide-steps';
  const [first, setFirst] = useState(false)
  const navigate = useNavigate();

  const toggleSteps = () => {
    setShowSteps(!showSteps);
  };

  const isFirstTime = async () => {
    const currentUser = await fetchCurrentUser(window.localStorage.getItem("token"));
    setFirst(currentUser.data.hasCompletedCompanyForm);

    if (first) {
      navigate('/onboarding')
      return;
    } else {
      return;
    }
  }

  useEffect(()=>{
    isFirstTime();
  }, [])

  return (
    <div>
    <button className={buttonClass} onClick={toggleSteps} style={{ float: 'right', margin: '10px' }}>
      {showSteps ? 'Hide Steps' : 'Show Steps'}
    </button>
    {showSteps ? (
      <StepsComponent onClose={toggleSteps} />
    ) : (
      <Scoreboard />

      // <CompletionStatusPage />
    )}
  </div>
  );
};

export default Dashboard;
