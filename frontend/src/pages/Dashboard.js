import React, { useState, useEffect } from 'react';
import StepsComponent from '../components/StepsComponent';
import Scoreboard from '../components/Scoreboard';
import { fetchCurrentUser } from '../api/userApi'; // Assume this gets the current logged-in user
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import RiskDashboard from '../components/RiskDashboard';

const Dashboard = () => {
  const [showSteps, setShowSteps] = useState(true);
  const buttonClass = showSteps ? 'show-steps' : 'hide-steps';
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const toggleSteps = () => {
    setShowSteps(!showSteps);
  };

  const checkFormStatus = async () => {
    try {
      const token = window.localStorage.getItem('token');
      if (!token) {
        console.error('No token found, redirecting to login.');
        navigate('/login');
        return;
      }

      const { data: currentUser } = await fetchCurrentUser(token);

      if (!currentUser.hasCompletedCompanyForm) {
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      navigate('/login'); // Redirect to login if there's an error
    }
  };

  useEffect(() => {
    checkFormStatus();
  }, []);

  const handleFillForm = () => {
    setModalVisible(false);
    navigate('/onboarding');
  };

  return (
    <div>
      {modalVisible && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>Please Complete the Company Form</h2>
            <p>You must complete the company form before proceeding.</p>
            <button onClick={handleFillForm}>Fill Form Now</button>
          </div>
        </div>
      )}
      {showSteps ? <StepsComponent onClose={toggleSteps} /> : <Scoreboard />}
    </div>
  );
};

export default Dashboard;

// import React, { useState, useEffect } from 'react';
// import StepsComponent from '../components/StepsComponent';
// import CompletionStatusPage from '../components/completionStatusPage';
// import Scoreboard from '../components/Scoreboard';
// import {
//   updateFormCompletionStatus,
//   fetchCurrentUser,
//   checkFormCompletion,
// } from '../api/userApi'; // Assume this gets the current logged-in user
// import { useNavigate } from 'react-router-dom';
// import './dashboard.css';
// import RiskDashboard from '../components/RiskDashboard';

// const Dashboard = () => {
//   const [showSteps, setShowSteps] = useState(true);
//   const buttonClass = showSteps ? 'show-steps' : 'hide-steps';
//   const [first, setFirst] = useState(false);
//   const navigate = useNavigate();

//   const toggleSteps = () => {
//     setShowSteps(!showSteps);
//   };

//   const isFirstTime = async () => {
//     const currentUser = await fetchCurrentUser(
//       window.localStorage.getItem('token')
//     );
//     setFirst(currentUser.data.hasCompletedCompanyForm);

//     if (first) {
//       navigate('/onboarding');

//       return;
//     } else {
//       return;
//     }
//   };

//   useEffect(() => {
//     isFirstTime();
//   }, []);

//   return (
//     <div>
//       {showSteps ? <StepsComponent onClose={toggleSteps} /> : <Scoreboard />}
//     </div>
//   );
// };

// export default Dashboard;
