import React, { useState } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { getStatusById } from '../api/completionStatusApi';

const MessageList = ({ messages = [] }) => {
  const [statusData, setStatusData] = useState(null);

  // Function to handle link click
  const handleLinkClick = async (completionStatusId) => {
    try {
      const data = await getStatusById(completionStatusId);
      setStatusData(data); // Store the status data in the state or handle it as needed
      console.log('Completion Status Data:', data); // You can do whatever you want with the data
    } catch (error) {
      console.error('Error fetching status by ID:', error);
    }
  };
  // Set a default empty array
  return (
    <List>
      {messages.length === 0 ? (
        <ListItem>
          <ListItemText primary='No messages available' />
        </ListItem>
      ) : (
        messages.map((message) => (
          <ListItem key={message._id}>
            <ListItemText
              primary={message.message}
              secondary={
                <>
                  <div>
                    Received at: {new Date(message.createdAt).toLocaleString()}
                  </div>
                  <div>
                    Completion Status ID:
                    <a
                      href='#'
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default link behavior
                        handleLinkClick(message.completionStatusId); // Call the function
                      }}
                    >
                      {message.completionStatusId}
                    </a>
                  </div>
                </>
              }
            />
          </ListItem>
        ))
      )}
    </List>
  );
};

export default MessageList;

// import React from 'react';
// import { List, ListItem, ListItemText } from '@mui/material';

// const MessageList = ({ messages = [] }) => {
//   // Set a default empty array
//   return (
//     <List>
//       {messages.length === 0 ? (
//         <ListItem>
//           <ListItemText primary='No messages available' />
//         </ListItem>
//       ) : (
//         messages.map((message) => (
//           <ListItem key={message._id}>
//             <ListItemText
//               primary={message.message}
//               secondary={`Received at: ${new Date(
//                 message.createdAt
//               ).toLocaleString()}`}
//             />
//           </ListItem>
//         ))
//       )}
//     </List>
//   );
// };

// export default MessageList;
