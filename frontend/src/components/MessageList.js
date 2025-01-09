import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Typography,
  Box,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Collapse, // Ensure you import Collapse for the collapsible feature
} from '@mui/material';
import { CheckCircle, Delete } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Corrected import
import { getStatusById } from '../api/completionStatusApi';
import { getAssetNameById } from '../api/assetApi';
import { useNavigate } from 'react-router-dom';

const MessageList = ({
  messages = [],
  onMarkAsRead,
  onDeleteMessage,
  loading,
  error,
}) => {
  const navigate = useNavigate();
  const [assetNames, setAssetNames] = useState({});
  const [assetLoading, setAssetLoading] = useState(false);

  // Group messages by assetId
  const groupedMessages = messages.reduce((groups, message) => {
    const groupKey = message.completionStatusId?.assetId;
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(message);
    return groups;
  }, {});

  const fetchAssetName = async (assetId) => {
    if (!assetId || assetNames[assetId]) return;
    setAssetLoading(true);
    try {
      const assetData = await getAssetNameById(assetId);
      setAssetNames((prevNames) => ({
        ...prevNames,
        [assetId]: assetData.name,
      }));
    } catch (error) {
      console.error('Error fetching asset:', error);
      setAssetNames((prevNames) => ({
        ...prevNames,
        [assetId]: 'Error loading asset name',
      }));
    } finally {
      setAssetLoading(false);
    }
  };

  useEffect(() => {
    Object.values(groupedMessages).forEach((messageGroup) => {
      messageGroup.forEach((message) => {
        const assetId = message.completionStatusId?.assetId;
        if (assetId && !assetNames[assetId]) {
          fetchAssetName(assetId);
        }
      });
    });
  }, [groupedMessages, assetNames]);

  const handleLinkClick = async (completionStatusId) => {
    try {
      const data = await getStatusById(completionStatusId);
      console.log('Completion Status Data:', data);
      navigate('/Compliance-Operation');
    } catch (error) {
      console.error('Error fetching status by ID:', error);
    }
  };

  const [expanded, setExpanded] = useState(null); // State for controlling collapse

  const handleToggleCollapse = (groupKey) => {
    setExpanded((prevExpanded) =>
      prevExpanded === groupKey ? null : groupKey
    );
  };

  if (loading || assetLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', color: 'red', padding: 2 }}>
        <Typography variant='body2'>{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 4,
        maxWidth: '100%',
        height: '100%',
        overflowY: 'auto',
        backgroundColor: '#f9f9f9',
        border: '2px solid #ccc',
      }}
    >
      <Typography variant='h5' gutterBottom align='center' sx={{ mb: 1 }}>
        Messages
      </Typography>
      <List sx={{ padding: 0 }}>
        {Object.keys(groupedMessages).length === 0 ? (
          <ListItem>
            <ListItemText primary='No messages available' />
          </ListItem>
        ) : (
          Object.entries(groupedMessages).map(([groupKey, messages]) => (
            <Box key={groupKey} sx={{ mb: 2 }}>
              <Typography
                variant='h6'
                sx={{ mt: 2 }}
                onClick={() => handleToggleCollapse(groupKey)}
              >
                Group: {assetNames[groupKey] || groupKey}{' '}
                <IconButton size='small'>
                  <ExpandMoreIcon />
                </IconButton>
              </Typography>
              <Collapse in={expanded === groupKey}>
                {messages.map((message) => (
                  <React.Fragment key={message._id}>
                    <ListItem
                      sx={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        mb: 1,
                        p: 1.5,
                        backgroundColor: message.isRead ? '#e8f5e9' : '#fff3e0',
                        transition: 'background-color 0.3s',
                        '&:hover': {
                          backgroundColor: message.isRead
                            ? '#c8e6c9'
                            : '#ffe0b2',
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant='body1' fontWeight='bold'>
                            {message.message}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant='body2'>
                              Received at:{' '}
                              <strong>
                                {new Date(message.createdAt).toLocaleString()}
                              </strong>
                            </Typography>
                            <Typography variant='body2'>
                              Task assigned:{' '}
                              <a
                                href='#'
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleLinkClick(message.completionStatusId);
                                }}
                                style={{
                                  textDecoration: 'none',
                                  color: '#1976d2',
                                }}
                              >
                                <strong>Click here</strong>
                              </a>
                            </Typography>
                          </>
                        }
                      />
                      <ListItemSecondaryAction
                        sx={{ display: 'flex', gap: 0.5 }}
                      >
                        <Tooltip title='Mark as Read'>
                          <IconButton
                            onClick={() => onMarkAsRead(message._id)}
                            disabled={message.isRead}
                            color='success'
                            size='small'
                          >
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Delete'>
                          <IconButton
                            onClick={() => onDeleteMessage(message._id)}
                            color='error'
                            size='small'
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider sx={{ margin: '8px 0' }} />
                  </React.Fragment>
                ))}
              </Collapse>
            </Box>
          ))
        )}
      </List>
    </Paper>
  );
};

export default MessageList;
// import React, { useState, useEffect } from 'react';
// import {
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   Divider,
//   Typography,
//   Box,
//   Paper,
//   IconButton,
//   Tooltip,
//   CircularProgress,
//   Collapse,
// } from '@mui/material';
// import { CheckCircle, Delete } from '@mui/icons-material';
// import { getStatusById } from '../api/completionStatusApi';
// import { getAssetNameById } from '../api/assetApi'; // Import the getAssetNameById function
// import { useNavigate } from 'react-router-dom';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// const MessageList = ({
//   messages = [],
//   onMarkAsRead,
//   onDeleteMessage,
//   loading,
//   error,
// }) => {
//   const navigate = useNavigate();

//   // State to hold asset names and expanded states
//   const [assetNames, setAssetNames] = useState({});
//   const [expandedGroups, setExpandedGroups] = useState({});
//   const [assetLoading, setAssetLoading] = useState(false);

