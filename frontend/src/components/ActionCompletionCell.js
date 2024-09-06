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

  // Memoize the checkCompletionStatus function to prevent re-creating it on every render
  useEffect(
    async (actionId, assetId, scopeId, controlId, familyId) => {
      try {
        const params = {
          actionId,
          assetId,
          controlId,
          familyId,
          ...(scopeId && { scopeId }), // Add scopeId only if it exists
        };

        const response = await axios.get(
          'http://localhost:8021/api/v1/completion-status',
          { params }
        );
        setIsCompleted(response.data?.isCompleted);
        return response.data?.isCompleted || false;
      } catch (error) {
        console.error('Error fetching completion status:', error);
        return setIsCompleted(false);
      }
    },
    [
      action,
      expandedFamilyId,
      selectedControlId,
      selectedAssetId,
      selectedScopeId,
    ]
  );

  // Fetch the completion status when dependencies change
  // useEffect(() => {
  //   const fetchCompletionStatus = async () => {
  //     const status = await fetchCompletionStatus(
  //       action._id,
  //       selectedAssetId,
  //       selectedScopeId,
  //       selectedControlId,
  //       expandedFamilyId
  //     );
  //     setIsCompleted(status);
  //   };

  //   fetchCompletionStatus();
  // }, [
  //   action._id,
  //   selectedAssetId,
  //   selectedScopeId,
  //   selectedControlId,
  //   expandedFamilyId,
  //   checkCompletionStatus,
  // ]);

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

// import React, { useState, useEffect } from 'react';
// import { TableCell, Button } from '@mui/material';
// import axios from 'axios';

// const ActionCompletionCell = ({ action, expandedFamilyId, selectedControlId, selectedAssetId, selectedScopeId, handleMarkAsCompleted }) => {
//   const [isCompleted, setIsCompleted] = useState(false);

//   useEffect(() => {
//     const fetchCompletionStatus = async () => {
//       const status = await checkCompletionStatus(
//         action._id,
//         selectedAssetId,
//         selectedScopeId,
//         selectedControlId,
//         expandedFamilyId
//       );
//       setIsCompleted(status);
//     };

//     fetchCompletionStatus();
//   }, [action._id, selectedAssetId, selectedScopeId, selectedControlId, expandedFamilyId]);

//   const checkCompletionStatus = async (actionId, assetId, scopeId, controlId, familyId) => {
//     try {
//       const params = {
//         actionId,
//         assetId,
//         controlId,
//         familyId,
//         ...(scopeId && { scopeId }),
//       };

//       const response = await axios.get('http://localhost:8021/api/v1/completion-status', { params });

//       return response.data?.isCompleted || false;
//     } catch (error) {
//       console.error('Error fetching completion status:', error);
//       return false;
//     }
//   };

//   return (
//     <TableCell>
//       {
//         isCompleted ? (
//           <Button variant="contained" color="success" disabled>
//             Evidence Confirm
//           </Button>
//         ) : (
//           <Button variant="contained" color="primary" onClick={() => handleMarkAsCompleted(action._id)}>
//             Check Evidence
//           </Button>
//         )
//       }
//     </TableCell>
//   );
// };

// export default ActionCompletionCell;
