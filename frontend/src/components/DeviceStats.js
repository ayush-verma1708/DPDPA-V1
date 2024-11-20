import React from 'react';

const DeviceStats = ({ deviceStats }) => {
  return (
    <div className='device-stats'>
      <h3>Device Statistics:</h3>
      <ul>
        <li>TVs: {deviceStats.tv}</li>
        <li>Routers: {deviceStats.router}</li>
        <li>Mobiles: {deviceStats.mobile}</li>
        <li>Laptops: {deviceStats.laptop}</li>
        <li>Other: {deviceStats.other}</li>
      </ul>
    </div>
  );
};

export default DeviceStats;
