// ComplianceSnapshot.js

import React, { useState } from 'react';
import axios from 'axios';
import './ComplianceSnapshot.css'; // Import CSS for styling

const ComplianceSnapshot = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Function to handle the creation of a compliance snapshot
  const handleCreateSnapshot = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post(
        'http://localhost:8021/api/v1/compliance-snapshot'
      );
      setMessage('Compliance Snapshot Created Successfully!');
      console.log('Created Snapshot:', response.data);
    } catch (error) {
      console.error('Error creating compliance snapshot:', error);
      setMessage('Failed to create compliance snapshot');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle exporting compliance snapshots to Excel
  const handleExportSnapshot = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.get(
        'http://localhost:8021/api/v1/compliance-snapshot/export',
        {
          responseType: 'blob',
        }
      );

      console.log('Response Data Size:', response.data.size); // Log response data size

      if (response.data.size === 0) {
        setMessage('Exported file is empty. Please check the backend.');
        return;
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'compliance_snapshots.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage('Exported Compliance Snapshot to Excel successfully!');
    } catch (error) {
      console.error('Error exporting compliance snapshot:', error);
      setMessage('Failed to export compliance snapshot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='compliance-snapshot-container'>
      <h1>Compliance Snapshot</h1>
      <div className='button-container'>
        <button
          className='action-button'
          onClick={handleCreateSnapshot}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Compliance Snapshot'}
        </button>
        <button
          className='action-button'
          onClick={handleExportSnapshot}
          disabled={loading}
        >
          {loading ? 'Exporting...' : 'Export Compliance Snapshot to Excel'}
        </button>
      </div>
      {message && <p className='feedback-message'>{message}</p>}
    </div>
  );
};

export default ComplianceSnapshot;

// // ComplianceSnapshot.js

// import React from 'react';
// import axios from 'axios';

// const ComplianceSnapshot = () => {
//   // Function to handle the creation of a compliance snapshot
//   const handleCreateSnapshot = async () => {
//     try {
//       const response = await axios.post(
//         'http://localhost:8021/api/v1/compliance-snapshot'
//       );
//       alert('Compliance Snapshot Created Successfully!');
//       console.log('Created Snapshot:', response.data);
//     } catch (error) {
//       console.error('Error creating compliance snapshot:', error);
//       alert('Failed to create compliance snapshot');
//     }
//   };

//   // Function to handle exporting compliance snapshots to Excel
//   const handleExportSnapshot = async () => {
//     try {
//       const response = await axios.get(
//         'http://localhost:8021/api/v1/compliance-snapshot/export',
//         {
//           responseType: 'blob', // Important for handling the binary file
//         }
//       );

//       // Create a URL for the Excel file and trigger download
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'compliance_snapshots.xlsx'); // Filename to download
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error('Error exporting compliance snapshot:', error);
//       alert('Failed to export compliance snapshot');
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleCreateSnapshot}>Create Compliance Snapshot</button>
//       <button onClick={handleExportSnapshot}>
//         Export Compliance Snapshot to Excel
//       </button>
//     </div>
//   );
// };

// export default ComplianceSnapshot;
