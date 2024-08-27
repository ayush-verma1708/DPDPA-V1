import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

const Header = ({ title, user, handleLogout }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#f5f5f5" }}>
      <Toolbar>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography variant="body1" className="text-indigo-950">
            {title}
          </Typography>
          
          <Box textAlign="center">
            <Typography variant="body1" sx={{ color: '#111' }}>
              {user ? `Hello, ${user.username}` : "Hello, Guest"}
            </Typography>
            <Typography variant="body2" sx={{ color: '#555' }}>
              {user ? `Role: ${user.role}` : "Role: Guest"}
            </Typography>
          </Box>

          <Button color="inherit" onClick={handleLogout} sx={{ color: '#111' }}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

// import React from 'react';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import { Box } from '@mui/material';

// const Header = ({ title, user, handleLogout }) => {
//   return (
//     <AppBar position="static" sx={{ backgroundColor: "#f5f5f5" }}>
//       <Toolbar>
//         <Box display="flex" justifyContent="space-between" width="100%">
//           <Typography variant="body1" className="text-indigo-950">
//             {title}
//           </Typography>
//           <Typography variant="body1" sx={{ color: '#111' }}>
//             {user ? `Hello, ${user.username}` : "Hello Guest"}
//             {user ? `User Role, ${user.role}` : "Role : Guest"}
//           </Typography>
//           <Button color="inherit" onClick={handleLogout} sx={{ color: '#111' }}>
//             Logout
//           </Button>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;

// // import React from 'react';
// // import AppBar from '@mui/material/AppBar';
// // import Toolbar from '@mui/material/Toolbar';
// // import Typography from '@mui/material/Typography';
// // import Button from '@mui/material/Button';
// // import { useNavigate } from 'react-router-dom';
// // import { Box } from '@mui/material';

// // const Header = ({ title, user, handleLogout }) => {
// //   const navigate = useNavigate();

// //   const handleLogoutAndNavigate = () => {
// //     handleLogout(); // Call logout function
// //     navigate('/login'); // Redirect to login page
// //   };

// //   return (
// //     <AppBar position="static" sx={{ backgroundColor: "#f5f5f5" }}>
// //       <Toolbar>
// //         <Box display="flex" justifyContent="space-between" width="100%">
// //           <Typography variant="body1" sx={{ color: '#111' }}>
// //             {title}
// //           </Typography>
// //           <Typography variant="body1" sx={{ color: '#111' }}>
// //             {user ? `Hello, ${user.username}` : "Hello Guest"}
// //           </Typography>
// //           <Button color="inherit" onClick={handleLogoutAndNavigate} sx={{ color: '#111' }}>
// //             Logout
// //           </Button>
// //         </Box>
// //       </Toolbar>
// //     </AppBar>
// //   );
// // };

// // export default Header;

// // // src/components/Header.js
// // import React from 'react';
// // import AppBar from '@mui/material/AppBar';
// // import Toolbar from '@mui/material/Toolbar';
// // import Typography from '@mui/material/Typography';
// // import Button from '@mui/material/Button';
// // import { useNavigate } from 'react-router-dom';
// // import { Box } from '@mui/material';

// // const Header = ({ title, user, handleLogout }) => {
// //   const navigate = useNavigate();

// //   return (
// //     <AppBar position="static" sx={{ backgroundColor: "#f5f5f5" }}>
// //       <Toolbar>
// //         <Box display="flex" justifyContent="space-between" width="100%">
// //           <Typography variant="body1" className="text-indigo-950">
// //             {title}
// //           </Typography>
// //           <Typography variant="body1" sx={{ color: '#111' }}>
// //             {user ? `Hello, ${user.username}` : "Hello Guest"}
// //           </Typography>
// //           <Button color="inherit" onClick={handleLogout} sx={{ color: '#111' }}>
// //             Logout
// //           </Button>
// //         </Box>
// //       </Toolbar>
// //     </AppBar>
// //   );
// // };

// // export default Header;

// // import React from "react";
// // import AppBar from "@mui/material/AppBar";
// // import Toolbar from "@mui/material/Toolbar";
// // import Typography from "@mui/material/Typography";
// // import Button from "@mui/material/Button";
// // import { useNavigate } from "react-router-dom";
// // import { Box } from "@mui/material";

// // const Header = ({ title,user, handleLogout }) => {
// //   const navigate = useNavigate();

// //   return (
// //     <AppBar position="static" sx={{ backgroundColor: "#f5f5f5" }}>
// //       <Box display="flex" justifyContent="space-between" p={2}>
// //         <Typography variant="body1" className="text-indigo-950">
// //           {title}
// //         </Typography>
// //         <Typography variant="body1">
// //           {user ? `Hello, ${user.name}` : "Not logged in"}
// //         </Typography>
// //         <Typography variant="body1">
// //           <Button className="text-red-950" onClick={handleLogout}>
// //             Logout
// //           </Button>
// //         </Typography>
// //       </Box>
// //     </AppBar>
// //   );
// // };

// // export default Header;
