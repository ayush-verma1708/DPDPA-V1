import React, { useState, useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';

// Azure AD configuration
const msalConfig = {
  auth: {
    clientId: '962fc230-c5b7-448c-991a-dc390db90186', // Replace with your Azure AD app's Client ID
    authority: 'https://login.microsoftonline.com/common', // 'common' allows multi-tenant
    redirectUri: 'http://localhost:3000/auth/callback', // Update with your redirect URI for dev and prod
  },
  cache: {
    cacheLocation: 'localStorage', // Can be 'localStorage' or 'sessionStorage'
    storeAuthStateInCookie: false, // Set to true for IE 11 or older browsers
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

const AzureLogin = () => {
  const [account, setAccount] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const initializeMsal = async () => {
      try {
        await msalInstance.initialize();
        const sessionId = localStorage.getItem('sessionId');
        const authId = localStorage.getItem('authId');
        if (sessionId && authId) {
          // Assuming you have a way to get user data from sessionId or authId
          setAccount({ username: 'User Name' }); // Replace with actual user data retrieval
        }
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    };

    initializeMsal();
  }, []);

  const login = async () => {
    try {
      setIsPopupOpen(true);
      const response = await msalInstance.loginPopup();
      setAccount(response.account);
      // Store session ID and authentication ID in local storage
      localStorage.setItem('sessionId', response.account.homeAccountId);
      localStorage.setItem('authId', response.idToken);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsPopupOpen(false);
    }
  };

  const logout = () => {
    msalInstance.logoutPopup();
    localStorage.removeItem('sessionId');
    localStorage.removeItem('authId');
    setAccount(null);
  };

  return (
    <div>
      {!account ? (
        <div>
          <button onClick={login}>Login with Azure AD</button>
          {isPopupOpen && <div className='popup'>Logging in...</div>}
        </div>
      ) : (
        <div>
          <p>Welcome, {account.username}</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default AzureLogin;
