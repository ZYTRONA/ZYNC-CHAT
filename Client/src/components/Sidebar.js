import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { rooms, currentRoom, joinRoom, createRoom, deleteRoom, loading } = useChat();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [createError, setCreateError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setCreateError('');

    if (!newRoomName.trim()) {
      setCreateError('Room name is required');
      return;
    }

    const result = await createRoom(newRoomName, newRoomDescription);
    
    if (result.success) {
      setNewRoomName('');
      setNewRoomDescription('');
      setShowCreateModal(false);
      joinRoom(result.room._id);
    } else {
      setCreateError(result.message);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    setDeleteError('');
    const result = await deleteRoom(roomId);
    
    if (result.success) {
      setShowDeleteConfirm(null);
    } else {
      setDeleteError(result.message);
    }
  };

  const isRoomCreator = (room) => {
    if (!user || !room) return false;
    
    // Check both populated and non-populated createdBy
    const creatorId = room.createdBy?._id || room.createdBy;
    const userId = user._id || user.id;
    
    console.log('Room:', room.name, 'CreatorId:', creatorId, 'UserId:', userId, 'Match:', creatorId === userId);
    
    return creatorId === userId;
  };

  return (
    <>
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="p-4 bg-dark-700 border-b border-primary-500/30 shadow-lg">
          <h2 className="text-xl font-bold text-primary-500">Chat Rooms</h2>
        </div>

        {/* Create Room Button */}
        <div className="p-4 border-b border-primary-500/20">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-2 px-4 transition-all duration-300 hover-glow transform hover:scale-105 shadow-lg"
            style={{borderRadius: '16px'}}
          >
            + Create Room
          </button>
        </div>

        {/* Rooms List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-400 animate-pulse">Loading rooms...</div>
          ) : rooms.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              No rooms yet. Create one to get started!
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {rooms.map((room) => (
                <div key={room._id} className="relative">
                  <button
                    onClick={() => joinRoom(room._id)}
                    className={`w-full text-left p-3 transition-all duration-300 hover-slide animate-slideIn ${
                      currentRoom === room._id
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105'
                        : 'hover:bg-dark-700 text-gray-300 hover:shadow-md border border-transparent hover:border-primary-500/30'
                    } ${isRoomCreator(room) ? 'pr-10' : 'pr-3'}`}
                    style={{borderRadius: '16px'}}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold">#{room.name}</div>
                        {room.description && (
                          <div className="text-xs text-gray-400 mt-1 truncate">
                            {room.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {/* Delete button - only for room creator - Always visible */}
                  {isRoomCreator(room) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(room._id);
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white p-1 px-2 transition-all duration-200 shadow-lg z-10"
                      style={{borderRadius: '8px'}}
                      title="Delete room"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-dark-800 border-2 border-primary-500/40 shadow-2xl max-w-md w-full p-6 animate-slideIn" style={{borderRadius: '24px'}}>
            <h3 className="text-2xl font-bold text-white mb-4">Create New Room</h3>
            
            <form onSubmit={handleCreateRoom} className="space-y-4">
              {createError && (
                <div className="bg-red-900/30 border-2 border-red-500/50 text-red-300 px-4 py-3 animate-fadeIn" style={{borderRadius: '16px'}}>
                  {createError}
                </div>
              )}

              <div>
                <label htmlFor="roomName" className="block text-sm font-medium text-gray-300 mb-2">
                  Room Name *
                </label>
                <input
                  id="roomName"
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full px-4 py-2 bg-dark-700 border-2 border-primary-500/40 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-300"
                  style={{borderRadius: '16px'}}
                  placeholder="e.g., General Chat"
                  maxLength={50}
                />
              </div>

              <div>
                <label htmlFor="roomDescription" className="block text-sm font-medium text-gray-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  id="roomDescription"
                  value={newRoomDescription}
                  onChange={(e) => setNewRoomDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-dark-700 border-2 border-primary-500/40 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none transition-all duration-300"
                  style={{borderRadius: '16px'}}
                  placeholder="What's this room about?"
                  rows={3}
                  maxLength={200}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewRoomName('');
                    setNewRoomDescription('');
                    setCreateError('');
                  }}
                  className="flex-1 bg-dark-700 hover:bg-dark-600 border-2 border-primary-500/40 text-white font-semibold py-2 px-4 transition-all duration-300 hover:border-primary-500/50"
                  style={{borderRadius: '16px'}}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-2 px-4 transition-all duration-300 hover-glow"
                  style={{borderRadius: '16px'}}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Room Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-dark-800 border-2 border-red-500/40 shadow-2xl max-w-md w-full p-6 animate-slideIn" style={{borderRadius: '24px'}}>
            <h3 className="text-2xl font-bold text-white mb-4">Delete Room?</h3>
            
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete this room? This action cannot be undone.
            </p>

            {deleteError && (
              <div className="bg-red-900/30 border-2 border-red-500/50 text-red-300 px-4 py-3 mb-4 animate-fadeIn" style={{borderRadius: '16px'}}>
                {deleteError}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(null);
                  setDeleteError('');
                }}
                className="flex-1 bg-dark-700 hover:bg-dark-600 border-2 border-primary-500/40 text-white font-semibold py-2 px-4 transition-all duration-300 hover:border-primary-500/50"
                style={{borderRadius: '16px'}}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRoom(showDeleteConfirm)}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 transition-all duration-300 hover-glow"
                style={{borderRadius: '16px'}}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