//   // Group messages by assetId
//   const groupedMessages = messages.reduce((groups, message) => {
//     const groupKey = message.completionStatusId?.assetId;
//     if (!groups[groupKey]) {
//       groups[groupKey] = [];
//     }
//     groups[groupKey].push(message);
//     return groups;
//   }, {});

//   // Function to fetch and store asset name
//   const fetchAssetName = async (assetId) => {
//     if (!assetId || assetNames[assetId]) return; // Skip if asset is already fetched

//     setAssetLoading(true);
//     try {
//       const assetData = await getAssetNameById(assetId); // Fetch asset name by ID
//       setAssetNames((prevNames) => ({
//         ...prevNames,
//         [assetId]: assetData.name, // Store asset name by ID
//       }));
//     } catch (error) {
//       console.error('Error fetching asset:', error);
//       setAssetNames((prevNames) => ({
//         ...prevNames,
//         [assetId]: 'Error loading asset name', // Display error message for the asset
//       }));
//     } finally {
//       setAssetLoading(false);
//     }
//   };

//   // Fetch asset names for all messages' assetIds
//   useEffect(() => {
//     // Loop through each group and fetch asset names
//     Object.values(groupedMessages).forEach((messageGroup) => {
//       messageGroup.forEach((message) => {
//         const assetId = message.completionStatusId?.assetId;
//         if (assetId && !assetNames[assetId]) {
//           fetchAssetName(assetId); // Fetch the asset name
//         }
//       });
//     });
//   }, [groupedMessages, assetNames]);

//   const handleLinkClick = async (completionStatusId) => {
//     try {
//       const data = await getStatusById(completionStatusId);
//       console.log('Completion Status Data:', data);
//       navigate('/Compliance-Operation');
//     } catch (error) {
//       console.error('Error fetching status by ID:', error);
//     }
//   };

//   const handleGroupToggle = (groupKey) => {
//     setExpandedGroups((prevExpanded) => ({
//       ...prevExpanded,
//       [groupKey]: !prevExpanded[groupKey],
//     }));
//   };

//   if (loading || assetLoading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ textAlign: 'center', color: 'red', padding: 2 }}>
//         <Typography variant='body2'>{error}</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Paper
//       elevation={3}
//       sx={{
//         p: 2,
//         borderRadius: 4,
//         maxWidth: '100%',
//         height: '100%',
//         overflowY: 'auto',
//         backgroundColor: '#f9f9f9',
//         border: '2px solid #ccc',
//       }}
//     >
//       <Typography variant='h5' gutterBottom align='center' sx={{ mb: 1 }}>
//         Messages
//       </Typography>
//       <List sx={{ padding: 0 }}>
//         {Object.keys(groupedMessages).length === 0 ? (
//           <ListItem>
//             <ListItemText primary='No messages available' />
//           </ListItem>
//         ) : (
//           Object.entries(groupedMessages).map(([groupKey, messages]) => {
//             const isExpanded = expandedGroups[groupKey] || false;
//             return (
//               <Box key={groupKey} sx={{ mb: 2 }}>
//                 <ListItem
//                   button
//                   onClick={() => handleGroupToggle(groupKey)}
//                   sx={{
//                     backgroundColor: '#f1f1f1',
//                     borderRadius: 4,
//                     p: 1.5,
//                     marginBottom: 1,
//                     '&:hover': { backgroundColor: '#e1e1e1' },
//                   }}
//                 >
//                   <ListItemText
//                     primary={
//                       <Typography
//                         variant='h6'
//                         sx={{ display: 'flex', alignItems: 'center' }}
//                       >
//                         {assetNames[groupKey] || groupKey}
//                         <Typography
//                           variant='body2'
//                           sx={{ ml: 1, color: 'grey' }}
//                         >
//                           ({messages.length}{' '}
//                           {messages.length > 1 ? 'messages' : 'message'})
//                         </Typography>
//                         {isExpanded ? (
//                           <ExpandLess sx={{ ml: 2 }} />
//                         ) : (
//                           <ExpandMore sx={{ ml: 2 }} />
//                         )}
//                       </Typography>
//                     }
//                   />
//                 </ListItem>
//                 <Collapse in={isExpanded} timeout='auto' unmountOnExit>
//                   {messages.map((message) => (
//                     <React.Fragment key={message._id}>
//                       <ListItem
//                         sx={{
//                           border: '1px solid #ddd',
//                           borderRadius: '8px',
//                           mb: 1,
//                           p: 1.5,
//                           backgroundColor: message.isRead
//                             ? '#e8f5e9'
//                             : '#fff3e0',
//                           transition: 'background-color 0.3s',
//                           '&:hover': {
//                             backgroundColor: message.isRead
//                               ? '#c8e6c9'
//                               : '#ffe0b2',
//                           },
//                         }}
//                       >
//                         <ListItemText
//                           primary={
//                             <Typography variant='body1' fontWeight='bold'>
//                               {message.message}
//                             </Typography>
//                           }
//                           secondary={
//                             <>
//                               <Typography variant='body2'>
//                                 Received at:{' '}
//                                 <strong>
//                                   {new Date(message.createdAt).toLocaleString()}
//                                 </strong>
//                               </Typography>
//                               <Typography variant='body2'>
//                                 Task assigned:{' '}
//                                 <a
//                                   href='#'
//                                   onClick={(e) => {
//                                     e.preventDefault();
//                                     handleLinkClick(message.completionStatusId);
//                                   }}
//                                   style={{
//                                     textDecoration: 'none',
//                                     color: '#1976d2',
//                                   }}
//                                 >
//                                   <strong>Click here</strong>
//                                 </a>
//                               </Typography>
//                             </>
//                           }
//                         />
//                         <ListItemSecondaryAction
//                           sx={{ display: 'flex', gap: 0.5 }}
//                         >
//                           <Tooltip title='Mark as Read'>
//                             <IconButton
//                               onClick={() => onMarkAsRead(message._id)}
//                               disabled={message.isRead}
//                               color='success'
//                               size='small'
//                             >
//                               <CheckCircle />
//                             </IconButton>
//                           </Tooltip>
//                           <Tooltip title='Delete'>
//                             <IconButton
//                               onClick={() => onDeleteMessage(message._id)}
//                               color='error'
//                               size='small'
//                             >
//                               <Delete />
//                             </IconButton>
//                           </Tooltip>
//                         </ListItemSecondaryAction>
//                       </ListItem>
//                       <Divider sx={{ margin: '8px 0' }} />
//                     </React.Fragment>
//                   ))}
//                 </Collapse>
//               </Box>
//             );
//           })
//         )}
//       </List>
//     </Paper>
//   );
// };

