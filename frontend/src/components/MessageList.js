import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const MessageList = ({ messages = [] }) => {
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
              secondary={`Received at: ${new Date(
                message.createdAt
              ).toLocaleString()}`}
            />
          </ListItem>
        ))
      )}
    </List>
  );
};

export default MessageList;
