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
