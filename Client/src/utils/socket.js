import { io } from 'socket.io-client';

// Determine Socket URL based on environment
const getSocketUrl = () => {
  // Use environment variable if set
  if (process.env.REACT_APP_SOCKET_URL) {
    return process.env.REACT_APP_SOCKET_URL;
  }
  
  // Production: Use the Render backend
  if (process.env.NODE_ENV === 'production') {
    return 'https://zync-chat-ed7e.onrender.com';
  }
  
  // Development: Use localhost
  return 'http://localhost:5000';
};

const SOCKET_URL = getSocketUrl();

let socket = null;

export const initializeSocket = (token) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

const socketUtils = { initializeSocket, disconnectSocket, getSocket };
export default socketUtils;
