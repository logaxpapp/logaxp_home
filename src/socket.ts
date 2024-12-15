import { io, Socket } from 'socket.io-client';
import { setupSocketListeners } from './socketEvents';

let socket: Socket | null = null;

export const connectSocket = (token: string, userId: string) => {
  if (socket && socket.connected) return;

  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    auth: { token },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
    setupSocketListeners(socket!, userId); // Attach event listeners
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from Socket.IO server');
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log('Socket disconnected');
  }
};

export const getSocket = (): Socket | null => socket;
