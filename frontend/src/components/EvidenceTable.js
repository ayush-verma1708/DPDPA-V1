import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const EvidenceTable = ({ actions, handleFileChange, handleUploadEvidence, handleStatusChange, ActionCompletionCell, statusOptions, expandedFamilyId,
  selectedControlId,
  selectedAssetId,
  selectedScopeId, }) => {


  const [evidenceUrl,setEvidenceUrl] = useState('');

  const handleViewEvidence = async (actionId) => {
    
    try {
      console.log({assetId:selectedAssetId, scopeId:selectedScopeId,actionId, familyId:expandedFamilyId,  controlId:selectedControlId})
      const res = await axios.post(`http://localhost:8021/api/evidence/params`,{assetId:selectedAssetId, scopeId:selectedScopeId,actionId, familyId:expandedFamilyId,  controlId:selectedControlId})
      console.log(res.data);
      window.location.href=`http://localhost:8021${res.data.fileUrl.substr(res.data.fileUrl.lastIndexOf('/'))}`
    }
    catch {

    }
  }


  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Action</TableCell>
            <TableCell>Control Description</TableCell> {/* New column for control description */}
            <TableCell>Evidence Confirmation Status</TableCell> {/* New column for status */}
            {/* <TableCell>Completion Status</TableCell> */}
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
              {/* <ActionCompletionCell
                action={action}
                // Pass any additional props if needed
              /> */}
              <TableCell>
                <input type="file" onChange={handleFileChange} />
                <Button variant="contained" color="primary" onClick={() => handleUploadEvidence(action._id)}>
                  Upload Evidence
                </Button>
              </TableCell>
              <TableCell>
                {action.evidenceUrl ? (
                  <button onClick={()=>handleViewEvidence(action._id)}>
                    View Evidence
                  </button>
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

export default EvidenceTable;
