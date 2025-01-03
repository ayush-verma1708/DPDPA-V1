// // src/App.js
// import React from 'react';

// import UserResponsesManager from '../components/UserResponsesManager';

// const App = () => {
//   const companyId = '66dc1719f8bc41880e8da7ae'; // Example company ID

//   return (
//     <div>
//       <UserResponsesManager companyId={companyId} />
//     </div>
//   );
// };

// export default App;

import React from 'react';
import UserResponsesManager from '../components/UserResponsesManager';
import useFetchUser from '../hooks/useCurrentUser'; // Adjust the path if necessary

const App = () => {
  const token = localStorage.getItem('token');

  const { user, loading, error } = useFetchUser(token);

  const companyId = localStorage.getItem('company') || 'default_company_id'; // Or use a fallback if needed
  // Log companyId to check if it's being passed correctly
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <UserResponsesManager companyId={companyId} />
    </div>
  );
};

export default App;
