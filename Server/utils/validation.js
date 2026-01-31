const validator = require('validator');

// Sanitize user input to prevent XSS
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    // Escape HTML entities and trim whitespace
    return validator.escape(input.trim());
  }
  return input;
};

// Validate email format
const isValidEmail = (email) => {
  return validator.isEmail(email);
};

// Validate username format
const isValidUsername = (username) => {
  if (!username || typeof username !== 'string') return false;
  
  const trimmed = username.trim();
  if (trimmed.length < 3 || trimmed.length > 20) return false;
  
  // Only allow letters, numbers, and underscores
  return /^[a-zA-Z0-9_]+$/.test(trimmed);
};

// Validate room name format
const isValidRoomName = (roomName) => {
  if (!roomName || typeof roomName !== 'string') return false;
  
  const trimmed = roomName.trim();
  if (trimmed.length < 3 || trimmed.length > 50) return false;
  
  // Allow letters, numbers, spaces, hyphens, and underscores
  return /^[a-zA-Z0-9\s-_]+$/.test(trimmed);
};

// Validate message content
const isValidMessage = (message) => {
  if (!message || typeof message !== 'string') return false;
  
  const trimmed = message.trim();
  return trimmed.length > 0 && trimmed.length <= 2000;
};

// Sanitize message content but preserve some formatting
const sanitizeMessage = (message) => {
  if (typeof message !== 'string') return '';
  
  // Remove dangerous HTML but allow some basic formatting
  let sanitized = message.trim();
  
  // Remove script tags and other dangerous elements
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  sanitized = sanitized.replace(/on\w+="[^"]*"/gi, ''); // Remove event handlers
  sanitized = sanitized.replace(/on\w+='[^']*'/gi, '');
  
  return sanitized;
};

module.exports = {
  sanitizeInput,
  isValidEmail,
  isValidUsername,
  isValidRoomName,
  isValidMessage,
  sanitizeMessage
};
