import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

const Header = ({ title, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ backgroundColor: "#f5f5f5" }}>
      <Box display="flex" justifyContent="space-between" p={2}>
        <Typography variant="body1" className="text-indigo-950">
          {title}
        </Typography>
        <Typography variant="body1">
          <Button className="text-red-950" onClick={handleLogout}>
            Logout
          </Button>
        </Typography>
      </Box>
    </AppBar>
  );
};

export default Header;
