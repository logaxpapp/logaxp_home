import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../types/notification';

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Partial<Notification>>) {
      const newNotification: Notification = {
        _id: action.payload._id || `temp-${Date.now()}`, // Generate a temp ID if not provided
        type: action.payload.type || 'general', // Default type
        recipient: action.payload.recipient || 'unknown', // Default recipient
        sender: action.payload.sender || null, // Default sender
        data: action.payload.data || {},
        read: action.payload.read || false,
        timestamp: action.payload.timestamp || new Date().toISOString(),
        createdAt: action.payload.createdAt || new Date().toISOString(),
        updatedAt: action.payload.updatedAt || new Date().toISOString(),
        title: action.payload.title || '',
        message: action.payload.message || '',
      };

      state.notifications.unshift(newNotification);
    },
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload;
    },
    markNotificationAsRead(state, action: PayloadAction<string>) {
      const index = state.notifications.findIndex((n) => n._id === action.payload);
      if (index !== -1) {
        state.notifications[index].read = true;
      }
    },
    markAllAsRead(state) {
      state.notifications.forEach((n) => (n.read = true));
    },
  },
});

export const {
  addNotification,
  setNotifications,
  markNotificationAsRead,
  markAllAsRead,
} = notificationSlice.actions;

export default notificationSlice.reducer;
