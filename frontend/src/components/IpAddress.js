import React, { useState } from 'react';
import { getIpAddress } from '../api/ipService'; // Import the API service

const IpAddress = () => {
  const [ipAddress, setIpAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIpAddress = async () => {
    setLoading(true);
    setError(null); // Clear any previous error
    try {
      const ip = await getIpAddress(); // Call the API service function
      setIpAddress(ip); // Set the fetched IP address in the state
    } catch (err) {
      setError('Error fetching IP address');
      console.error(err); // Log the error
    } finally {
      setLoading(false); // Stop loading once the request is complete
    }
  };

  return (
    <div className='ip-address-container'>
      <h2>Current IP Address</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {ipAddress && <p>Your IP Address: {ipAddress}</p>}
      <button onClick={fetchIpAddress} disabled={loading}>
        {loading ? 'Fetching...' : 'Get IP Address'}
      </button>
    </div>
  );
};

export default IpAddress;
