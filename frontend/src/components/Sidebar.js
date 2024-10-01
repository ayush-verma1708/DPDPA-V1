import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ScoreboardOutlinedIcon from '@mui/icons-material/ScoreboardOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';
import SettingsApplicationsOutlinedIcon from '@mui/icons-material/SettingsApplicationsOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

// import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
// import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
// import VideogameAssetOutlinedIcon from '@mui/icons-material/VideogameAssetOutlined';
// import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
// import ControlPointDuplicateOutlinedIcon from '@mui/icons-material/ControlPointDuplicateOutlined';
// import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
// import AttractionsOutlinedIcon from '@mui/icons-material/AttractionsOutlined';

// import HouseRoundedIcon from '@mui/icons-material/HouseRounded';
// import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

// import ControlPointDuplicateOutlinedIcon from '@mui/icons-material/ControlPointDuplicateOutlined';
// import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
// import AttractionsOutlinedIcon from '@mui/icons-material/AttractionsOutlined';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import useFetchUser from '../hooks/useCurrentUser'; // Adjust the path if necessary

const Sidebar = ({ onSelect }) => {
  const location = useLocation();
  const activePath = location.pathname;
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem('token');
  const { user, loading, error } = useFetchUser(token);

  window.localStorage.setItem('company', user?.company._id);
  window.localStorage.setItem('username', user?.username);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Function to check role-based access
  const hasAccess = (rolesAllowed) => {
    return rolesAllowed.includes(user?.role);
  };

  return (
    // <Drawer
    //   variant='permanent'
    //   open={open}
    //   sx={{
    //     width: open ? 240 : 60,
    //     flexShrink: 0,
    //     backgroundColor: '#333',
    //     [`& .MuiDrawer-paper`]: {
    //       width: open ? 240 : 60,
    //       boxSizing: 'border-box',
    //       overflowX: 'hidden',
    //       transition: 'width 0.5s',
    //     },
    //   }}
    // >
    //   <Box
    //     sx={{
    //       display: 'flex',
    //       flexDirection: 'column',
    //       height: '100%',
    //       backgroundColor: '#333',
    //     }}
    //   >
    //     <IconButton
    //       onClick={toggleDrawer}
    //       sx={{
    //         alignSelf: open ? 'flex-end' : 'center',
    //         margin: open ? '0 8px' : '0',
    //       }}
    //     >
    //       {open ? (
    //         <ChevronLeftIcon sx={{ color: 'white' }} />
    //       ) : (
    //         <MenuIcon sx={{ color: 'white' }} />
    //       )}
    //     </IconButton>

    //     <List
    //       sx={{
    //         flexGrow: 1,
    //         flexDirection: 'column',
    //         justifyContent: 'center',
    //         alignItems: open ? 'flex-start' : 'center',
    //       }}
    //     >
    //       {hasAccess(['Compliance Team', 'Admin', 'IT Team', 'Auditor']) && (
    //         <ListItem
    //           button
    //           component={Link}
    //           to='/'
    //           className={clsx({ active: activePath === '/' })}
    //           aria-label='Home'
    //           onClick={() => onSelect('Home')}
    //           sx={{ width: '100%' }}
    //         >
    //           <ListItemIcon>
    //             <HouseRoundedIcon sx={{ color: 'white' }} />
    //           </ListItemIcon>
    //           {open && <ListItemText primary='Home' sx={{ color: 'white' }} />}
    //         </ListItem>
    //       )}

    //       {hasAccess(['Compliance Team', 'Executive', 'IT Team']) && (
    //         <ListItem
    //           button
    //           component={Link}
    //           to='/scoreboard'
    //           className={clsx({ active: activePath === '/scoreboard' })}
    //           aria-label='Scoreboard'
    //           onClick={() => onSelect('Scoreboard')}
    //           sx={{ width: '100%' }}
    //         >
    //           <ListItemIcon>
    //             <DashboardOutlinedIcon sx={{ color: 'white' }} />
    //           </ListItemIcon>
    //           {open && (
    //             <ListItemText primary='Scoreboard' sx={{ color: 'white' }} />
    //           )}
    //         </ListItem>
    //       )}

    //       {hasAccess(['Compliance Team', 'Executive']) && (
    //         <ListItem
    //           button
    //           component={Link}
    //           to='/risk-analysis'
    //           className={clsx({ active: activePath === '/risk-analysis' })}
    //           aria-label='Risk Analysis'
    //           onClick={() => onSelect('Risk Analysis')}
    //           sx={{ width: '100%' }}
    //         >
    //           <ListItemIcon>
    //             <FactCheckOutlinedIcon sx={{ color: 'white' }} />
    //           </ListItemIcon>
    //           {open && (
    //             <ListItemText primary='Risk Analysis' sx={{ color: 'white' }} />
    //           )}
    //         </ListItem>
    //       )}

    //       {hasAccess(['Compliance Team', 'IT Team']) && (
    //         <ListItem
    //           button
    //           component={Link}
    //           to='/asset-management'
    //           className={clsx({ active: activePath === '/asset-management' })}
    //           aria-label='Asset Management'
    //           onClick={() => onSelect('Asset Management')}
    //           sx={{ width: '100%' }}
    //         >
    //           <ListItemIcon>
    //             <VideogameAssetOutlinedIcon sx={{ color: 'white' }} />
    //           </ListItemIcon>
    //           {open && (
    //             <ListItemText
    //               primary='Asset Management'
    //               sx={{ color: 'white' }}
    //             />
    //           )}
    //         </ListItem>
    //       )}

    //       {hasAccess(['Compliance Team', 'IT Team', 'Auditor']) && (
    //         <ListItem
    //           button
    //           component={Link}
    //           to='/list-of-actions'
    //           className={clsx({ active: activePath === '/list-of-actions' })}
    //           aria-label='List of Actions'
    //           onClick={() => onSelect('List of Actions')}
    //           sx={{ width: '100%' }}
    //         >
    //           <ListItemIcon>
    //             <FactCheckOutlinedIcon sx={{ color: 'white' }} />
    //           </ListItemIcon>
    //           {open && (
    //             <ListItemText primary='compliance operation' sx={{ color: 'white' }} />
    //           )}
    //         </ListItem>
    //       )}

    //       {hasAccess(['Compliance Team', 'Admin']) && (
    //         <ListItem
    //           button
    //           component={Link}
    //           to='/user-creation'
    //           className={clsx({ active: activePath === '/user-creation' })}
    //           aria-label='User Creation'
    //           onClick={() => onSelect('User Creation')}
    //           sx={{ width: '100%' }}
    //         >
    //           <ListItemIcon>
    //             <GroupAddOutlinedIcon sx={{ color: 'white' }} />
    //           </ListItemIcon>
    //           {open && (
    //             <ListItemText primary='User Creation' sx={{ color: 'white' }} />
    //           )}
    //         </ListItem>
    //       )}

    //       {hasAccess(['Compliance Team']) && (
    //         <ListItem
    //           button
    //           component={Link}
    //           to='/control-families'
    //           className={clsx({ active: activePath === '/control-families' })}
    //           aria-label='Control Families'
    //           onClick={() => onSelect('Control Families')}
    //           sx={{ width: '100%' }}
    //         >
    //           <ListItemIcon>
    //             <ControlPointDuplicateOutlinedIcon sx={{ color: 'white' }} />
    //           </ListItemIcon>
    //           {open && (
    //             <ListItemText
    //               primary='Control Families'
    //               sx={{ color: 'white' }}
    //             />
    //           )}
    //         </ListItem>
    //       )}
    //       {hasAccess(['Compliance Team']) && (
    //         <ListItem
    //           button
    //           component={Link}
    //           to='/controls'
    //           className={clsx({ active: activePath === '/controls' })}
    //           aria-label='Controls'
    //           onClick={() => onSelect('Controls')}
    //           sx={{ width: '100%' }}
    //         >
    //           <ListItemIcon>
    //             <ControlPointOutlinedIcon sx={{ color: 'white' }} />
    //           </ListItemIcon>
    //           {open && (
    //             <ListItemText primary='Controls' sx={{ color: 'white' }} />
    //           )}
    //         </ListItem>
    //       )}

    //       {hasAccess(['Compliance Team']) && (
    //         <ListItem
    //           button
    //           component={Link}
    //           to='/actions'
    //           className={clsx({ active: activePath === '/actions' })}
    //           aria-label='Actions'
    //           onClick={() => onSelect('Actions')}
    //           sx={{ width: '100%' }}
    //         >
    //           <ListItemIcon>
    //             <AttractionsOutlinedIcon sx={{ color: 'white' }} />
    //           </ListItemIcon>
    //           {open && (
    //             <ListItemText primary='Actions' sx={{ color: 'white' }} />
    //           )}
    //         </ListItem>
    //       )}

    //       {/* Settings Page - accessible to all roles */}
    //       <ListItem
    //         button
    //         component={Link}
    //         to='/settings'
    //         className={clsx({ active: activePath === '/settings' })}
    //         aria-label='Settings'
    //         onClick={() => onSelect('Settings')}
    //         sx={{ width: '100%' }}
    //       >
    //         <ListItemIcon>
    //           <DashboardOutlinedIcon sx={{ color: 'white' }} />
    //         </ListItemIcon>
    //         {open && (
    //           <ListItemText primary='Settings' sx={{ color: 'white' }} />
    //         )}
    //       </ListItem>
    //     </List>
    //   </Box>
    // </Drawer>
    <Drawer
      variant='permanent'
      open={open}
      sx={{
        width: open ? 240 : 60,
        flexShrink: 0,
        backgroundColor: '#333',
        [`& .MuiDrawer-paper`]: {
          width: open ? 240 : 60,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transition: 'width 0.5s',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: '#333',
        }}
      >
        <IconButton
          onClick={toggleDrawer}
          sx={{
            alignSelf: open ? 'flex-end' : 'center',
            margin: open ? '0 8px' : '0',
          }}
        >
          {open ? (
            <ChevronLeftIcon sx={{ color: 'white' }} />
          ) : (
            <MenuIcon sx={{ color: 'white' }} />
          )}
        </IconButton>

        <List
          sx={{
            flexGrow: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: open ? 'flex-start' : 'center',
          }}
        >
          {hasAccess([
            'Compliance Team',
            'Admin',
            'IT Team',
            'Auditor',
            'External Auditor',
          ]) && (
            <ListItem
              button
              component={Link}
              to='/'
              className={clsx({ active: activePath === '/' })}
              aria-label='Home'
              onClick={() => onSelect('Home')}
              sx={{ width: '100%' }}
            >
              <ListItemIcon>
                <HomeOutlinedIcon sx={{ color: 'white' }} /> {/* Updated */}
              </ListItemIcon>
              {open && <ListItemText primary='Home' sx={{ color: 'white' }} />}
            </ListItem>
          )}

          {hasAccess(['Compliance Team', 'Executive', 'IT Team']) && (
            <ListItem
              button
              component={Link}
              to='/scoreboard'
              className={clsx({ active: activePath === '/scoreboard' })}
              aria-label='Scoreboard'
              onClick={() => onSelect('Scoreboard')}
              sx={{ width: '100%' }}
            >
              <ListItemIcon>
                <ScoreboardOutlinedIcon sx={{ color: 'white' }} />{' '}
                {/* Updated */}
              </ListItemIcon>
              {open && (
                <ListItemText primary='Scoreboard' sx={{ color: 'white' }} />
              )}
            </ListItem>
          )}

          {hasAccess(['Compliance Team', 'Executive']) && (
            <ListItem
              button
              component={Link}
              to='/risk-analysis'
              className={clsx({ active: activePath === '/risk-analysis' })}
              aria-label='Risk Analysis'
              onClick={() => onSelect('Risk Analysis')}
              sx={{ width: '100%' }}
            >
              <ListItemIcon>
                <InsightsOutlinedIcon sx={{ color: 'white' }} /> {/* Updated */}
              </ListItemIcon>
              {open && (
                <ListItemText primary='Risk Analysis' sx={{ color: 'white' }} />
              )}
            </ListItem>
          )}

          {hasAccess(['Compliance Team', 'IT Team']) && (
            <ListItem
              button
              component={Link}
              to='/asset-management'
              className={clsx({ active: activePath === '/asset-management' })}
              aria-label='Asset Management'
              onClick={() => onSelect('Asset Management')}
              sx={{ width: '100%' }}
            >
              <ListItemIcon>
                <DevicesOutlinedIcon sx={{ color: 'white' }} /> {/* Updated */}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary='Asset Management'
                  sx={{ color: 'white' }}
                />
              )}
            </ListItem>
          )}

          {hasAccess([
            'Compliance Team',
            'IT Team',
            'Auditor',
            'External Auditor',
          ]) && (
            <ListItem
              button
              component={Link}
              to='/list-of-actions'
              className={clsx({ active: activePath === '/list-of-actions' })}
              aria-label='List of Actions'
              onClick={() => onSelect('List of Actions')}
              sx={{ width: '100%' }}
            >
              <ListItemIcon>
                <ChecklistOutlinedIcon sx={{ color: 'white' }} />{' '}
                {/* Updated */}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary='Compliance Operation'
                  sx={{ color: 'white' }}
                />
              )}
            </ListItem>
          )}

          {hasAccess(['Compliance Team', 'Admin']) && (
            <ListItem
              button
              component={Link}
              to='/user-creation'
              className={clsx({ active: activePath === '/user-creation' })}
              aria-label='User Creation'
              onClick={() => onSelect('User Creation')}
              sx={{ width: '100%' }}
            >
              <ListItemIcon>
                <PersonAddAltOutlinedIcon sx={{ color: 'white' }} />{' '}
                {/* Updated */}
              </ListItemIcon>
              {open && (
                <ListItemText primary='User Creation' sx={{ color: 'white' }} />
              )}
            </ListItem>
          )}

          {hasAccess(['Compliance Team']) && (
            <ListItem
              button
              component={Link}
              to='/control-families'
              className={clsx({ active: activePath === '/control-families' })}
              aria-label='Control Families'
              onClick={() => onSelect('Control Families')}
              sx={{ width: '100%' }}
            >
              <ListItemIcon>
                <FolderSharedOutlinedIcon sx={{ color: 'white' }} />{' '}
                {/* Updated */}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary='Control Families'
                  sx={{ color: 'white' }}
                />
              )}
            </ListItem>
          )}

          {hasAccess(['Compliance Team']) && (
            <ListItem
              button
              component={Link}
              to='/controls'
              className={clsx({ active: activePath === '/controls' })}
              aria-label='Controls'
              onClick={() => onSelect('Controls')}
              sx={{ width: '100%' }}
            >
              <ListItemIcon>
                <SettingsApplicationsOutlinedIcon sx={{ color: 'white' }} />{' '}
                {/* Updated */}
              </ListItemIcon>
              {open && (
                <ListItemText primary='Controls' sx={{ color: 'white' }} />
              )}
            </ListItem>
          )}

          {hasAccess(['Compliance Team']) && (
            <ListItem
              button
              component={Link}
              to='/actions'
              className={clsx({ active: activePath === '/actions' })}
              aria-label='Actions'
              onClick={() => onSelect('Actions')}
              sx={{ width: '100%' }}
            >
              <ListItemIcon>
                <ManageAccountsOutlinedIcon sx={{ color: 'white' }} />{' '}
                {/* Updated */}
              </ListItemIcon>
              {open && (
                <ListItemText primary='Actions' sx={{ color: 'white' }} />
              )}
            </ListItem>
          )}

          {/* Settings Page - accessible to all roles */}
          {/* <ListItem
            button
            component={Link}
            to='/settings'
            className={clsx({ active: activePath === '/settings' })}
            aria-label='Settings'
            onClick={() => onSelect('Settings')}
            sx={{ width: '100%' }}
          >
            <ListItemIcon>
              <SettingsOutlinedIcon sx={{ color: 'white' }} /> 
            </ListItemIcon>
            {open && (
              <ListItemText primary='Settings' sx={{ color: 'white' }} />
            )}
          </ListItem> */}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;

// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import clsx from 'clsx';
// import HouseRoundedIcon from '@mui/icons-material/HouseRounded';
// import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
// import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
// import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
// import VideogameAssetOutlinedIcon from '@mui/icons-material/VideogameAssetOutlined';
// import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
// import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
// import ControlPointDuplicateOutlinedIcon from '@mui/icons-material/ControlPointDuplicateOutlined';
// import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
// import AttractionsOutlinedIcon from '@mui/icons-material/AttractionsOutlined';
// import MenuIcon from '@mui/icons-material/Menu';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import {
//   Box,
//   Drawer,
//   IconButton,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
// } from '@mui/material';

// import useFetchUser from '../hooks/useCurrentUser'; // Adjust the path if necessary

// const Sidebar = ({ onSelect }) => {
//   const location = useLocation();
//   const activePath = location.pathname;
//   const [open, setOpen] = useState(false);

//   const token = localStorage.getItem('token');
//   const { user, loading, error } = useFetchUser(token);

//   window.localStorage.setItem('company', user?.company._id);
//   window.localStorage.setItem('username', user?.username);

//   const toggleDrawer = () => {
//     setOpen(!open);
//   };

//   return (
//     <Drawer
//       variant='permanent'
//       open={open}
//       sx={{
//         width: open ? 240 : 60,
//         flexShrink: 0,
//         backgroundColor: '#333',
//         [`& .MuiDrawer-paper`]: {
//           width: open ? 240 : 60,
//           boxSizing: 'border-box',
//           overflowX: 'hidden',
//           transition: 'width 0.5s',
//         },
//       }}
//     >
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           height: '100%',
//           backgroundColor: '#333',
//         }}
//       >
//         <IconButton
//           onClick={toggleDrawer}
//           sx={{
//             alignSelf: open ? 'flex-end' : 'center',
//             margin: open ? '0 8px' : '0',
//           }}
//         >
//           {open ? (
//             <ChevronLeftIcon sx={{ color: 'white' }} />
//           ) : (
//             <MenuIcon sx={{ color: 'white' }} />
//           )}
//         </IconButton>
//         <List
//           sx={{
//             flexGrow: 1,
//             flexDirection: 'column',
//             justifyContent: 'center',
//             alignItems: open ? 'flex-start' : 'center',
//           }}
//         >
//           <ListItem
//             button
//             component={Link}
//             to='/'
//             className={clsx({ active: activePath === '/' })}
//             aria-label='Home'
//             onClick={() => onSelect('Home')}
//             sx={{ width: '100%' }}
//           >
//             <ListItemIcon>
//               <HouseRoundedIcon sx={{ color: 'white' }} />
//             </ListItemIcon>
//             {open && <ListItemText primary='Home' sx={{ color: 'white' }} />}
//           </ListItem>

