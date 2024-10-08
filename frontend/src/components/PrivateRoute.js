import React from 'react';
import { Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to='/login' />;
  }

  try {
    const decodedToken = jwtDecode(token);

    // Check if token has expired
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return <Navigate to='/login' />;
    }
  } catch (error) {
    console.error('Invalid token:', error);
    localStorage.removeItem('token');
    return <Navigate to='/login' />;
  }

  return children;
};

export default PrivateRoute;

// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';

// // Check if the user is authenticated
// const isAuthenticated = () => {
//   return !!localStorage.getItem('authToken'); // Check if auth token is in localStorage
// };

// const PrivateRoute = ({ component: Component, ...rest }) => {
//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         isAuthenticated() ? (
//           <Component {...props} />
//         ) : (
//           <Redirect to='/login' /> // Redirect to login if not authenticated
//         )
//       }
//     />
//   );
// };

// export default PrivateRoute;

// // // src/components/ProtectedRoute.js
// // import React from 'react';
// // import { Navigate } from 'react-router-dom';

// // const ProtectedRoute = ({ element: Element, ...rest }) => {
// //   const isAuthenticated = !!localStorage.getItem('token');
// //   return isAuthenticated ? <Element {...rest} /> : <Navigate to="/login" />;
// // };

// // export default ProtectedRoute;
