import React, { useState } from 'react';
import StepsComponent from '../components/StepsComponent';

const Dashboard = () => {
  const [showSteps, setShowSteps] = useState(true);

  const toggleSteps = () => {
    setShowSteps(!showSteps);
  };

  return (
    <div>
      {/* <h2>Dashboard</h2> */}
      <button class={showSteps} onClick={toggleSteps} style={{ float: 'right', margin: '10px' }}>
        {showSteps ? 'Hide Steps' : 'Show Steps'}
      </button>
      {showSteps ? (
        <StepsComponent onClose={toggleSteps} />
      ) : (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h3>Task Assigned to User</h3>
            <ul>
              <li>Task 1: Description of task 1</li>
              <li>Task 2: Description of task 2</li>
              <li>Task 3: Description of task 3</li>
            </ul>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <h3>Compliance Score</h3>
            <p>Your compliance score is 85%</p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <h3>Asset Health List</h3>
            <ul>
              <li>Asset 1: Healthy</li>
              <li>Asset 2: Needs attention</li>
              <li>Asset 3: Critical</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
// import React, { useState } from 'react';
// import StepsComponent from '../components/StepsComponent';

// const Dashboard = () => {
//   const [showSteps, setShowSteps] = useState(true);

//   const toggleSteps = () => {
//     setShowSteps(!showSteps);
//   };

//   return (
//     <div>
//       <h2>Dashboard</h2>
//       <button onClick={toggleSteps} style={{ float: 'right', margin: '10px' }}>
//         {showSteps ? 'Hide Steps' : 'Show Steps'}
//       </button>
//       {showSteps ? (
//         <StepsComponent />
//       ) : (
//         <div>
//           <div style={{ marginBottom: '20px' }}>
//             <h3>Task Assigned to User</h3>
//             <ul>
//               <li>Task 1: Description of task 1</li>
//               <li>Task 2: Description of task 2</li>
//               <li>Task 3: Description of task 3</li>
//             </ul>
//           </div>
//           <div style={{ marginBottom: '20px' }}>
//             <h3>Compliance Score</h3>
//             <p>Your compliance score is 85%</p>
//           </div>
//           <div style={{ marginBottom: '20px' }}>
//             <h3>Asset Health List</h3>
//             <ul>
//               <li>Asset 1: Healthy</li>
//               <li>Asset 2: Needs attention</li>
//               <li>Asset 3: Critical</li>
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;