import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getSocket } from '../utils/socket';
import api from '../utils/api';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all rooms
  const fetchRooms = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await api.get('/api/rooms');
      if (response.data.success) {
        setRooms(response.data.rooms);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch messages for a room
  const fetchMessages = useCallback(async (roomId, page = 1) => {
    try {
      const response = await api.get(`/api/messages/${roomId}/latest`);
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    }
  }, []);

  // Join a room
  const joinRoom = useCallback(async (roomId) => {
    const socket = getSocket();
    if (!socket || !roomId) return;

    socket.emit('join-room', roomId);
    setCurrentRoom(roomId);
    await fetchMessages(roomId);
  }, [fetchMessages]);

  // Create a new room
  const createRoom = useCallback(async (name, description = '') => {
    try {
      const response = await api.post('/api/rooms', { name, description });
      if (response.data.success) {
        await fetchRooms();
        return { success: true, room: response.data.room };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create room';
      return { success: false, message };
    }
  }, [fetchRooms]);

  // Delete a room
  const deleteRoom = useCallback(async (roomId) => {
    try {
      const response = await api.delete(`/api/rooms/${roomId}`);
      if (response.data.success) {
        // If we're in the deleted room, clear current room
        if (currentRoom === roomId) {
          setCurrentRoom(null);
          setMessages([]);
        }
        await fetchRooms();
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete room';
      return { success: false, message };
    }
  }, [fetchRooms, currentRoom]);

  // Send a message
  const sendMessage = useCallback((content) => {
    const socket = getSocket();
    if (!socket || !currentRoom || !content.trim()) return;

    socket.emit('send-message', {
      roomId: currentRoom,
      content: content.trim()
    });
  }, [currentRoom]);

  // Send typing indicator
  const sendTypingIndicator = useCallback((isTyping) => {
    const socket = getSocket();
    if (!socket || !currentRoom) return;

    socket.emit('typing', { roomId: currentRoom, isTyping });
  }, [currentRoom]);

  // Setup socket listeners
  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = getSocket();
    if (!socket) return;

    // New message handler
    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    // User joined handler
    const handleUserJoined = (data) => {
      console.log('User joined:', data.username);
    };

    // User left handler
    const handleUserLeft = (data) => {
      console.log('User left:', data.username);
    };

    // Typing indicator handler
    const handleUserTyping = ({ username, isTyping }) => {
      if (isTyping) {
        setTypingUsers((prev) => 
          prev.includes(username) ? prev : [...prev, username]
        );
      } else {
        setTypingUsers((prev) => prev.filter((u) => u !== username));
      }
    };

    // Room joined confirmation
    const handleRoomJoined = (data) => {
      console.log('Joined room:', data.roomName);
    };

    // Error handler
    const handleError = (error) => {
      console.error('Socket error:', error);
      setError(error.message);
    };

    socket.on('new-message', handleNewMessage);
    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);
    socket.on('user-typing', handleUserTyping);
    socket.on('room-joined', handleRoomJoined);
    socket.on('error', handleError);

    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
      socket.off('user-typing', handleUserTyping);
      socket.off('room-joined', handleRoomJoined);
      socket.off('error', handleError);
    };
  }, [isAuthenticated]);

  // Fetch rooms on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchRooms();
    }
  }, [isAuthenticated, fetchRooms]);

  const value = {
    rooms,
    currentRoom,
    messages,
    typingUsers,
    loading,
    error,
    fetchRooms,
    joinRoom,
    createRoom,
    deleteRoom,
    sendMessage,
    sendTypingIndicator
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
