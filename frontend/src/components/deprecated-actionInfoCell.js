import React, { useEffect, useState } from 'react';
import { TableCell } from '@mui/material';
import { getActionByVariableId } from './actionInfoCellApi'; // Import the API function

const ActionCell = ({ actionId, controlId, productFamilyId, softwareId }) => {
  const [actionDescription, setActionDescription] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActionDescription = async () => {
      try {
        // Concatenate IDs to create the variableId
        const variableId = `${actionId}_${controlId}_${productFamilyId}_${softwareId}`;

        // Fetch the action description based on the concatenated variableId
        const action = await getActionByVariableId(variableId);
        setActionDescription(action?.description || 'N/A');
      } catch (err) {
        setError('Error fetching action data');
        setActionDescription('N/A');
      }
    };

    if (actionId && controlId && productFamilyId && softwareId) {
      fetchActionDescription();
    }
  }, [actionId, controlId, productFamilyId, softwareId]);

  if (error) {
    return <TableCell>{error}</TableCell>;
  }

  return <TableCell>{actionDescription}</TableCell>;
};

export default ActionCell;
