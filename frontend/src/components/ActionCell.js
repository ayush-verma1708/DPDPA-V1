// v2
import React, { useEffect, useState } from 'react';
import { TableCell } from '@mui/material';
import { getActionByVariableId } from '../api/actionInfoCellApi'; // Import the API function

const ActionCell = ({ actionId, controlId, productFamilyId, softwareId }) => {
  const [actionDescription, setActionDescription] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only proceed if all IDs are present
    if (actionId && controlId && productFamilyId && softwareId) {
      const fetchActionDescription = async () => {
        try {
          // Concatenate IDs to create the variableId
          const variableId = `${actionId}_${controlId}_${productFamilyId}_${softwareId}`;

          // Fetch the action description based on the concatenated variableId
          const action = await getActionByVariableId(variableId);

          // Check if action description exists
          if (action && action.description) {
            setActionDescription(action.description);
          } else {
            setActionDescription('No description available');
          }
        } catch (err) {
          // Handle error if API call fails
          setError('Error fetching action data');
          setActionDescription('No description available');
        }
      };

      fetchActionDescription();
    } else {
      // If any ID is missing, do not try to fetch data, just set blank
      setActionDescription('');
    }
  }, [actionId, controlId, productFamilyId, softwareId]);

  // If there's an error, display the error message in the table cell
  if (error) {
    return <TableCell>{error}</TableCell>;
  }

  // Render the action description, or blank if no data is found
  return <TableCell>{actionDescription}</TableCell>;
};

export default ActionCell;

// import React, { useEffect, useState } from 'react';
// import { TableCell } from '@mui/material';
// import { getActionByVariableId } from '../api/actionInfoCellApi'; // Import the API function

