import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';

const MessageInput = () => {
  const { sendMessage, sendTypingIndicator, currentRoom } = useChat();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Common emojis
  const emojis = ['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '👎', '❤️', '🔥', '✨', '🎉', '💯', '🙌', '👋', '😊', '😢', '😡', '🤩', '😇', '🥳', '😴', '🤗', '🤝', '💪', '🙏', '✌️', '👌', '🤞', '🤘'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim() || !currentRoom) return;

    sendMessage(message);
    setMessage('');
    setIsTyping(false);
    sendTypingIndicator(false);
    setShowEmojiPicker(false);
    setShowGifPicker(false);
  };

  const handleChange = (e) => {
    setMessage(e.target.value);

    if (!currentRoom) return;

    // Send typing indicator
    if (!isTyping) {
      setIsTyping(true);
      sendTypingIndicator(true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingIndicator(false);
    }, 1000);
  };

  const addEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
  };

  const addGif = (gifUrl) => {
    setMessage(prev => prev + ` [GIF: ${gifUrl}] `);
    setShowGifPicker(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTyping) {
        sendTypingIndicator(false);
      }
    };
  }, [isTyping, sendTypingIndicator]);

  return (
    <div className="border-t border-primary-500/30 bg-dark-900 p-2 sm:p-4 shadow-lg relative">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full mb-2 left-2 sm:left-4 bg-dark-800 border-2 border-primary-500/40 p-3 sm:p-4 shadow-xl animate-fadeIn z-10" style={{borderRadius: '20px', maxWidth: '90vw', width: '300px'}}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-primary-500">Pick an Emoji</span>
            <button 
              onClick={() => setShowEmojiPicker(false)}
              className="text-gray-400 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => addEmoji(emoji)}
                className="text-2xl hover:bg-primary-500/20 p-2 rounded-lg transition-all hover:scale-125"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GIF Picker */}
      {showGifPicker && (
        <div className="absolute bottom-full mb-2 left-2 sm:left-4 bg-dark-800 border-2 border-primary-500/40 p-3 sm:p-4 shadow-xl animate-fadeIn z-10" style={{borderRadius: '20px', maxWidth: '90vw', width: '350px'}}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-primary-500">Popular GIFs</span>
            <button 
              onClick={() => setShowGifPicker(false)}
              className="text-gray-400 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <p className="text-xs text-gray-400 mb-2">Click to insert GIF link</p>
            {['thumbs-up', 'celebration', 'dancing', 'laughing', 'fire'].map((gif, index) => (
              <button
                key={index}
                onClick={() => addGif(`https://media.giphy.com/media/${gif}.gif`)}
                className="w-full text-left px-3 py-2 bg-dark-700 hover:bg-primary-500/20 rounded-lg transition-all text-sm text-gray-300"
              >
                🎬 {gif.replace('-', ' ')} GIF
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex space-x-1 sm:space-x-2">
        {/* Action buttons */}
        <div className="flex space-x-1">
          <button
            type="button"
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
              setShowGifPicker(false);
            }}
            disabled={!currentRoom}
            className="px-2 sm:px-3 py-2 sm:py-3 bg-dark-700 hover:bg-primary-500/20 text-xl sm:text-2xl rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-primary-500/30"
            title="Emoji"
          >
            😊
          </button>
          <button
            type="button"
            onClick={() => {
              setShowGifPicker(!showGifPicker);
              setShowEmojiPicker(false);
            }}
            disabled={!currentRoom}
            className="px-2 sm:px-3 py-2 sm:py-3 bg-dark-700 hover:bg-primary-500/20 text-lg sm:text-xl rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-primary-500/30"
            title="GIF"
          >
            🎬
          </button>
        </div>

        <input
          type="text"
          value={message}
          onChange={handleChange}
          placeholder={currentRoom ? "Type a message..." : "Select a room"}
          disabled={!currentRoom}
          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-dark-700 border-2 border-primary-500/40 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none disabled:bg-dark-800 disabled:cursor-not-allowed message-input transition-all duration-300 hover:border-primary-500/50"
          style={{borderRadius: '20px'}}
          maxLength={2000}
        />
        <button
          type="submit"
          disabled={!message.trim() || !currentRoom}
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover-glow transform hover:scale-105 shadow-lg"
          style={{borderRadius: '20px'}}
        >
          Send
        </button>
      </form>
      <div className="text-xs text-gray-500 mt-1 sm:mt-2 px-1">
        {message.length}/2000 characters
      </div>
    </div>
  );
};

export default MessageInput;