// export default MessageList;

// // import React, { useState, useEffect } from 'react';
// // import {
// //   List,
// //   ListItem,
// //   ListItemText,
// //   ListItemSecondaryAction,
// //   Divider,
// //   Typography,
// //   Box,
// //   Paper,
// //   IconButton,
// //   Tooltip,
// //   CircularProgress,
// // } from '@mui/material';
// // import { CheckCircle, Delete } from '@mui/icons-material';
// // import { getStatusById } from '../api/completionStatusApi';
// // import { getAssetNameById } from '../api/assetApi'; // Import the getAssetNameById function
// // import { useNavigate } from 'react-router-dom';

// // const MessageList = ({
// //   messages = [],
// //   onMarkAsRead,
// //   onDeleteMessage,
// //   loading,
// //   error,
// // }) => {
// //   const navigate = useNavigate();

// //   // State to hold asset names
// //   const [assetNames, setAssetNames] = useState({});
// //   const [assetLoading, setAssetLoading] = useState(false);

// //   // Group messages by assetId
// //   const groupedMessages = messages.reduce((groups, message) => {
// //     const groupKey = message.completionStatusId?.assetId;
// //     if (!groups[groupKey]) {
// //       groups[groupKey] = [];
// //     }
// //     groups[groupKey].push(message);
// //     return groups;
// //   }, {});

// //   // Function to fetch and store asset name
// //   const fetchAssetName = async (assetId) => {
// //     if (!assetId || assetNames[assetId]) return; // Skip if asset is already fetched

// //     setAssetLoading(true);
// //     try {
// //       const assetData = await getAssetNameById(assetId); // Fetch asset name by ID
// //       setAssetNames((prevNames) => ({
// //         ...prevNames,
// //         [assetId]: assetData.name, // Store asset name by ID
// //       }));
// //     } catch (error) {
// //       console.error('Error fetching asset:', error);
// //       setAssetNames((prevNames) => ({
// //         ...prevNames,
// //         [assetId]: 'Error loading asset name', // Display error message for the asset
// //       }));
// //     } finally {
// //       setAssetLoading(false);
// //     }
// //   };

// //   // Fetch asset names for all messages' assetIds
// //   useEffect(() => {
// //     // Loop through each group and fetch asset names
// //     Object.values(groupedMessages).forEach((messageGroup) => {
// //       messageGroup.forEach((message) => {
// //         const assetId = message.completionStatusId?.assetId;
// //         if (assetId && !assetNames[assetId]) {
// //           fetchAssetName(assetId); // Fetch the asset name
// //         }
// //       });
// //     });
// //   }, [groupedMessages, assetNames]);

// //   const handleLinkClick = async (completionStatusId) => {
// //     try {
// //       const data = await getStatusById(completionStatusId);
// //       console.log('Completion Status Data:', data);
// //       navigate('/Compliance-Operation');
// //     } catch (error) {
// //       console.error('Error fetching status by ID:', error);
// //     }
// //   };

// //   if (loading || assetLoading) {
// //     return (
// //       <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
// //         <CircularProgress />
// //       </Box>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <Box sx={{ textAlign: 'center', color: 'red', padding: 2 }}>
// //         <Typography variant='body2'>{error}</Typography>
// //       </Box>
// //     );
// //   }

// //   return (
// //     <Paper
// //       elevation={3}
// //       sx={{
// //         p: 2,
// //         borderRadius: 4,
// //         maxWidth: '100%',
// //         height: '100%',
// //         overflowY: 'auto',
// //         backgroundColor: '#f9f9f9',
// //         border: '2px solid #ccc',
// //       }}
// //     >
// //       <Typography variant='h5' gutterBottom align='center' sx={{ mb: 1 }}>
// //         Messages
// //       </Typography>
// //       <List sx={{ padding: 0 }}>
// //         {Object.keys(groupedMessages).length === 0 ? (
// //           <ListItem>
// //             <ListItemText primary='No messages available' />
// //           </ListItem>
// //         ) : (
// //           Object.entries(groupedMessages).map(([groupKey, messages]) => (
// //             <Box key={groupKey} sx={{ mb: 2 }}>
// //               <Typography variant='h6' sx={{ mt: 2 }}>
// //                 Group: {assetNames[groupKey] || groupKey}{' '}
// //                 {/* Display asset name, or asset ID if name is not available */}
// //               </Typography>
// //               {messages.map((message) => (
// //                 <React.Fragment key={message._id}>
// //                   <ListItem
// //                     sx={{
// //                       border: '1px solid #ddd',
// //                       borderRadius: '8px',
// //                       mb: 1,
// //                       p: 1.5,
// //                       backgroundColor: message.isRead ? '#e8f5e9' : '#fff3e0',
// //                       transition: 'background-color 0.3s',
// //                       '&:hover': {
// //                         backgroundColor: message.isRead ? '#c8e6c9' : '#ffe0b2',
// //                       },
// //                     }}
// //                   >
// //                     <ListItemText
// //                       primary={
// //                         <Typography variant='body1' fontWeight='bold'>
// //                           {message.message}
// //                         </Typography>
// //                       }
// //                       secondary={
// //                         <>
// //                           <Typography variant='body2'>
// //                             Received at:{' '}
// //                             <strong>
// //                               {new Date(message.createdAt).toLocaleString()}
// //                             </strong>
// //                           </Typography>
// //                           <Typography variant='body2'>
// //                             Task assigned:{' '}
// //                             <a
// //                               href='#'
// //                               onClick={(e) => {
// //                                 e.preventDefault();
// //                                 handleLinkClick(message.completionStatusId);
// //                               }}
// //                               style={{
// //                                 textDecoration: 'none',
// //                                 color: '#1976d2',
// //                               }}
// //                             >
// //                               <strong>Click here</strong>
// //                             </a>
// //                           </Typography>
// //                         </>
// //                       }
// //                     />
// //                     <ListItemSecondaryAction sx={{ display: 'flex', gap: 0.5 }}>
// //                       <Tooltip title='Mark as Read'>
// //                         <IconButton
// //                           onClick={() => onMarkAsRead(message._id)}
// //                           disabled={message.isRead}
// //                           color='success'
// //                           size='small'
// //                         >
// //                           <CheckCircle />
// //                         </IconButton>
// //                       </Tooltip>
// //                       <Tooltip title='Delete'>
// //                         <IconButton
// //                           onClick={() => onDeleteMessage(message._id)}
// //                           color='error'
// //                           size='small'
// //                         >
// //                           <Delete />
// //                         </IconButton>
// //                       </Tooltip>
// //                     </ListItemSecondaryAction>
// //                   </ListItem>
// //                   <Divider sx={{ margin: '8px 0' }} />
// //                 </React.Fragment>
// //               ))}
// //             </Box>
// //           ))
// //         )}
// //       </List>
// //     </Paper>
// //   );
// // };

