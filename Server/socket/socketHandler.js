const Message = require('../models/Message');
const Room = require('../models/Room');
const User = require('../models/User');
const { isValidMessage, sanitizeMessage } = require('../utils/validation');

// Store active users and their socket connections
const activeUsers = new Map();

// Rate limiting for socket events
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 1000; // 1 second
const MAX_MESSAGES_PER_WINDOW = 5;

const checkRateLimit = (userId) => {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

  if (now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= MAX_MESSAGES_PER_WINDOW) {
    return false;
  }

  userLimit.count++;
  return true;
};

const setupSocketHandlers = (io) => {
  io.on('connection', async (socket) => {
    const user = socket.user;
    console.log(`User connected: ${user.username} (${socket.id})`);

    // Update user's socket ID and online status
    try {
      await User.findByIdAndUpdate(user._id, {
        socketId: socket.id,
        isOnline: true,
        lastSeen: Date.now()
      });

      activeUsers.set(user._id.toString(), {
        socketId: socket.id,
        username: user.username,
        currentRoom: null
      });
    } catch (error) {
      console.error('Error updating user status:', error);
    }

    // Join room event
    socket.on('join-room', async (roomId) => {
      try {
        // Verify room exists
        const room = await Room.findById(roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Leave previous room if any
        const currentRoom = activeUsers.get(user._id.toString())?.currentRoom;
        if (currentRoom) {
          socket.leave(currentRoom);
        }

        // Join new room
        socket.join(roomId);
        activeUsers.get(user._id.toString()).currentRoom = roomId;

        // Update user's current room
        await User.findByIdAndUpdate(user._id, { currentRoom: roomId });

        // Add user to room members if not already there
        if (!room.members.includes(user._id)) {
          room.members.push(user._id);
          await room.save();
        }

        // Notify others in the room
        socket.to(roomId).emit('user-joined', {
          username: user.username,
          userId: user._id,
          timestamp: Date.now()
        });

        // Send confirmation to user
        socket.emit('room-joined', {
          roomId,
          roomName: room.name
        });

        // Create system message
        const systemMessage = await Message.create({
          content: `${user.username} joined the room`,
          sender: user._id,
          senderUsername: user.username,
          room: roomId,
          messageType: 'system'
        });

        io.to(roomId).emit('new-message', {
          _id: systemMessage._id,
          content: systemMessage.content,
          sender: {
            _id: user._id,
            username: user.username
          },
          senderUsername: user.username,
          timestamp: systemMessage.timestamp,
          messageType: 'system'
        });
      } catch (error) {
        console.error('Join room error:', error);
        socket.emit('error', { message: 'Error joining room' });
      }
    });

    // Send message event
    socket.on('send-message', async ({ roomId, content }) => {
      try {
        // Rate limiting
        if (!checkRateLimit(user._id.toString())) {
          socket.emit('error', { message: 'Too many messages. Please slow down.' });
          return;
        }

        // Validate message
        if (!isValidMessage(content)) {
          socket.emit('error', { message: 'Invalid message content' });
          return;
        }

        // Verify user is in the room
        const userRoom = activeUsers.get(user._id.toString())?.currentRoom;
        if (userRoom !== roomId) {
          socket.emit('error', { message: 'You must join a room before sending messages' });
          return;
        }

        // Sanitize message content
        const sanitizedContent = sanitizeMessage(content);

        // Save message to database
        const message = await Message.create({
          content: sanitizedContent,
          sender: user._id,
          senderUsername: user.username,
          room: roomId,
          messageType: 'text'
        });

        // Update room's last activity
        await Room.findByIdAndUpdate(roomId, { lastActivity: Date.now() });

        // Broadcast message to room
        io.to(roomId).emit('new-message', {
          _id: message._id,
          content: message.content,
          sender: {
            _id: user._id,
            username: user.username,
            isOnline: true
          },
          senderUsername: user.username,
          timestamp: message.timestamp,
          messageType: 'text'
        });
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Error sending message' });
      }
    });

    // Typing indicator
    socket.on('typing', ({ roomId, isTyping }) => {
      socket.to(roomId).emit('user-typing', {
        username: user.username,
        userId: user._id,
        isTyping
      });
    });

    // Get online users in room
    socket.on('get-room-users', async (roomId) => {
      try {
        const room = await Room.findById(roomId).populate('members', 'username isOnline');
        if (room) {
          socket.emit('room-users', {
            roomId,
            users: room.members
          });
        }
      } catch (error) {
        console.error('Get room users error:', error);
      }
    });

    // Disconnect event
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${user.username} (${socket.id})`);

      try {
        // Get user's current room before cleanup
        const userData = activeUsers.get(user._id.toString());
        const currentRoom = userData?.currentRoom;

        // Update user status
        await User.findByIdAndUpdate(user._id, {
          socketId: null,
          isOnline: false,
          lastSeen: Date.now(),
          currentRoom: null
        });

        // Remove from active users
        activeUsers.delete(user._id.toString());

        // Notify room members if user was in a room
        if (currentRoom) {
          socket.to(currentRoom).emit('user-left', {
            username: user.username,
            userId: user._id,
            timestamp: Date.now()
          });

          // Create system message
          const systemMessage = await Message.create({
            content: `${user.username} left the room`,
            sender: user._id,
            senderUsername: user.username,
            room: currentRoom,
            messageType: 'system'
          });

          io.to(currentRoom).emit('new-message', {
            _id: systemMessage._id,
            content: systemMessage.content,
            sender: {
              _id: user._id,
              username: user.username
            },
            senderUsername: user.username,
            timestamp: systemMessage.timestamp,
            messageType: 'system'
          });
        }
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Cleanup rate limit map periodically
  setInterval(() => {
    const now = Date.now();
    for (const [userId, data] of rateLimitMap.entries()) {
      if (now > data.resetTime) {
        rateLimitMap.delete(userId);
      }
    }
  }, 60000); // Clean up every minute
};

module.exports = { setupSocketHandlers, activeUsers };
