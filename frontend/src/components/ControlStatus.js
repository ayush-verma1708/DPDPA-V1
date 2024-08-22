import React, { useState, useEffect } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const ControlStatus = ({ selectedAssetId, selectedScopeId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedAssetId) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          // Construct the params object, including scopeId only if it's present
          const params = { assetId: selectedAssetId };
          if (selectedScopeId) {
            params.scopeId = selectedScopeId;
          }

          const response = await axios.get('http://localhost:8021/api/v1/controlStatus', { params });
          setData(response.data);
        } catch (error) {
          setError('Failed to fetch control status.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [selectedAssetId, selectedScopeId]);

  return (
    <div>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Control ID</TableCell>
                <TableCell>Control Name</TableCell>
                <TableCell>Total Actions</TableCell>
                <TableCell>Completed Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(control => (
                <TableRow key={control.controlId}>
                  <TableCell>{control.controlId}</TableCell>
                  <TableCell>{control.controlName}</TableCell>
                  <TableCell>{control.totalActions}</TableCell>
                  <TableCell>{control.completedActions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ControlStatus;
