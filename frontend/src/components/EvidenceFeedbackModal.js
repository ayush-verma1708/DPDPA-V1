import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from '@mui/material';

const QueryModal = ({
  open,
  onClose,
  handleQuerySubmit,
  evidenceUrl,
  actionId,
  controlId,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (query) {
      handleQuerySubmit(query, actionId, controlId);
      // console.log(actionId, controlId, query);
      setQuery(''); // Reset query input
      onClose(); // Close the modal
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Raise a Query</DialogTitle>
      <DialogContent>
        {evidenceUrl && (
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <img
              src={evidenceUrl}
              alt='Evidence Thumbnail'
              style={{ maxWidth: '100%', maxHeight: '200px' }} // Set size constraints
            />
          </div>
        )}
        <Typography variant='body1'>
          Please enter your query regarding the evidence.
        </Typography>
        <TextField
          autoFocus
          margin='dense'
          label='Enter your query'
          type='text'
          fullWidth
          variant='outlined'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color='primary' disabled={!query}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QueryModal;
