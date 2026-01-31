import React, { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const MessageList = () => {
  const { messages, currentRoom } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const formatTime = (timestamp) => {
    try {
      return format(new Date(timestamp), 'h:mm a');
    } catch {
      return '';
    }
  };

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return format(date, 'MMM dd, yyyy');
      }
    } catch {
      return '';
    }
  };

  if (!currentRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-dark-900 to-dark-800">
        <div className="text-center animate-fadeIn">
          <div className="text-6xl mb-4 animate-pulse">💬</div>
          <h3 className="text-2xl font-semibold text-white mb-2">Welcome to ZYNC-CHAT</h3>
          <p className="text-gray-400">Select a room to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto bg-gradient-to-br from-dark-900 to-dark-800 p-4 space-y-4"
    >
      {messages.length === 0 ? (
        <div className="text-center text-gray-400 mt-8 animate-fadeIn">
          No messages yet. Start the conversation!
        </div>
      ) : (
        <>
          {messages.map((message, index) => {
            const showDate =
              index === 0 ||
              formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);
            const isOwnMessage = message.sender?._id === user?.id || message.sender === user?.id;
            const isSystemMessage = message.messageType === 'system';

            return (
              <div key={message._id || index}>
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="bg-dark-700 border border-primary-500/30 text-gray-300 text-xs px-3 py-1 rounded-full shadow-lg">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                )}

                {isSystemMessage ? (
                  <div className="flex justify-center">
                    <span className="bg-dark-700 border border-primary-500/30 text-gray-300 text-sm px-3 py-1 rounded-full shadow-lg">
                      {message.content}
                    </span>
                  </div>
                ) : (
                  <div
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                        isOwnMessage
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                          : 'bg-dark-700 text-white border border-primary-500/20 shadow-lg'
                      } rounded-lg px-4 py-2 hover-lift cursor-pointer transition-all duration-300`}
                    >
                      {!isOwnMessage && (
                        <div className="text-xs font-semibold text-primary-400 mb-1">
                          {message.senderUsername || message.sender?.username}
                        </div>
                      )}
                      <div className="break-words whitespace-pre-wrap">
                        {message.content}
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-primary-100' : 'text-gray-400'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessageList;
