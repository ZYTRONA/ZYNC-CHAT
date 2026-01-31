import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatRoom = () => {
  const { user, logout } = useAuth();
  const { currentRoom, rooms, typingUsers } = useChat();

  const getCurrentRoomName = () => {
    const room = rooms.find((r) => r._id === currentRoom);
    return room ? `#${room.name}` : 'Select a room';
  };

  return (
    <div className="h-screen flex flex-col bg-dark-900">
      {/* Top Navigation Bar */}
      <div className="bg-dark-900 border border-primary-500/30 mx-2 sm:mx-3 mt-2 sm:mt-3 mb-2 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-lg" style={{borderRadius: '20px'}}>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <h1 className="text-lg sm:text-2xl font-bold text-primary-500">ZYNC-CHAT</h1>
          {currentRoom && (
            <div className="hidden lg:block">
              <span className="text-xl font-semibold text-white">
                {getCurrentRoomName()}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-2 px-2 sm:px-4 py-1 sm:py-2 bg-dark-800 border border-primary-500/30" style={{borderRadius: '20px'}}>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm font-medium text-gray-300 truncate max-w-20 sm:max-w-none">{user?.username}</span>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base transition-all duration-300 hover-glow transform hover:scale-105 shadow-lg"
            style={{borderRadius: '16px'}}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden px-2 sm:px-3 pb-2 sm:pb-3 space-y-2 lg:space-y-0 lg:space-x-3"
        style={{minHeight: 0}}
      >
        {/* Sidebar */}
        <div className="w-full lg:w-80 lg:h-auto border-2 border-primary-500/30 bg-dark-800 shadow-lg overflow-hidden flex-shrink-0" style={{borderRadius: '20px'}}>
          <Sidebar />
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col border-2 border-primary-500/30 bg-dark-800 shadow-lg overflow-hidden" style={{borderRadius: '20px', minHeight: 0}}>
          {/* Messages */}
          <MessageList />

          {/* Typing Indicator */}
          {typingUsers.length > 0 && currentRoom && (
            <div className="px-3 sm:px-6 py-2 bg-dark-700 border-t border-primary-500/20 text-xs sm:text-sm text-primary-400 animate-pulse">
              {typingUsers.length === 1
                ? `${typingUsers[0]} is typing...`
                : typingUsers.length === 2
                ? `${typingUsers[0]} and ${typingUsers[1]} are typing...`
                : `${typingUsers.length} people are typing...`}
            </div>
          )}

          {/* Message Input */}
          <MessageInput />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
