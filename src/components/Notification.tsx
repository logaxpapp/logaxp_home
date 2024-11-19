// src/components/Notification.tsx

import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface NotificationProps {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
