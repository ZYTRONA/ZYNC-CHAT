const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderUsername: {
    type: String,
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'system'],
    default: 'text'
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index for efficient querying and sorting
messageSchema.index({ room: 1, timestamp: -1 });
messageSchema.index({ sender: 1, timestamp: -1 });

// Static method to get paginated messages
messageSchema.statics.getPaginatedMessages = async function(roomId, page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  
  const messages = await this.find({ room: roomId })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .populate('sender', 'username isOnline')
    .lean();
  
  const total = await this.countDocuments({ room: roomId });
  
  return {
    messages: messages.reverse(), // Reverse to show oldest first
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalMessages: total,
      hasMore: skip + messages.length < total
    }
  };
};

module.exports = mongoose.model('Message', messageSchema);
