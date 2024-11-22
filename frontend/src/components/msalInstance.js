import { PublicClientApplication } from '@azure/msal-browser';

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

export const msalInstance = new PublicClientApplication(msalConfig);