// const ActionCell = ({ actionId, controlId, productFamilyId, softwareId }) => {
//   const [actionDescription, setActionDescription] = useState('Loading...');
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchActionDescription = async () => {
//       try {
//         // Concatenate IDs to create the variableId
//         const variableId = `${actionId}_${controlId}_${productFamilyId}_${softwareId}`;

//         // Fetch the action description based on the concatenated variableId
//         const action = await getActionByVariableId(variableId);

//         // Check if the action data exists, else set fallback description
//         if (action && action.description) {
//           setActionDescription(action.description);
//         } else {
//           setActionDescription('No description available');
//         }
//       } catch (err) {
//         // Handle error if API call fails
//         setError('Error fetching action data');
//         setActionDescription('No description available');
//       }
//     };

//     // Only fetch data if all the required IDs are available
//     if (actionId && controlId && productFamilyId && softwareId) {
//       fetchActionDescription();
//     }
//   }, [actionId, controlId, productFamilyId, softwareId]);

//   // If there's an error fetching the data, show the error message
//   if (error) {
//     return <TableCell>{error}</TableCell>;
//   }

//   // Render the action description or fallback message if data is unavailable
//   return (
//     <TableCell>
//       {/* Display the action description or a message if no data */}
//       <div>{actionDescription || 'No data available'}</div>
//     </TableCell>
//   );
// };

// export default ActionCell;

// // import React, { useEffect, useState } from 'react';
// // import { TableCell } from '@mui/material';
// // import { getActionByVariableId } from '../api/actionInfoCellApi'; // Import the API function

// // const ActionCell = ({ actionId, controlId, productFamilyId, softwareId }) => {
// //   const [actionDescription, setActionDescription] = useState('Loading...');
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchActionDescription = async () => {
// //       try {
// //         // Concatenate IDs to create the variableId
// //         const variableId = `${actionId}_${controlId}_${productFamilyId}_${softwareId}`;

// //         // Fetch the action description based on the concatenated variableId
// //         const action = await getActionByVariableId(variableId);

// //         // Set the action description or a fallback value
// //         setActionDescription(action?.description || 'No description available');
// //       } catch (err) {
// //         setError('Error fetching action data');
// //         setActionDescription('No description available');
// //       }
// //     };

// //     // Only fetch data if all the required IDs are available
// //     if (actionId && controlId && productFamilyId && softwareId) {
// //       fetchActionDescription();
// //     }
// //   }, [actionId, controlId, productFamilyId, softwareId]);

// //   if (error) {
// //     return <TableCell>{error}</TableCell>;
// //   }

// //   return (
// //     <TableCell>
// //       {/* Display the fetched action description */}

// //       <div>{actionDescription}</div>
// //     </TableCell>
// //   );
// // };

// // export default ActionCell;

// // // import React, { useEffect, useState } from 'react';
// // // import { TableCell } from '@mui/material';

// // // const ActionCell = ({ actionId, controlId, productFamilyId, softwareId }) => {
// // //   const [actionDescription, setActionDescription] = useState('Loading...');
// // //   const [error, setError] = useState(null);

// // //   useEffect(() => {
// // //     const fetchActionDescription = async () => {
// // //       // Currently commented out for testing purposes
// // //       // try {
// // //       //   const variableId = `${actionId}_${controlId}_${productFamilyId}_${softwareId}`;
// // //       //   const action = await getActionByVariableId(variableId);
// // //       //   setActionDescription(action?.description || 'N/A');
// // //       // } catch (err) {
// // //       //   setError('Error fetching action data');
// // //       //   setActionDescription('N/A');
// // //       // }
// // //     };

// // //     if (actionId && controlId && productFamilyId && softwareId) {
// // //       fetchActionDescription();
// // //     }
// // //   }, [actionId, controlId, productFamilyId, softwareId]);

// // //   if (error) {
// // //     return <TableCell>{error}</TableCell>;
// // //   }

// // //   return (
// // //     <TableCell>
// // //       {/* Display all the IDs for testing */}
// // //       <div>Action ID: {actionId}</div>
// // //       <div>Control ID: {controlId}</div>
// // //       <div>Product Family ID: {productFamilyId}</div>
// // //       <div>Software ID: {softwareId}</div>
// // //     </TableCell>
// // //   );
// // // };

// // // export default ActionCell;

// // // // import React, { useEffect, useState } from 'react';
// // // // import { TableCell } from '@mui/material';

// // // // const ActionCell = ({ actionId, controlId, productFamilyId, softwareId }) => {
// // // //   const [actionDescription, setActionDescription] = useState('Loading...');
// // // //   const [error, setError] = useState(null);

// // // //   useEffect(() => {
// // // //     const fetchActionDescription = async () => {
// // // //       // Log the IDs to the console for debugging
// // // //       console.log('Action ID:', actionId);
// // // //       console.log('Control ID:', controlId);
// // // //       console.log('Product Family ID:', productFamilyId);
// // // //       console.log('Software ID:', softwareId);

// // // //       // Commented out for now
// // // //       // try {
// // // //       //   const variableId = `${actionId}_${controlId}_${productFamilyId}_${softwareId}`;
// // // //       //   const action = await getActionByVariableId(variableId);
// // // //       //   setActionDescription(action?.description || 'N/A');
// // // //       // } catch (err) {
// // // //       //   setError('Error fetching action data');
// // // //       //   setActionDescription('N/A');
// // // //       // }
// // // //     };

// // // //     if (actionId && controlId && productFamilyId && softwareId) {
// // // //       fetchActionDescription();
// // // //     }
// // // //   }, [actionId, controlId, productFamilyId, softwareId]);

// // // //   if (error) {
// // // //     return <TableCell>{error}</TableCell>;
// // // //   }

// // // //   return <TableCell>{/* {actionDescription} */}</TableCell>;
// // // // };

// // // // export default ActionCell;

// // // // // import React, { useEffect, useState } from 'react';
// // // // // import { TableCell } from '@mui/material';
// // // // // import { getActionByVariableId } from '../api/actionInfoCellApi'; // Import the API function

// // // // // const ActionCell = ({ actionId, controlId, productFamilyId, softwareId }) => {
// // // // //   const [actionDescription, setActionDescription] = useState('Loading...');
// // // // //   const [error, setError] = useState(null);

// // // // //   useEffect(() => {
// // // // //     const fetchActionDescription = async () => {
// // // // //       console.log(actionId, controlId, productFamilyId, softwareId);
// // // // //       // try {
// // // // //       //   // Concatenate IDs to create the variableId
// // // // //       //   const variableId = `${actionId}_${controlId}_${productFamilyId}_${softwareId}`;

// // // // //       //   // Fetch the action description based on the concatenated variableId
// // // // //       //   const action = await getActionByVariableId(variableId);
// // // // //       //   setActionDescription(action?.description || 'N/A');
// // // // //       // } catch (err) {
// // // // //       //   setError('Error fetching action data');
// // // // //       //   setActionDescription('N/A');
// // // // //       // }
// // // // //     };

// // // // //     if (actionId && controlId && productFamilyId && softwareId) {
// // // // //       fetchActionDescription();
// // // // //     }
// // // // //   }, [actionId, controlId, productFamilyId, softwareId]);

// // // // //   if (error) {
// // // // //     return <TableCell>{error}</TableCell>;
// // // // //   }

// // // // //   return (
// // // // //     <TableCell>
// // // // //       abc
// // // // //       {/* {actionDescription} */}
// // // // //     </TableCell>
// // // // //   );
// // // // // };

// // // // // export default ActionCell;
