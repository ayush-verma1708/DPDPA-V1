import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem } from '@mui/material';


const StatusCheckTable = ({  expandedFamilyId,selectedControlId , selectedAssetId , selectedScopeId , handleMarkAsCompleted,actions, handleFileChange, handleUploadEvidence, handleStatusChange, ActionCompletionCell, statusOptions }) => {

  return (
    <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Action</TableCell>
          <TableCell>Control Description</TableCell> {/* New column for control description */}
          {/* <TableCell>Evidence Confirmation Status</TableCell> New column for status */}
          <TableCell>Completion Status</TableCell>
          {/* <TableCell>Upload File</TableCell> */}
          <TableCell>Uploaded Evidence</TableCell> {/* New column for viewing evidence */}
          <TableCell>Current Status</TableCell> {/* New column for viewing evidence */}
        </TableRow>
      </TableHead>
      <TableBody>
        {actions.map(action => (
          <TableRow key={action._id}>
            <TableCell>{action.variable_id}</TableCell>
            <TableCell>{action.controlDescription}</TableCell> {/* Display control description */}
            {/* <TableCell>{action.isCompleted ? "Completed" : "Pending"}</TableCell> */}
            <ActionCompletionCell
              action={action}
              expandedFamilyId={expandedFamilyId}
              selectedControlId={selectedControlId}
              selectedAssetId={selectedAssetId}
              selectedScopeId={selectedScopeId}
              handleMarkAsCompleted={handleMarkAsCompleted}
  
            />
            {/* <TableCell>
              <input type="file" onChange={handleFileChange} />
              <Button variant="contained" color="primary" onClick={() => handleUploadEvidence(action._id)}>
                Upload Evidence
              </Button>
            </TableCell> */}
            <TableCell>
              {action.evidenceUrl ? (
                <a href={action.evidenceUrl} target="_blank" rel="noopener noreferrer">
                  View Evidence
                </a>
              ) : (
                'No evidence uploaded'
              )}
            </TableCell>
            <TableCell>
              <Select
                value={action.status}
                onChange={(e) => handleStatusChange(action._id, e.target.value)}
              >
                {statusOptions.map(status => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  );
};

export default StatusCheckTable;
