import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const HistoryTable = ({ historyData }) => {
  return (
    <TableContainer component={Paper} style={{ maxHeight: 400, overflow: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Comments</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {historyData.map((entry, index) => (
            <TableRow key={index}>
              <TableCell>{entry.date}</TableCell>
              <TableCell>{entry.action}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell>{entry.status || 'N/A'}</TableCell>
              <TableCell>{entry.user || 'N/A'}</TableCell>
              <TableCell>{entry.comments || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HistoryTable;
