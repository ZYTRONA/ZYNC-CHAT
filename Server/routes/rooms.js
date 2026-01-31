const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');
const { isValidRoomName, sanitizeInput } = require('../utils/validation');

// @route   GET /api/rooms
// @desc    Get all active rooms
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const rooms = await Room.find({ isActive: true })
      .sort({ lastActivity: -1 })
      .populate('createdBy', 'username')
      .select('-members')
      .lean();

    res.json({
      success: true,
      rooms
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rooms'
    });
  }
});

// @route   GET /api/rooms/:id
// @desc    Get room details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('members', 'username isOnline');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      room
    });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching room'
    });
  }
});

// @route   POST /api/rooms
// @desc    Create a new room
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate room name
    const sanitizedName = sanitizeInput(name);
    if (!isValidRoomName(sanitizedName)) {
      return res.status(400).json({
        success: false,
        message: 'Room name must be 3-50 characters and contain only letters, numbers, spaces, hyphens, and underscores'
      });
    }

    // Check if room already exists
    const existingRoom = await Room.findOne({ name: sanitizedName });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: 'Room name already exists'
      });
    }

    // Create room
    const room = await Room.create({
      name: sanitizedName,
      description: description ? sanitizeInput(description) : '',
      createdBy: req.user._id,
      members: [req.user._id]
    });

    await room.populate('createdBy', 'username');

    res.status(201).json({
      success: true,
      room
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating room'
    });
  }
});

// @route   DELETE /api/rooms/:id
// @desc    Delete/deactivate a room
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if user is the creator
    if (room.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this room'
      });
    }

    // Soft delete - mark as inactive
    room.isActive = false;
    await room.save();

    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting room'
    });
  }
});

module.exports = router;
