import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch'; // For Fetch API in environments that don't support it natively.

// Create a Graph API client
export const getGraphClient = (accessToken) => {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken); // Pass the access token to the Graph client
    },
  });
};

// Fetch tenant (organization) details
export const fetchTenantDetails = async (accessToken) => {
  const client = getGraphClient(accessToken);

  try {
    const organization = await client.api('/organization').get();
    return organization.value[0]; // The first value contains organization details
  } catch (error) {
    console.error('Error fetching tenant details:', error);
    throw error;
  }
};

// Fetch license details
export const fetchLicenseDetails = async (accessToken) => {
  const client = getGraphClient(accessToken);

  try {
    const licenses = await client.api('/subscribedSkus').get();
    return licenses.value;
  } catch (error) {
    console.error('Error fetching license details:', error);
    throw error;
  }
};

// Fetch user directory
export const fetchUserDirectory = async (accessToken) => {
  const client = getGraphClient(accessToken);

  try {
    const users = await client
      .api('/users')
      .select('id,displayName,mail,jobTitle')
      .get();
    return users.value;
  } catch (error) {
    console.error('Error fetching user directory:', error);
    throw error;
  }
};