// // export default MessageList;

// // // import React, { useState, useEffect } from 'react';
// // // import {
// // //   List,
// // //   ListItem,
// // //   ListItemText,
// // //   ListItemSecondaryAction,
// // //   Divider,
// // //   Typography,
// // //   Box,
// // //   Paper,
// // //   IconButton,
// // //   Tooltip,
// // //   CircularProgress,
// // // } from '@mui/material';
// // // import { CheckCircle, Delete } from '@mui/icons-material';
// // // import { getStatusById } from '../api/completionStatusApi';
// // // import { getAssetNameById } from '../api/assetApi'; // Import the getAssetNameById function
// // // import { useNavigate } from 'react-router-dom';

// // // const MessageList = ({
// // //   messages = [],
// // //   onMarkAsRead,
// // //   onDeleteMessage,
// // //   loading,
// // //   error,
// // // }) => {
// // //   const navigate = useNavigate();

// // //   // State to hold asset names
// // //   const [assetNames, setAssetNames] = useState({});

// // //   // Group messages by assetId
// // //   const groupedMessages = messages.reduce((groups, message) => {
// // //     const groupKey = message.completionStatusId?.assetId;
// // //     if (!groups[groupKey]) {
// // //       groups[groupKey] = [];
// // //     }
// // //     groups[groupKey].push(message);
// // //     return groups;
// // //   }, {});

// // //   // Function to fetch and store asset name
// // //   const fetchAssetName = async (assetId) => {
// // //     if (!assetId) return;

// // //     try {
// // //       const assetData = await getAssetNameById(assetId); // Fetch asset name by ID
// // //       setAssetNames((prevNames) => ({
// // //         ...prevNames,
// // //         [assetId]: assetData.name, // Store asset name by ID
// // //       }));
// // //     } catch (error) {
// // //       console.error('Error fetching asset:', error);
// // //     }
// // //   };

// // //   // Fetch asset names for all messages' assetIds
// // //   useEffect(() => {
// // //     Object.values(groupedMessages).forEach((messageGroup) => {
// // //       messageGroup.forEach((message) => {
// // //         const assetId = message.completionStatusId?.assetId;
// // //         if (assetId && !assetNames[assetId]) {
// // //           fetchAssetName(assetId);
// // //         }
// // //       });
// // //     });
// // //   }, [groupedMessages, assetNames]);

// // //   const handleLinkClick = async (completionStatusId) => {
// // //     try {
// // //       const data = await getStatusById(completionStatusId);
// // //       console.log('Completion Status Data:', data);
// // //       navigate('/Compliance-Operation');
// // //     } catch (error) {
// // //       console.error('Error fetching status by ID:', error);
// // //     }
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
// // //         <CircularProgress />
// // //       </Box>
// // //     );
// // //   }

// // //   if (error) {
// // //     return (
// // //       <Box sx={{ textAlign: 'center', color: 'red', padding: 2 }}>
// // //         <Typography variant='body2'>{error}</Typography>
// // //       </Box>
// // //     );
// // //   }

