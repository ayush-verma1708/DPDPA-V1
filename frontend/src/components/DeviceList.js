import React from 'react';

const DeviceList = ({ devices, selectedDevices, handleDeviceSelection }) => {
  return (
    <div className='device-list-container'>
      {devices.map((device, index) => (
        <div key={index} className='device-item'>
          <label htmlFor={`checkbox-${device.IP}`}>
            <input
              type='checkbox'
              id={`checkbox-${device.IP}`}
              checked={selectedDevices.includes(device.IP)}
              onChange={() => handleDeviceSelection(device.IP)}
            />
            <h3>{device.IP}</h3>
            <p>
              <strong>Hostnames:</strong> {device.Hostnames.join(', ') || 'N/A'}
            </p>
            <p>
              <strong>OS:</strong> {device.OS || 'Unknown'}
            </p>
            <p>
              <strong>Open Ports:</strong>{' '}
              {device['Open Ports'].length > 0
                ? device['Open Ports'].join(', ')
                : 'None'}
            </p>
          </label>
        </div>
      ))}
    </div>
  );
};

export default DeviceList;
