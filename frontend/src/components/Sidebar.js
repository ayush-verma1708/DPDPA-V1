import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import HouseRoundedIcon from '@mui/icons-material/HouseRounded';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import VideogameAssetOutlinedIcon from '@mui/icons-material/VideogameAssetOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import ControlPointDuplicateOutlinedIcon from '@mui/icons-material/ControlPointDuplicateOutlined';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import AttractionsOutlinedIcon from '@mui/icons-material/AttractionsOutlined';  
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Box, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

const Sidebar = ({onSelect}) => {
  const location = useLocation();
  const activePath = location.pathname;
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? 240 : 60,
        flexShrink: 0,
        backgroundColor:"#333",
        [`& .MuiDrawer-paper`]: {
          width: open ? 240 : 60,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transition: 'width 0.5s',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' , backgroundColor: '#333' }}>
        <IconButton onClick={toggleDrawer} sx={{ alignSelf: open ? 'flex-end' : 'center', margin: open ? '0 8px' : '0' }}>
          {open ? <ChevronLeftIcon sx={{color: 'white'}}/> : <MenuIcon sx={{color: 'white'}}/>}
        </IconButton>
        <List sx={{ flexGrow: 1, flexDirection: 'column', justifyContent: 'center', alignItems: open ? 'flex-start' : 'center' }}>
        <ListItem
            button
            component={Link}
            to="/"
            className={clsx({ 'active': activePath === '/' })}
            aria-label="Home"
            onClick={() => onSelect('Home')}
            sx={{ width: '100%' }}
          >
              <ListItemIcon>
              <HouseRoundedIcon  sx={{color: 'white'}}/>
            </ListItemIcon>
            {open && <ListItemText primary="Home" sx={{color: 'white'}} />}
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/add-company"
            className={clsx({ 'active': activePath === '/add-company' })}
            aria-label="Add Company"
            onClick={() => onSelect('Add Company')}
            sx={{ width: '100%' }}
            >
                <ListItemIcon>
                <AddOutlinedIcon  sx={{color: 'white'}}/>
              </ListItemIcon>
              {open && <ListItemText primary="Add Company" sx={{color: 'white'}} />}
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/dashboard"
            className={clsx({ 'active': activePath === '/dashboard' })}
            aria-label="Dashboard"
            onClick={() => onSelect('Dashboard')}
            sx={{ width: '100%' }}
            >
                <ListItemIcon>
                <DashboardOutlinedIcon  sx={{color: 'white'}}/>
              </ListItemIcon>
              {open && <ListItemText primary="Dashboard" sx={{color: 'white'}} />}
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/user-creation"
            className={clsx({ 'active': activePath === '/user-creation' })}
            aria-label="User Creation"
            onClick={() => onSelect('User Creation')}
            sx={{ width: '100%' }}
            >
                <ListItemIcon>
                <GroupAddOutlinedIcon  sx={{color: 'white'}}/>
              </ListItemIcon>
              {open && <ListItemText primary="User Creation" sx={{color: 'white'}}/>}
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/asset-management"
            className={clsx({ 'active': activePath === '/asset-management' })}
            aria-label="Asset Management"
            onClick={() => onSelect('Asset Management')}
            sx={{ width: '100%' }}
            >
                <ListItemIcon>
                <VideogameAssetOutlinedIcon  sx={{color: 'white'}}/>
              </ListItemIcon>
              {open && <ListItemText primary="Asset Management" sx={{color: 'white'}}/>}
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/list-of-actions"
            className={clsx({ 'active': activePath === '/list-of-actions' })}
            aria-label="List of Actions"
            
            onClick={() => onSelect('List of Actions')}
            sx={{ width: '100%' }}
            >
                <ListItemIcon>
                <FactCheckOutlinedIcon  sx={{color: 'white'}}/>
              </ListItemIcon>
              {open && <ListItemText primary="List of Actions" sx={{color: 'white'}}/>}
          </ListItem>
          {/* <ListItem
            button
            component={Link}
            to="/alert-management"
            className={clsx({ 'active': activePath === '/alert-management' })}
            aria-label="Alert and Recommendations"
            onClick={() => onSelect('Alerts and Recommendations')}
            sx={{ width: '100%' }}
            >
                <ListItemIcon>
                <CampaignOutlinedIcon  sx={{color: 'white'}}/>
              </ListItemIcon>
              {open && <ListItemText primary="Alerts and Recommendations" sx={{color: 'white'}}/>}
          </ListItem> */}
          <ListItem
            button
            component={Link}
            to="/control-families"
            className={clsx({ 'active': activePath === '/control-families' })}
            aria-label="Control Families"
            onClick={() => onSelect('Control Families')}
            sx={{ width: '100%' }}
            >
                <ListItemIcon>
                <ControlPointDuplicateOutlinedIcon  sx={{color: 'white'}}/>
              </ListItemIcon>
              {open && <ListItemText primary="Control Families" sx={{color: 'white'}}/>}
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/controls"
            className={clsx({ 'active': activePath === '/controls' })}
            aria-label="Controls"
            onClick={() => onSelect('Controls')}
            sx={{ width: '100%' }}
            >
                <ListItemIcon>
                <ControlPointOutlinedIcon  sx={{color: 'white'}}/>
              </ListItemIcon>
              {open && <ListItemText primary="Controls" sx={{color: 'white'}}/>}
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/actions"
            className={clsx({ 'active': activePath === '/actions' })}
            aria-label="Actions"
            onClick={() => onSelect('Actions')}
            sx={{ width: '100%' }}
            >
                <ListItemIcon>
                <AttractionsOutlinedIcon  sx={{color: 'white'}}/>
              </ListItemIcon>
              {open && <ListItemText primary="Actions" sx={{color: 'white'}}/>}
          </ListItem>
      </List>
      </Box>
      </Drawer>
  );
};

export default Sidebar;
