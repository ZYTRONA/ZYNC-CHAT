const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Room = require('../models/Room');
const { protect } = require('../middleware/auth');

// @route   GET /api/messages/:roomId
// @desc    Get paginated messages for a room
// @access  Private
router.get('/:roomId', protect, async (req, res) => {
  try {
    const { roomId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    // Verify room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Get paginated messages
    const result = await Message.getPaginatedMessages(roomId, page, limit);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages'
    });
  }
});

// @route   GET /api/messages/:roomId/latest
// @desc    Get latest messages for a room (for initial load)
// @access  Private
router.get('/:roomId/latest', protect, async (req, res) => {
  try {
    const { roomId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    // Verify room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Get latest messages
    const messages = await Message.find({ room: roomId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('sender', 'username isOnline')
      .lean();

    res.json({
      success: true,
      messages: messages.reverse()
    });
  } catch (error) {
    console.error('Get latest messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages'
    });
  }
});

module.exports = router;
