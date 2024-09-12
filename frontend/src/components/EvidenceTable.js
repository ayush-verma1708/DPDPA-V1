import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';

const EvidenceTable = ({
  actions,

  expandedFamilyId,
  selectedControlId,
  selectedAssetId,
  selectedScopeId,

  handleFileChange,
  handleUploadEvidence,
}) => {
  const [evidenceUrls, setEvidenceUrls] = useState({});

  // Function to fetch all evidence URLs for the current actions
  const fetchEvidenceUrls = async () => {
    const urls = {};
    for (let action of actions) {
      const url = await handleViewEvidence(action._id);
      urls[action._id] = url; // Store the result (URL or null)
    }
    setEvidenceUrls(urls); // Update the state with fetched URLs
  };
  const handleViewEvidence = async (actionId) => {
    try {
      const res = await axios.post(
        `http://localhost:8021/api/evidence/params`,
        {
          assetId: selectedAssetId,
          scopeId: selectedScopeId,
          actionId,
          familyId: expandedFamilyId,
          controlId: selectedControlId,
        }
      );

      // Check if the response contains a valid file URL
      if (res.data && res.data.fileUrl) {
        return res.data.fileUrl;
      } else {
        return null; // No evidence found
      }
    } catch (error) {
      console.error('Error fetching evidence:', error);
      return null; // Return null if there's an error or no evidence
    }
  };

  useEffect(() => {
    if (actions.length > 0) {
      fetchEvidenceUrls(); // Fetch URLs whenever actions prop changes
    }
  }, [actions]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Action</TableCell>
            <TableCell>Control Description</TableCell>
            <TableCell>Evidence Confirmation Status</TableCell>
            <TableCell>Uploaded Evidence</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {actions.map((action) => (
            <TableRow key={action._id}>
              <TableCell>{action.variable_id}</TableCell>
              <TableCell>{action.controlDescription}</TableCell>

              <TableCell>
                <input type='file' onChange={handleFileChange} />
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => handleUploadEvidence(action._id)}
                >
                  Upload Evidence
                </Button>
              </TableCell>

              <TableCell>
                {evidenceUrls[action._id] ? (
                  <a
                    href={`http://localhost:8021${evidenceUrls[action._id]}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    View Evidence
                  </a>
                ) : (
                  'No evidence uploaded'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EvidenceTable;
