import React, { useState, useEffect } from 'react';
import {
  fetchTenantDetails,
  fetchLicenseDetails,
  fetchUserDirectory,
} from '../api/graphApiUtils';

const AzureDetails = () => {
  const [tenantDetails, setTenantDetails] = useState(null);
  const [licenseDetails, setLicenseDetails] = useState([]);
  const [userDirectory, setUserDirectory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const accessToken = localStorage.getItem('authId'); // Retrieve the access token from local storage

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        setError('Access token is missing. Please log in.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const tenant = await fetchTenantDetails(accessToken);
        const licenses = await fetchLicenseDetails(accessToken);
        const users = await fetchUserDirectory(accessToken);

        setTenantDetails(tenant);
        setLicenseDetails(licenses);
        setUserDirectory(users);
      } catch (err) {
        setError('Error fetching Azure details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  if (loading) return <p>Loading Azure details...</p>;
  if (error) return <p className='error'>{error}</p>;

  return (
    <div className='azure-details-container'>
      <h3>Azure Organization Details</h3>
      {tenantDetails && (
        <div>
          <p>
            <strong>Organization Name:</strong> {tenantDetails.displayName}
          </p>
          <p>
            <strong>Tenant ID:</strong> {tenantDetails.id}
          </p>
          <p>
            <strong>Country:</strong> {tenantDetails.country}
          </p>
        </div>
      )}

      <h4>License Details</h4>
      {licenseDetails.length > 0 ? (
        <ul>
          {licenseDetails.map((license) => (
            <li key={license.id}>
              {license.skuId}: {license.skuPartNumber} (
              {license.prepaidUnits.enabled} enabled)
            </li>
          ))}
        </ul>
      ) : (
        <p>No license details available.</p>
      )}

      <h4>User Directory</h4>
      {userDirectory.length > 0 ? (
        <ul>
          {userDirectory.map((user) => (
            <li key={user.id}>
              {user.displayName} ({user.mail || 'No email'}) -{' '}
              {user.jobTitle || 'No title'}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found in the directory.</p>
      )}
    </div>
  );
};

export default AzureDetails;