//           <ListItem
//             button
//             component={Link}
//             to='/dashboard'
//             className={clsx({ active: activePath === '/dashboard' })}
//             aria-label='Dashboard'
//             onClick={() => onSelect('Dashboard')}
//             sx={{ width: '100%' }}
//           >
//             <ListItemIcon>
//               <DashboardOutlinedIcon sx={{ color: 'white' }} />
//             </ListItemIcon>
//             {open && (
//               <ListItemText primary='Dashboard' sx={{ color: 'white' }} />
//             )}
//           </ListItem>
//           <ListItem
//             button
//             component={Link}
//             to='/user-creation'
//             className={clsx({ active: activePath === '/user-creation' })}
//             aria-label='User Creation'
//             onClick={() => onSelect('User Creation')}
//             sx={{ width: '100%' }}
//           >
//             <ListItemIcon>
//               <GroupAddOutlinedIcon sx={{ color: 'white' }} />
//             </ListItemIcon>
//             {open && (
//               <ListItemText primary='User Creation' sx={{ color: 'white' }} />
//             )}
//           </ListItem>
//           <ListItem
//             button
//             component={Link}
//             to='/asset-management'
//             className={clsx({ active: activePath === '/asset-management' })}
//             aria-label='Asset Management'
//             onClick={() => onSelect('Asset Management')}
//             sx={{ width: '100%' }}
//           >
//             <ListItemIcon>
//               <VideogameAssetOutlinedIcon sx={{ color: 'white' }} />
//             </ListItemIcon>
//             {open && (
//               <ListItemText
//                 primary='Asset Management'
//                 sx={{ color: 'white' }}
//               />
//             )}
//           </ListItem>
//           <ListItem
//             button
//             component={Link}
//             to='/list-of-actions'
//             className={clsx({ active: activePath === '/list-of-actions' })}
//             aria-label='List of Actions'
//             onClick={() => onSelect('List of Actions')}
//             sx={{ width: '100%' }}
//           >
//             <ListItemIcon>
//               <FactCheckOutlinedIcon sx={{ color: 'white' }} />
//             </ListItemIcon>
//             {open && (
//               <ListItemText primary='List of Actions' sx={{ color: 'white' }} />
//             )}
//           </ListItem>
//           {/* <ListItem
//             button
//             component={Link}
//             to="/alert-management"
//             className={clsx({ 'active': activePath === '/alert-management' })}
//             aria-label="Alert and Recommendations"
//             onClick={() => onSelect('Alerts and Recommendations')}
//             sx={{ width: '100%' }}
//             >
//                 <ListItemIcon>
//                 <CampaignOutlinedIcon  sx={{color: 'white'}}/>
//               </ListItemIcon>
//               {open && <ListItemText primary="Alerts and Recommendations" sx={{color: 'white'}}/>}
//           </ListItem> */}
//           <ListItem
//             button
//             component={Link}
//             to='/control-families'
//             className={clsx({ active: activePath === '/control-families' })}
//             aria-label='Control Families'
//             onClick={() => onSelect('Control Families')}
//             sx={{ width: '100%' }}
//           >
//             <ListItemIcon>
//               <ControlPointDuplicateOutlinedIcon sx={{ color: 'white' }} />
//             </ListItemIcon>
//             {open && (
//               <ListItemText
//                 primary='Control Families'
//                 sx={{ color: 'white' }}
//               />
//             )}
//           </ListItem>
//           <ListItem
//             button
//             component={Link}
//             to='/controls'
//             className={clsx({ active: activePath === '/controls' })}
//             aria-label='Controls'
//             onClick={() => onSelect('Controls')}
//             sx={{ width: '100%' }}
//           >
//             <ListItemIcon>
//               <ControlPointOutlinedIcon sx={{ color: 'white' }} />
//             </ListItemIcon>
//             {open && (
//               <ListItemText primary='Controls' sx={{ color: 'white' }} />
//             )}
//           </ListItem>
//           <ListItem
//             button
//             component={Link}
//             to='/actions'
//             className={clsx({ active: activePath === '/actions' })}
//             aria-label='Actions'
//             onClick={() => onSelect('Actions')}
//             sx={{ width: '100%' }}
//           >
//             <ListItemIcon>
//               <AttractionsOutlinedIcon sx={{ color: 'white' }} />
//             </ListItemIcon>
//             {open && <ListItemText primary='Actions' sx={{ color: 'white' }} />}
//           </ListItem>
//         </List>
//       </Box>
//     </Drawer>
//   );
// };

// export default Sidebar;
