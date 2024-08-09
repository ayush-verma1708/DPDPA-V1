import React, { useState } from 'react';
import { addCompany } from '../api/companyApi';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const AddCompany = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [industryType, setIndustryType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const newCompany = { name, email, address, industryType };
    await addCompany(newCompany);
    setName('');
    setEmail('');
    setAddress('');
    setIndustryType('');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Add Company
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Offical Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Address"
          fullWidth
          margin="normal"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextField
          label="Industy Type"
          fullWidth
          margin="normal"
          value={industryType}
          onChange={(e) => setIndustryType(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Add Company
        </Button>
      </form>
    </Container>
  );
};

export default AddCompany;