// // //   return (
// // //     <Paper
// // //       elevation={3}
// // //       sx={{
// // //         p: 2,
// // //         borderRadius: 4,
// // //         maxWidth: '100%',
// // //         height: '100%',
// // //         overflowY: 'auto',
// // //         backgroundColor: '#f9f9f9',
// // //         border: '2px solid #ccc',
// // //       }}
// // //     >
// // //       <Typography variant='h5' gutterBottom align='center' sx={{ mb: 1 }}>
// // //         Messages
// // //       </Typography>
// // //       <List sx={{ padding: 0 }}>
// // //         {Object.keys(groupedMessages).length === 0 ? (
// // //           <ListItem>
// // //             <ListItemText primary='No messages available' />
// // //           </ListItem>
// // //         ) : (
// // //           Object.entries(groupedMessages).map(([groupKey, messages]) => (
// // //             <Box key={groupKey} sx={{ mb: 2 }}>
// // //               <Typography variant='h6' sx={{ mt: 2 }}>
// // //                 Group: {assetNames[groupKey] || groupKey}{' '}
// // //                 {/* Display asset name */}
// // //               </Typography>
// // //               {messages.map((message) => (
// // //                 <React.Fragment key={message._id}>
// // //                   <ListItem
// // //                     sx={{
// // //                       border: '1px solid #ddd',
// // //                       borderRadius: '8px',
// // //                       mb: 1,
// // //                       p: 1.5,
// // //                       backgroundColor: message.isRead ? '#e8f5e9' : '#fff3e0',
// // //                       transition: 'background-color 0.3s',
// // //                       '&:hover': {
// // //                         backgroundColor: message.isRead ? '#c8e6c9' : '#ffe0b2',
// // //                       },
// // //                     }}
// // //                   >
// // //                     <ListItemText
// // //                       primary={
// // //                         <Typography variant='body1' fontWeight='bold'>
// // //                           {message.message}
// // //                         </Typography>
// // //                       }
// // //                       secondary={
// // //                         <>
// // //                           <Typography variant='body2'>
// // //                             Received at:{' '}
// // //                             <strong>
// // //                               {new Date(message.createdAt).toLocaleString()}
// // //                             </strong>
// // //                           </Typography>
// // //                           <Typography variant='body2'>
// // //                             Task assigned:{' '}
// // //                             <a
// // //                               href='#'
// // //                               onClick={(e) => {
// // //                                 e.preventDefault();
// // //                                 handleLinkClick(message.completionStatusId);
// // //                               }}
// // //                               style={{
// // //                                 textDecoration: 'none',
// // //                                 color: '#1976d2',
// // //                               }}
// // //                             >
// // //                               <strong>Click here</strong>
// // //                             </a>
// // //                           </Typography>
// // //                         </>
// // //                       }
// // //                     />
// // //                     <ListItemSecondaryAction sx={{ display: 'flex', gap: 0.5 }}>
// // //                       <Tooltip title='Mark as Read'>
// // //                         <IconButton
// // //                           onClick={() => onMarkAsRead(message._id)}
// // //                           disabled={message.isRead}
// // //                           color='success'
// // //                           size='small'
// // //                         >
// // //                           <CheckCircle />
// // //                         </IconButton>
// // //                       </Tooltip>
// // //                       <Tooltip title='Delete'>
// // //                         <IconButton
// // //                           onClick={() => onDeleteMessage(message._id)}
// // //                           color='error'
// // //                           size='small'
// // //                         >
// // //                           <Delete />
// // //                         </IconButton>
// // //                       </Tooltip>
// // //                     </ListItemSecondaryAction>
// // //                   </ListItem>
// // //                   <Divider sx={{ margin: '8px 0' }} />
// // //                 </React.Fragment>
// // //               ))}
// // //             </Box>
// // //           ))
// // //         )}
// // //       </List>
// // //     </Paper>
// // //   );
// // // };

// // // export default MessageList;

// // // import React from 'react';
// // // import {
// // //   List,
// // //   ListItem,
// // //   ListItemText,
// // //   ListItemSecondaryAction,
// // //   Divider,
// // //   Typography,
// // //   Box,
// // //   Paper,
// // //   IconButton,
// // //   Tooltip,
// // //   CircularProgress,
// // // } from '@mui/material';
// // // import { CheckCircle, Delete } from '@mui/icons-material';
// // // import { getStatusById } from '../api/completionStatusApi';
// // // import { useNavigate } from 'react-router-dom';

// // // const MessageList = ({
// // //   messages = [],
// // //   onMarkAsRead,
// // //   onDeleteMessage,
// // //   loading,
// // //   error,
// // // }) => {
// // //   const navigate = useNavigate();

// // //   // Group messages by assetId
// // //   const groupedMessages = messages.reduce((groups, message) => {
// // //     const groupKey = message.completionStatusId?.assetId;
// // //     if (!groups[groupKey]) {
// // //       groups[groupKey] = [];
// // //     }
// // //     groups[groupKey].push(message);
// // //     return groups;
// // //   }, {});

// // //   const handleLinkClick = async (completionStatusId) => {
// // //     try {
// // //       const data = await getStatusById(completionStatusId);
// // //       console.log('Completion Status Data:', data);
// // //       navigate('/Compliance-Operation');
// // //     } catch (error) {
// // //       console.error('Error fetching status by ID:', error);
// // //     }
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
// // //         <CircularProgress />
// // //       </Box>
// // //     );
// // //   }

// // //   if (error) {
// // //     return (
// // //       <Box sx={{ textAlign: 'center', color: 'red', padding: 2 }}>
// // //         <Typography variant='body2'>{error}</Typography>
// // //       </Box>
// // //     );
// // //   }

