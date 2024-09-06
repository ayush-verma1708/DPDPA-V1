import React, { useEffect, useState } from "react";
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import UserCreation from "./pages/UserCreation";
import Login from "./pages/Login";
import AssetList from "./pages/asset/AssetsList";
import ListOfActions from "./pages/ListOfActions";
// import AlertManagement from "./pages/AlertManagement";
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
          // console.log('Token found:', token);
  
          const res = await axios.get('http://localhost:8021/api/users/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          // console.log('API response:', res);
  
          if (res.data?.data) {
            setUser(res.data.data);
            // console.log('User data set:', res.data.data);
          } else {
            console.warn('No user data found in response:', res.data);
            setUser(null);
          }
        } else {
          console.warn('No token found, user is not authenticated');
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch user info:', err.response?.data || err.message);
        setUser(null);
      }
    };
  
    fetchUserInfo();
  }, []); // Empty dependency array ensures this runs only once
  
  
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
              <main className="flex-grow ">
                {error && <div className="error-message">{error}</div>}
                <Routes>
                  <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
                  <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/user-creation" element={<PrivateRoute><UserCreation /></PrivateRoute>} />
                  <Route path="/asset-management" element={<PrivateRoute><AssetList /></PrivateRoute>} />
                  <Route path="/list-of-actions" element={<PrivateRoute><ListOfActions /></PrivateRoute>} />
                  {/* <Route path="/alert-management" element={<PrivateRoute><AlertManagement /></PrivateRoute>} /> */}
                  <Route path="/control-families" element={<PrivateRoute><ControlFamiliesPage /></PrivateRoute>} />
                  <Route path="/controls" element={<PrivateRoute><ControlsPage /></PrivateRoute>} />
                  <Route path="/actions" element={<PrivateRoute><ActionsPage /></PrivateRoute>} />
                  <Route path="/upload" element={<PrivateRoute><UploadPage /></PrivateRoute>} />
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
