import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button
} from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { notificationService } from '../../services/notificationService';
import type { Notification } from '../../types';

export const NotificationCenter: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  React.useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const notifs = notificationService.getNotifications();
    setNotifications(notifs);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    loadNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id);
    loadNotifications();
  };

  const handleDelete = (id: string) => {
    notificationService.deleteNotification(id);
    loadNotifications();
  };

  const handleClearAll = () => {
    notificationService.clearAllNotifications();
    loadNotifications();
    handleClose();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          {notifications.length > 0 && (
            <Button size="small" onClick={handleClearAll}>
              Clear All
            </Button>
          )}
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography color="text.secondary">No notifications</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    bgcolor: notification.read ? 'inherit' : 'action.hover',
                    '&:hover': { bgcolor: 'action.selected' }
                  }}
                >
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box>
                    {!notification.read && (
                      <Button
                        size="small"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(notification.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Menu>
    </>
  );
}; 