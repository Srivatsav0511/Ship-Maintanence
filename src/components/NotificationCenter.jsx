import React from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNotification } from '../context/NotificationContext';

function NotificationCenter() {
  const { notifications, removeNotification } = useNotification();

  return (
    <>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          autoHideDuration={6000}
          onClose={() => removeNotification(notification.id)}
        >
          <Alert
            severity={notification.severity || 'info'}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => removeNotification(notification.id)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}

export default NotificationCenter; 