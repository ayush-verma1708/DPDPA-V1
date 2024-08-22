import React, { useState, useEffect } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const ControlFamilyStatus = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:8021/api/v1/controlFamilyStatus');
        setData(response.data);
      } catch (error) {
        setError('Failed to fetch control family status.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Family ID</TableCell>
                <TableCell>Total Controls</TableCell>
                <TableCell>Completed Controls</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(family => (
                <TableRow key={family.familyId}>
                  <TableCell>{family.familyId}</TableCell>
                  <TableCell>{family.totalControls}</TableCell>
                  <TableCell>{family.completedControls}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ControlFamilyStatus;
