import React from 'react';
import { MenuItem, Select, FormControl, InputLabel, CircularProgress, FormHelperText, ListItemText } from '@mui/material';

const Dropdown = ({ label, options = [], value, onChange, loading, error, helperText }) => {
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
        disabled={loading || error}
      >
        <MenuItem>
                        <ListItemText primary="Add New Item" />
                    </MenuItem>
                    {/* <MenuItem onClick={() => handleAdd('Country')}>
                        <ListItemText primary="Add New Country" />
                    </MenuItem> */}
        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={24} />
          </MenuItem>
        ) : error ? (
          <MenuItem disabled>{error}</MenuItem>
        ) : (
          options.map((option) => (
            <MenuItem key={option._id} value={option._id}>
              {option.name}
            </MenuItem>
          ))
        )}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default Dropdown;
