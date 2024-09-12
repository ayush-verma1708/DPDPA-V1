// EvidenceTableCell.js
import React, { useState } from 'react';
import { TableCell, Button, Modal, Box, Typography } from '@mui/material';
import axios from 'axios';

const EvidenceTableCell = ({
  status,
  selectedAssetId,
  selectedScopeId,
  expandedFamilyId,
}) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleViewEvidence = async (actionId, controlId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`http://localhost:8021/`, {
        assetId: selectedAssetId,
        scopeId: selectedScopeId,
        actionId,
        familyId: expandedFamilyId,
        controlId,
      });

      if (res.data && res.data.fileUrl) {
        setFileUrl(res.data.fileUrl);
        setOpen(true);
      } else {
        setFileUrl(null);
        setError('No evidence found.');
      }
    } catch (err) {
      console.error('Error fetching evidence:', err);
      setFileUrl(null);
      setError('An error occurred while fetching evidence.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFileUrl(null);
    setError(null);
  };

  return (
    <TableCell>
      <Button
        variant='contained'
        color='primary'
        onClick={() =>
          handleViewEvidence(status.actionId?._id, status.controlId?._id)
        }
        disabled={loading}
      >
        {loading ? 'Loading...' : 'View Evidence'}
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            p: 2,
            bgcolor: 'background.paper',
            width: '80%',
            height: '80%',
            overflow: 'auto',
          }}
        >
          {fileUrl ? (
            fileUrl.endsWith('.pdf') ? (
              <iframe
                src={fileUrl}
                title='Evidence'
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <img
                src={fileUrl}
                alt='Evidence'
                style={{ width: '100%', height: 'auto' }}
              />
            )
          ) : (
            <Typography variant='body1' color='error'>
              {error ? error : 'No evidence to display'}
            </Typography>
          )}
        </Box>
      </Modal>
    </TableCell>
  );
};

export default EvidenceTableCell;