// // //   return (
// // //     <Paper
// // //       elevation={3}
// // //       sx={{
// // //         p: 2,
// // //         borderRadius: 4,
// // //         maxWidth: '100%',
// // //         height: '100%',
// // //         overflowY: 'auto',
// // //         backgroundColor: '#f9f9f9',
// // //         border: '2px solid #ccc',
// // //       }}
// // //     >
// // //       <Typography variant='h5' gutterBottom align='center' sx={{ mb: 1 }}>
// // //         Messages
// // //       </Typography>
// // //       <List sx={{ padding: 0 }}>
// // //         {Object.keys(groupedMessages).length === 0 ? (
// // //           <ListItem>
// // //             <ListItemText primary='No messages available' />
// // //           </ListItem>
// // //         ) : (
// // //           Object.entries(groupedMessages).map(([groupKey, messages]) => (
// // //             <Box key={groupKey} sx={{ mb: 2 }}>
// // //               <Typography variant='h6' sx={{ mt: 2 }}>
// // //                 Group: {groupKey}
// // //               </Typography>
// // //               {messages.map((message) => (
// // //                 <React.Fragment key={message._id}>
// // //                   <ListItem
// // //                     sx={{
// // //                       border: '1px solid #ddd',
// // //                       borderRadius: '8px',
// // //                       mb: 1,
// // //                       p: 1.5,
// // //                       backgroundColor: message.isRead ? '#e8f5e9' : '#fff3e0',
// // //                       transition: 'background-color 0.3s',
// // //                       '&:hover': {
// // //                         backgroundColor: message.isRead ? '#c8e6c9' : '#ffe0b2',
// // //                       },
// // //                     }}
// // //                   >
// // //                     <ListItemText
// // //                       primary={
// // //                         <Typography variant='body1' fontWeight='bold'>
// // //                           {message.message}
// // //                         </Typography>
// // //                       }
// // //                       secondary={
// // //                         <>
// // //                           <Typography variant='body2'>
// // //                             Received at:{' '}
// // //                             <strong>
// // //                               {new Date(message.createdAt).toLocaleString()}
// // //                             </strong>
// // //                           </Typography>
// // //                           <Typography variant='body2'>
// // //                             Task assigned:{' '}
// // //                             <a
// // //                               href='#'
// // //                               onClick={(e) => {
// // //                                 e.preventDefault();
// // //                                 handleLinkClick(message.completionStatusId);
// // //                               }}
// // //                               style={{
// // //                                 textDecoration: 'none',
// // //                                 color: '#1976d2',
// // //                               }}
// // //                             >
// // //                               <strong>Click here</strong>
// // //                             </a>
// // //                           </Typography>
// // //                         </>
// // //                       }
// // //                     />
// // //                     <ListItemSecondaryAction sx={{ display: 'flex', gap: 0.5 }}>
// // //                       <Tooltip title='Mark as Read'>
// // //                         <IconButton
// // //                           onClick={() => onMarkAsRead(message._id)}
// // //                           disabled={message.isRead}
// // //                           color='success'
// // //                           size='small'
// // //                         >
// // //                           <CheckCircle />
// // //                         </IconButton>
// // //                       </Tooltip>
// // //                       <Tooltip title='Delete'>
// // //                         <IconButton
// // //                           onClick={() => onDeleteMessage(message._id)}
// // //                           color='error'
// // //                           size='small'
// // //                         >
// // //                           <Delete />
// // //                         </IconButton>
// // //                       </Tooltip>
// // //                     </ListItemSecondaryAction>
// // //                   </ListItem>
// // //                   <Divider sx={{ margin: '8px 0' }} />
// // //                 </React.Fragment>
// // //               ))}
// // //             </Box>
// // //           ))
// // //         )}
// // //       </List>
// // //     </Paper>
// // //   );
// // // };

// // // export default MessageList;

// // // // import React from 'react';
// // // // import {
// // // //   List,
// // // //   ListItem,
// // // //   ListItemText,
// // // //   ListItemSecondaryAction,
// // // //   Divider,
// // // //   Typography,
// // // //   Box,
// // // //   Paper,
// // // //   IconButton,
// // // //   Tooltip,
// // // //   CircularProgress,
// // // // } from '@mui/material';
// // // // import { CheckCircle, Delete } from '@mui/icons-material';
// // // // import { getStatusById } from '../api/completionStatusApi';
// // // // import { useNavigate } from 'react-router-dom';

// // // // const MessageList = ({
// // // //   messages = [],
// // // //   onMarkAsRead,
// // // //   onDeleteMessage,
// // // //   loading,
// // // //   error,
// // // // }) => {
// // // //   const navigate = useNavigate();
// // // //   const filteredMessages = messages.filter(
// // // //     (message) => !message.isDeleted && message.status !== 'deleted'
// // // //   );

// // // //   const handleLinkClick = async (completionStatusId) => {
// // // //     try {
// // // //       const data = await getStatusById(completionStatusId);
// // // //       console.log('Completion Status Data:', data);
// // // //       navigate('/Compliance-Operation');
// // // //     } catch (error) {
// // // //       console.error('Error fetching status by ID:', error);
// // // //     }
// // // //   };

// // // //   if (loading) {
// // // //     return (
// // // //       <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
// // // //         <CircularProgress />
// // // //       </Box>
// // // //     );
// // // //   }

// // // //   if (error) {
// // // //     return (
// // // //       <Box sx={{ textAlign: 'center', color: 'red', padding: 2 }}>
// // // //         <Typography variant='body2'>{error}</Typography>
// // // //       </Box>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <Paper
// // // //       elevation={3}
// // // //       sx={{
// // // //         p: 2,
// // // //         borderRadius: 4,
// // // //         maxWidth: '100%',
// // // //         height: '100%',
// // // //         overflowY: 'auto',
// // // //         backgroundColor: '#f9f9f9',
// // // //         border: '2px solid #ccc',
// // // //       }}
// // // //     >
// // // //       <Typography variant='h5' gutterBottom align='center' sx={{ mb: 1 }}>
// // // //         Messages
// // // //       </Typography>
// // // //       <List sx={{ padding: 0 }}>
// // // //         {filteredMessages.length === 0 ? (
// // // //           <ListItem>
// // // //             <ListItemText primary='No messages available' />
// // // //           </ListItem>
// // // //         ) : (
// // // //           filteredMessages.map((message) => (
// // // //             <React.Fragment key={message._id}>
// // // //               <ListItem
// // // //                 sx={{
// // // //                   border: '1px solid #ddd',
// // // //                   borderRadius: '8px',
// // // //                   mb: 1,
// // // //                   p: 1.5,
// // // //                   backgroundColor: message.isRead ? '#e8f5e9' : '#fff3e0',
// // // //                   transition: 'background-color 0.3s',
// // // //                   '&:hover': {
// // // //                     backgroundColor: message.isRead ? '#c8e6c9' : '#ffe0b2',
// // // //                   },
// // // //                 }}
// // // //               >
// // // //                 <ListItemText
// // // //                   primary={
// // // //                     <Typography variant='body1' fontWeight='bold'>
// // // //                       {message.message}
// // // //                     </Typography>
// // // //                   }
// // // //                   secondary={
// // // //                     <>
// // // //                       <Typography variant='body2'>
// // // //                         Received at:{' '}
// // // //                         <strong>
// // // //                           {new Date(message.createdAt).toLocaleString()}
// // // //                         </strong>
// // // //                       </Typography>
// // // //                       <Typography variant='body2'>
// // // //                         Task assigned:{' '}
// // // //                         <a
// // // //                           href='#'
// // // //                           onClick={(e) => {
// // // //                             e.preventDefault();
// // // //                             handleLinkClick(message.completionStatusId);
// // // //                           }}
// // // //                           style={{ textDecoration: 'none', color: '#1976d2' }}
// // // //                         >
// // // //                           <strong>Click here</strong>
// // // //                         </a>
// // // //                       </Typography>
// // // //                     </>
// // // //                   }
// // // //                 />
// // // //                 <ListItemSecondaryAction sx={{ display: 'flex', gap: 0.5 }}>
// // // //                   <Tooltip title='Mark as Read'>
// // // //                     <IconButton
// // // //                       onClick={() => onMarkAsRead(message._id)}
// // // //                       disabled={message.isRead}
// // // //                       color='success'
// // // //                       size='small'
// // // //                     >
// // // //                       <CheckCircle />
// // // //                     </IconButton>
// // // //                   </Tooltip>
// // // //                   <Tooltip title='Delete'>
// // // //                     <IconButton
// // // //                       onClick={() => onDeleteMessage(message._id)}
// // // //                       color='error'
// // // //                       size='small'
// // // //                     >
// // // //                       <Delete />
// // // //                     </IconButton>
// // // //                   </Tooltip>
// // // //                 </ListItemSecondaryAction>
// // // //               </ListItem>
// // // //               <Divider sx={{ margin: '8px 0' }} />
// // // //             </React.Fragment>
// // // //           ))
// // // //         )}
// // // //       </List>
// // // //     </Paper>
// // // //   );
// // // // };

