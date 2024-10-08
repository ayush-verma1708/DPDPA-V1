import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UserCreation from './pages/UserCreation';
import Login from './pages/Login';
import AssetList from './pages/asset/AssetsList';
import ListOfActions from './pages/ListOfActions';
// import AlertManagement from "./pages/AlertManagement";
import ControlFamiliesPage from './pages/ControlFamiliesPage';
import ControlsPage from './pages/ControlsPage';
import ActionsPage from './pages/ActionsPage';
import UploadPage from './pages/UploadPage';
import PostLoginOnboarding from './pages/PostLoginOnboarding';
import ScoreboardPage from './pages/ScoreboardPage';
import RiskAnalysis from './pages/RiskAnalysis';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SettingsPage from './pages/SettingsPage';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to='/login' />;
};

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [selectedItem, setSelectedItem] = useState('Asset');
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const handleSidebarClick = (title) => {
    setSelectedItem(title);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
        console.error(
          'Failed to fetch user info:',
          err.response?.data || err.message
        );
        setUser(null);
      }
    };

    fetchUserInfo();
  }, [authToken]); // Empty dependency array ensures this runs only once

  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login setAuthToken={setAuthToken} />} />
        <Route path='/onboarding' element={<PostLoginOnboarding />} />
        <Route
          path='/'
          element={
            <MiscLayout
              authToken={authToken}
              error={error}
              handleLogout={handleLogout}
              handleSidebarClick={handleSidebarClick}
              selectedItem={selectedItem}
              user={user}
            >
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            </MiscLayout>
          }
        />
        <Route
          path='/dashboard'
          element={
            <MiscLayout
              authToken={authToken}
              error={error}
              handleLogout={handleLogout}
              handleSidebarClick={handleSidebarClick}
              selectedItem={selectedItem}
              user={user}
            >
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            </MiscLayout>
          }
        />
        <Route
          path='/user-creation'
          element={
            <MiscLayout
              authToken={authToken}
              error={error}
              handleLogout={handleLogout}
              handleSidebarClick={handleSidebarClick}
              selectedItem={selectedItem}
              user={user}
            >
              <PrivateRoute>
                <UserCreation />
              </PrivateRoute>
            </MiscLayout>
          }
        />
        <Route
          path='/asset-management'
          element={
            <MiscLayout
              authToken={authToken}
              error={error}
              handleLogout={handleLogout}
              handleSidebarClick={handleSidebarClick}
              selectedItem={selectedItem}
              user={user}
            >
              <PrivateRoute>
                <AssetList />
              </PrivateRoute>
            </MiscLayout>
          }
        />
        <Route
          path='/scoreboard'
          element={
            <MiscLayout
              authToken={authToken}
              error={error}
              handleLogout={handleLogout}
              handleSidebarClick={handleSidebarClick}
              selectedItem={selectedItem}
              user={user}
            >
              <PrivateRoute>
                <ScoreboardPage />
              </PrivateRoute>
            </MiscLayout>
          }
        />
        <Route
          path='/risk-analysis'
          element={
            <MiscLayout
              authToken={authToken}
              error={error}
              handleLogout={handleLogout}
              handleSidebarClick={handleSidebarClick}
              selectedItem={selectedItem}
              user={user}
            >
              <PrivateRoute>
                <RiskAnalysis />
              </PrivateRoute>
            </MiscLayout>
          }
        />{' '}
        <Route
          path='/settings'
          element={
            <MiscLayout
              authToken={authToken}
              error={error}
              handleLogout={handleLogout}
              handleSidebarClick={handleSidebarClick}
              selectedItem={selectedItem}
              user={user}
            >
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            </MiscLayout>
          }
        />
        <Route
          path='/list-of-actions'
          element={
            <MiscLayout
              authToken={authToken}
              error={error}
              handleLogout={handleLogout}
              handleSidebarClick={handleSidebarClick}
              selectedItem={selectedItem}
              user={user}
            >
              <PrivateRoute>
                <ListOfActions />
              </PrivateRoute>
            </MiscLayout>
          }
        />
        {/* <Route path="/alert-management" element={<PrivateRoute><AlertManagement /></PrivateRoute>} /> */}
        <Route
          path='/control-families'
          element={
            <MiscLayout
              authToken={authToken}
              error={error}
              handleLogout={handleLogout}
              handleSidebarClick={handleSidebarClick}
              selectedItem={selectedItem}
              user={user}
            >
              <PrivateRoute>
                <ControlFamiliesPage />
              </PrivateRoute>
            </MiscLayout>
          }
        />
        <Route
          path='/controls'
          element={
            <MiscLayout
              authToken={authToken}
              error={error}
              handleLogout={handleLogout}
              handleSidebarClick={handleSidebarClick}
              selectedItem={selectedItem}
              user={user}
            >
              <PrivateRoute>
                <ControlsPage />
              </PrivateRoute>
            </MiscLayout>
          }
        />
        <Route
          path='/actions'
          element={
            <MiscLayout
              authToken={authToken}
              error={error}
              handleLogout={handleLogout}
              handleSidebarClick={handleSidebarClick}
              selectedItem={selectedItem}
              user={user}
            >
              <PrivateRoute>
                <ActionsPage />
              </PrivateRoute>
            </MiscLayout>
          }
        />
        <Route
          path='/upload'
          element={
            <MiscLayout
              authToken={authToken}
              error={error}
              handleLogout={handleLogout}
              handleSidebarClick={handleSidebarClick}
              selectedItem={selectedItem}
              user={user}
            >
              <PrivateRoute>
                <UploadPage />
              </PrivateRoute>
            </MiscLayout>
          }
        />
      </Routes>
    </Router>
  );
};

const MiscLayout = ({
  children,
  handleSidebarClick,
  authToken,
  selectedItem,
  user,
  handleLogout,
  error,
}) => {
  return (
    <div className='flex h-screen bg-gray-100'>
      {authToken && <Sidebar onSelect={handleSidebarClick} />}
      <div className='main-content flex flex-col flex-grow'>
        {authToken && (
          <Header
            title={selectedItem}
            user={user}
            handleLogout={handleLogout}
          />
        )}
        {children}
        <div className='flex h-screen'>
          <div className='flex flex-col flex-grow'>
            <main className='flex-grow '>
              {error && <div className='error-message'>{error}</div>}
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
