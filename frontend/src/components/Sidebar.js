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
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import AddchartIcon from '@mui/icons-material/Addchart';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';

import useFetchUser from '../hooks/useCurrentUser';

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

  const hasAccess = (rolesAllowed) => {
    return rolesAllowed.includes(user?.role);
  };

  return (
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
          height: '100vh', // Ensures full height of the viewport
          backgroundColor: '#333',
          overflowY: 'auto', // Makes the sidebar scrollable if the content exceeds the height
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
              to='/dashboard'
              className={clsx({ active: activePath === '/dashboard' })}
              aria-label='Home'
              onClick={() => onSelect('Home')}
              sx={{ width: '100%' }}
            >
              <ListItemIcon>
                <HomeOutlinedIcon sx={{ color: 'white' }} />
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
                <ScoreboardOutlinedIcon sx={{ color: 'white' }} />
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
                <InsightsOutlinedIcon sx={{ color: 'white' }} />
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
                <DevicesOutlinedIcon sx={{ color: 'white' }} />
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
              to='/Compliance-Operation'
              className={clsx({
                active: activePath === '/Compliance-Operation',
              })}
              aria-label='List of Actions'
              onClick={() => onSelect('List of Actions')}
              sx={{ width: '100%' }}
            >
              <ListItemIcon>
                <ChecklistOutlinedIcon sx={{ color: 'white' }} />
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
                <PersonAddAltOutlinedIcon sx={{ color: 'white' }} />
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
                <FolderSharedOutlinedIcon sx={{ color: 'white' }} />
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
                <SettingsApplicationsOutlinedIcon sx={{ color: 'white' }} />
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
                <ManageAccountsOutlinedIcon sx={{ color: 'white' }} />
              </ListItemIcon>
              {open && (
                <ListItemText primary='Actions' sx={{ color: 'white' }} />
              )}
            </ListItem>
          )}
          {hasAccess(['Compliance Team', 'Admin']) && (
            <ListItem
              button
              component={Link}
              to='/scanner'
              className={clsx({ active: activePath === '/scanner' })}
              aria-label='Scanner'
              onClick={() => onSelect('Scanner')}
              sx={{ width: '100%' }}
            >
              <ListItemIcon>
                <SearchIcon sx={{ color: 'white' }} />
              </ListItemIcon>
              {open && (
                <ListItemText primary='Scanner' sx={{ color: 'white' }} />
              )}
            </ListItem>
          )}

          <ListItem
            button
            component={Link}
            to='/Training'
            className={clsx({ active: activePath === '/Training' })}
            aria-label='Training'
            onClick={() => onSelect('Training')}
            sx={{ width: '100%' }}
          >
            <ListItemIcon>
              <SchoolIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            {open && (
              <ListItemText primary='Training' sx={{ color: 'white' }} />
            )}
          </ListItem>
          <ListItem
            button
            component={Link}
            to='/Simulation'
            className={clsx({ active: activePath === '/Simulation' })}
            aria-label='Simulation'
            onClick={() => onSelect('Simulation')}
            sx={{ width: '100%' }}
          >
            <ListItemIcon>
              <AddModeratorIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            {open && (
              <ListItemText primary='Simulation' sx={{ color: 'white' }} />
            )}
          </ListItem>

          {/* Nested List for Sub-Items (Course 1 & Course 2) */}
          {open && (
            <List sx={{ paddingLeft: 3 }}>
              {/* Course 1 */}
              <ListItemButton component={Link} to='/Ransomware'>
                <ListItemIcon>
                  <InventoryOutlinedIcon sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary='Ransomware' sx={{ color: 'white' }} />
              </ListItemButton>

              {/* Course 2 */}
              <ListItemButton component={Link} to='/Phishing'>
                <ListItemIcon>
                  <AddchartIcon sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary='Phishing' sx={{ color: 'white' }} />
              </ListItemButton>
            </List>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