// // // // export default MessageList;

// // // // // import React from 'react';
// // // // // import {
// // // // //   List,
// // // // //   ListItem,
// // // // //   ListItemText,
// // // // //   ListItemSecondaryAction,
// // // // //   Divider,
// // // // //   Typography,
// // // // //   Box,
// // // // //   Paper,
// // // // //   IconButton,
// // // // //   Tooltip,
// // // // //   CircularProgress,
// // // // // } from '@mui/material';
// // // // // import { CheckCircle, Delete } from '@mui/icons-material';
// // // // // import { getStatusById } from '../api/completionStatusApi';
// // // // // import { useNavigate } from 'react-router-dom'; // Import useNavigate

// // // // // const MessageList = ({
// // // // //   messages = [],
// // // // //   onMarkAsRead,
// // // // //   onDeleteMessage,
// // // // //   loading, // Add loading state
// // // // //   error, // Add error state
// // // // // }) => {
// // // // //   const navigate = useNavigate(); // Initialize useNavigate
// // // // //   const filteredMessages = messages.filter(
// // // // //     (message) => !message.isDeleted && message.status !== 'deleted'
// // // // //   );

// // // // //   // Function to handle link click
// // // // //   const handleLinkClick = async (completionStatusId) => {
// // // // //     try {
// // // // //       const data = await getStatusById(completionStatusId);
// // // // //       console.log('Completion Status Data:', data); // You can do whatever you want with the data
// // // // //       navigate('/Compliance-Operation'); // Change this to your desired route
// // // // //     } catch (error) {
// // // // //       console.error('Error fetching status by ID:', error);
// // // // //     }
// // // // //   };

// // // // //   // If loading, show a spinner
// // // // //   if (loading) {
// // // // //     return (
// // // // //       <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
// // // // //         <CircularProgress />
// // // // //       </Box>
// // // // //     );
// // // // //   }

// // // // //   // If there's an error, display an error message
// // // // //   if (error) {
// // // // //     return (
// // // // //       <Box sx={{ textAlign: 'center', color: 'red', padding: 2 }}>
// // // // //         <Typography variant='body2'>{error}</Typography>
// // // // //       </Box>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <Paper
// // // // //       elevation={3}
// // // // //       sx={{
// // // // //         p: 2,
// // // // //         borderRadius: 2,
// // // // //         maxWidth: '100%',
// // // // //         height: '100%', // Full height of the side panel
// // // // //         overflowY: 'auto', // Allow scrolling when there are many notifications
// // // // //       }}
// // // // //     >
// // // // //       <Typography variant='h5' gutterBottom align='center'>
// // // // //         Messages
// // // // //       </Typography>
// // // // //       <List>
// // // // //         {filteredMessages.length === 0 ? (
// // // // //           <ListItem>
// // // // //             <ListItemText primary='No messages available' />
// // // // //           </ListItem>
// // // // //         ) : (
// // // // //           filteredMessages.map((message) => (
// // // // //             <React.Fragment key={message._id}>
// // // // //               <ListItem
// // // // //                 sx={{
// // // // //                   backgroundColor: message.isRead ? '#e8f5e9' : '#ffe0b2',
// // // // //                   borderRadius: '8px',
// // // // //                   mb: 1,
// // // // //                 }}
// // // // //               >
// // // // //                 <ListItemText
// // // // //                   primary={
// // // // //                     <Typography variant='body1' fontWeight='bold'>
// // // // //                       {message.message}
// // // // //                     </Typography>
// // // // //                   }
// // // // //                   secondary={
// // // // //                     <>
// // // // //                       <Typography variant='body2'>
// // // // //                         Received at:{' '}
// // // // //                         <strong>
// // // // //                           {new Date(message.createdAt).toLocaleString()}
// // // // //                         </strong>
// // // // //                       </Typography>
// // // // //                       <Typography variant='body2'>
// // // // //                         Task assigned:{' '}
// // // // //                         <a
// // // // //                           href='#'
// // // // //                           onClick={(e) => {
// // // // //                             e.preventDefault(); // Prevent default link behavior
// // // // //                             handleLinkClick(message.completionStatusId); // Call the function
// // // // //                           }}
// // // // //                         >
// // // // //                           <strong>Click here</strong>
// // // // //                         </a>
// // // // //                       </Typography>
// // // // //                     </>
// // // // //                   }
// // // // //                 />
// // // // //                 <ListItemSecondaryAction sx={{ top: '70%' }}>
// // // // //                   <Tooltip title='Mark as Read'>
// // // // //                     <IconButton
// // // // //                       onClick={() => onMarkAsRead(message._id)} // Use the passed function
// // // // //                       disabled={message.isRead}
// // // // //                       color='success'
// // // // //                     >
// // // // //                       <CheckCircle />
// // // // //                     </IconButton>
// // // // //                   </Tooltip>
// // // // //                   <Tooltip title='Delete'>
// // // // //                     <IconButton
// // // // //                       onClick={() => onDeleteMessage(message._id)} // Use the passed function
// // // // //                       color='error'
// // // // //                     >
// // // // //                       <Delete />
// // // // //                     </IconButton>
// // // // //                   </Tooltip>
// // // // //                 </ListItemSecondaryAction>
// // // // //               </ListItem>
// // // // //               <Divider />
// // // // //             </React.Fragment>
// // // // //           ))
// // // // //         )}
// // // // //       </List>
// // // // //     </Paper>
// // // // //   );
// // // // // };

