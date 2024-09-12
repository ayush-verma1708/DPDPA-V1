import React, { useState, useEffect } from 'react';
import { TableCell, Button } from '@mui/material';
import axios from 'axios';

const ActionCompletionCell = ({
  action,
  expandedFamilyId,
  selectedControlId,
  selectedAssetId,
  selectedScopeId,
  handleMarkAsCompleted,
}) => {
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const checkCompletionStatus = async () => {
      try {
        const params = {
          actionId: action._id,
          assetId: selectedAssetId,
          controlId: selectedControlId,
          familyId: expandedFamilyId,
          ...(selectedScopeId && { scopeId: selectedScopeId }), // Add scopeId only if it exists
        };

        const response = await axios.get(
          'http://localhost:8021/api/v1/completion-status',
          { params }
        );
        setIsCompleted(response.data?.isCompleted || false);
      } catch (error) {
        console.error('Error fetching completion status:', error);
        setIsCompleted(false);
      }
    };

    // Call the function to fetch the completion status
    checkCompletionStatus();
  }, [
    action._id,
    expandedFamilyId,
    selectedControlId,
    selectedAssetId,
    selectedScopeId,
  ]);

  return (
    <TableCell>
      {isCompleted ? (
        <Button variant='contained' color='success' disabled>
          Evidence Confirmed
        </Button>
      ) : (
        <Button
          variant='contained'
          color='primary'
          onClick={() => handleMarkAsCompleted(action._id)}
        >
          Check Evidence
        </Button>
      )}
    </TableCell>
  );
};

export default ActionCompletionCell;
