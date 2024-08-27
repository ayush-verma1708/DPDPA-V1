import React, { useEffect, useState } from "react";
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import AddCompany from "./pages/AddCompany";
import Dashboard from "./pages/Dashboard";
import UserCreation from "./pages/UserCreation";
import Login from "./pages/Login";
import AssetList from "./pages/asset/AssetsList";
import ListOfActions from "./pages/ListOfActions";
import AlertManagement from "./pages/AlertManagement";
import ControlFamiliesPage from "./pages/ControlFamiliesPage";
import ControlsPage from "./pages/ControlsPage";
import ActionsPage from "./pages/ActionsPage";
import UploadPage from "./pages/UploadPage";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [selectedItem, setSelectedItem] = useState("Asset");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const handleSidebarClick = (title) => {
    setSelectedItem(title);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthToken(null);
    setUser(null);
  };


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get('http://localhost:8021/api/users/me', {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in Authorization header
            },
          });

          console.log('Fetched User Info:', res.data.data);
          setUser(res.data.data); // Set user data in state
        }
      } catch (err) {
        console.error('Failed to fetch user info:', err.response?.data || err.message);
        setUser(null); // Reset user state if fetching fails
      }
    };

    fetchUserInfo();
  }, []);


  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {authToken && <Sidebar onSelect={handleSidebarClick} />}
        <div className="main-content flex flex-col flex-grow">
          {authToken && (
            <Header title={selectedItem} user={user} handleLogout={handleLogout} />
          )}
          <div className="flex h-screen">
            <div className="flex flex-col flex-grow">
              <main className="flex-grow p-4">
                {error && <div className="error-message">{error}</div>}
                <Routes>
                  <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
                  <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/add-company" element={<PrivateRoute><AddCompany /></PrivateRoute>} />
                  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/user-creation" element={<PrivateRoute><UserCreation /></PrivateRoute>} />
                  <Route path="/asset-management" element={<PrivateRoute><AssetList /></PrivateRoute>} />
                  <Route path="/list-of-actions" element={<PrivateRoute><ListOfActions /></PrivateRoute>} />
                  <Route path="/alert-management" element={<PrivateRoute><AlertManagement /></PrivateRoute>} />
                  <Route path="/control-families" element={<PrivateRoute><ControlFamiliesPage /></PrivateRoute>} />
                  <Route path="/controls" element={<PrivateRoute><ControlsPage /></PrivateRoute>} />
                  <Route path="/actions" element={<PrivateRoute><ActionsPage /></PrivateRoute>} />
                  <Route path="/upload" element={<PrivateRoute><UploadPage /></PrivateRoute>} />
                  <Route path="/" element={<Home />} />
                  <Route path="/add-company" element={<AddCompany />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;

// import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Route, Routes, Navigate,} from "react-router-dom";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import Sidebar from "./components/Sidebar";
// import Home from "./pages/Home";
// import AddCompany from "./pages/AddCompany";
// import Dashboard from "./pages/Dashboard";
// import UserCreation from "./pages/UserCreation";
// import Login from "./pages/Login";
// import ListOfActions from "./pages/ListOfActions";
// import AlertManagement from "./pages/AlertManagement";
// import ControlFamiliesPage from "./pages/ControlFamiliesPage";
// import ControlsPage from "./pages/ControlsPage";
// import ActionsPage from "./pages/ActionsPage";
// import UploadPage from "./pages/UploadPage";
// import AssetList from "./pages/asset/AssetsList";
// import axios from 'axios'; // Import axios for API calls

// const PrivateRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   return token ? children : <Navigate to="/login" />;
// };

// const App = () => {
//   const [authToken, setAuthToken] = useState(localStorage.getItem("token"));

//   const [selectedItem, setSelectedItem] = useState("Asset");

//   const [user, setUser] = useState(null);

//   const handleSidebarClick = (title) => {
//     setSelectedItem(title);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setAuthToken(null);
//     setUser(null); // Clear user data on logout
//   };

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (token) {
//           // Assuming you have a function to fetch user info
//           const response = await axios.get('http://localhost:8021/api/auth/me', {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           setUser(response.data.data); // Adjust based on your API response structure
//           localStorage.setItem('user', JSON.stringify(response.data.data));
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         setUser(null);
//       }
//     };
  
//     fetchUser();
//   }, []);
  


//   // useEffect(() => {
//   //   // Example: Fetch user info from local storage or an AP
//   //   const fetchedUser = JSON.parse(localStorage.getItem("user")); 
//   //   setUser(fetchedUser);
//   // }, []);

//   return (
//     <Router>
//       <div className="flex h-screen bg-gray-100">
//         {authToken && <Sidebar onSelect={handleSidebarClick} />}
//         <div className="main-content flex flex-col flex-grow">
//           {authToken && (
//             // <Header title={selectedItem} handleLogout={handleLogout} />
//             <Header title="Dashboard" user={user} handleLogout={handleLogout} />
//           )}
//           <div className="flex h-screen">
//             <div className="flex flex-col flex-grow">
//               <main className="flex-grow p-4">
//                 <Routes>
//                   <Route
//                     path="/login"
//                     element={<Login setAuthToken={setAuthToken} />}
//                   />
//                   <Route
//                     path="/"
//                     element={
//                       <PrivateRoute>
//                         <Dashboard />
//                       </PrivateRoute>
//                     }
//                   />
//                   <Route
//                     path="/add-company"
//                     element={
//                       <PrivateRoute>
//                         <AddCompany />
//                       </PrivateRoute>
//                     }
//                   />
//                   <Route
//                     path="/dashboard"
//                     element={
//                       <PrivateRoute>
//                         <Dashboard />
//                       </PrivateRoute>
//                     }
//                   />
//                   <Route
//                     path="/user-creation"
//                     element={
//                       <PrivateRoute>
//                         <UserCreation />
//                       </PrivateRoute>
//                     }
//                   />
//                   <Route
//                     path="/asset-management"
//                     element={
//                       <PrivateRoute>
//                         <AssetList />
//                       </PrivateRoute>
//                     }
//                   />
//                   <Route
//                     path="/list-of-actions"
//                     element={
//                       <PrivateRoute>
//                         <ListOfActions />
//                       </PrivateRoute>
//                     }
//                   />
//                   <Route
//                     path="/alert-management"
//                     element={
//                       <PrivateRoute>
//                         <AlertManagement />
//                       </PrivateRoute>
//                     }
//                   />
//                   <Route
//                     path="/control-families"
//                     element={
//                       <PrivateRoute>
//                         <ControlFamiliesPage />
//                       </PrivateRoute>
//                     }
//                   />
//                   <Route
//                     path="/controls"
//                     element={
//                       <PrivateRoute>
//                         <ControlsPage />
//                       </PrivateRoute>
//                     }
//                   />
//                   <Route
//                     path="/actions"
//                     element={
//                       <PrivateRoute>
//                         <ActionsPage />
//                       </PrivateRoute>
//                     }
//                   />
//                   <Route
//                     path="/upload"
//                     element={
//                       <PrivateRoute>
//                         <UploadPage />
//                       </PrivateRoute>
//                     }
//                   />
//                   <Route path="/" element={<Home />} />
//                   <Route path="/add-company" element={<AddCompany />} />
//                 </Routes>
//               </main>
//               <Footer />
//             </div>
//           </div>
//         </div>
//       </div>
//     </Router>
//   );
// };

// export default App;