// // // // // export default MessageList;

// // // // // // import React from 'react';
// // // // // // import {
// // // // // //   List,
// // // // // //   ListItem,
// // // // // //   ListItemText,
// // // // // //   ListItemSecondaryAction,
// // // // // //   Divider,
// // // // // //   Typography,
// // // // // //   Box,
// // // // // //   Paper,
// // // // // //   IconButton,
// // // // // //   Tooltip,
// // // // // // } from '@mui/material';
// // // // // // import { CheckCircle, Delete } from '@mui/icons-material';
// // // // // // import { getStatusById } from '../api/completionStatusApi';

// // // // // // import { useNavigate } from 'react-router-dom'; // Import useNavigate

// // // // // // const MessageList = ({ messages = [], onMarkAsRead, onDeleteMessage }) => {
// // // // // //   // Filter out messages that are marked as deleted or have a status of "deleted"

// // // // // //   const navigate = useNavigate(); // Initialize useNavigate
// // // // // //   const filteredMessages = messages.filter(
// // // // // //     (message) => !message.isDeleted && message.status !== 'deleted'
// // // // // //   );

// // // // // //   // Function to handle link click
// // // // // //   const handleLinkClick = async (completionStatusId) => {
// // // // // //     try {
// // // // // //       const data = await getStatusById(completionStatusId);
// // // // // //       console.log('Completion Status Data:', data); // You can do whatever you want with the data
// // // // // //       navigate('/Compliance-Operation'); // Change this to your desired route
// // // // // //     } catch (error) {
// // // // // //       console.error('Error fetching status by ID:', error);
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <Paper
// // // // // //       elevation={3}
// // // // // //       sx={{ p: 2, borderRadius: 2, maxWidth: 600, margin: 'auto' }}
// // // // // //     >
// // // // // //       <Typography variant='h5' gutterBottom align='center'>
// // // // // //         Messages
// // // // // //       </Typography>
// // // // // //       <List>
// // // // // //         {filteredMessages.length === 0 ? (
// // // // // //           <ListItem>
// // // // // //             <ListItemText primary='No messages available' />
// // // // // //           </ListItem>
// // // // // //         ) : (
// // // // // //           filteredMessages.map((message) => (
// // // // // //             <React.Fragment key={message._id}>
// // // // // //               <ListItem
// // // // // //                 sx={{
// // // // // //                   backgroundColor: message.isRead ? '#e8f5e9' : '#ffe0b2',
// // // // // //                   borderRadius: '8px',
// // // // // //                   mb: 1,
// // // // // //                 }}
// // // // // //               >
// // // // // //                 <Box sx={{ flexGrow: 1 }}>
// // // // // //                   <ListItemText
// // // // // //                     primary={
// // // // // //                       <Typography variant='body1' fontWeight='bold'>
// // // // // //                         {message.message}
// // // // // //                       </Typography>
// // // // // //                     }
// // // // // //                     secondary={
// // // // // //                       <>
// // // // // //                         <Typography variant='body2'>
// // // // // //                           Received at:{' '}
// // // // // //                           <strong>
// // // // // //                             {new Date(message.createdAt).toLocaleString()}
// // // // // //                           </strong>
// // // // // //                         </Typography>
// // // // // //                         <Typography variant='body2'>
// // // // // //                           Task assigned:{' '}
// // // // // //                           <a
// // // // // //                             href='#'
// // // // // //                             onClick={(e) => {
// // // // // //                               e.preventDefault(); // Prevent default link behavior
// // // // // //                               handleLinkClick(message.completionStatusId); // Call the function
// // // // // //                             }}
// // // // // //                           >
// // // // // //                             <strong>Click here</strong>
// // // // // //                           </a>
// // // // // //                         </Typography>
// // // // // //                       </>
// // // // // //                     }
// // // // // //                   />
// // // // // //                 </Box>
// // // // // //                 <ListItemSecondaryAction sx={{ top: '70%' }}>
// // // // // //                   <Tooltip title='Mark as Read'>
// // // // // //                     <IconButton
// // // // // //                       onClick={() => onMarkAsRead(message._id)} // Use the passed function
// // // // // //                       disabled={message.isRead}
// // // // // //                       color='success'
// // // // // //                     >
// // // // // //                       <CheckCircle />
// // // // // //                     </IconButton>
// // // // // //                   </Tooltip>
// // // // // //                   <Tooltip title='Delete'>
// // // // // //                     <IconButton
// // // // // //                       onClick={() => onDeleteMessage(message._id)} // Use the passed function
// // // // // //                       color='error'
// // // // // //                     >
// // // // // //                       <Delete />
// // // // // //                     </IconButton>
// // // // // //                   </Tooltip>
// // // // // //                 </ListItemSecondaryAction>
// // // // // //               </ListItem>
// // // // // //               <Divider />
// // // // // //             </React.Fragment>
// // // // // //           ))
// // // // // //         )}
// // // // // //       </List>
// // // // // //     </Paper>
// // // // // //   );
// // // // // // };

// // // // // // export default MessageList;
