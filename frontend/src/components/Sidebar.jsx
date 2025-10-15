import { useState } from 'react';
import { Search, Plus, MessageCircle } from 'lucide-react';

function Sidebar({ chats, selectedChat, onChatSelect, onNewChat }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatUsername, setNewChatUsername] = useState('');

  const filteredChats = chats.filter(chat => {
    const chatName = chat.name || chat.other_username || 'Unknown';
    return chatName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleNewChat = () => {
    if (newChatUsername.trim()) {
      onNewChat(newChatUsername.trim());
      setNewChatUsername('');
      setShowNewChatModal(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 86400000) { // Less than 24 hours
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 604800000) { // Less than 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Search Bar */}
      <div className="p-3 bg-gray-50 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-green"
          />
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3 border-b border-gray-200">
        <button
          onClick={() => setShowNewChatModal(true)}
          className="w-full flex items-center justify-center gap-2 bg-whatsapp-green text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <MessageCircle className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-center">No chats yet</p>
            <p className="text-sm text-center mt-1">Start a new conversation</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat)}
              className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                selectedChat?.id === chat.id ? 'bg-gray-100' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-whatsapp-green flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                {(chat.name || chat.other_username || 'U')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {chat.name || chat.other_username || 'Unknown'}
                  </h3>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {formatTime(chat.last_message_time)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {chat.last_message || 'No messages yet'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Start New Chat</h3>
            <input
              type="text"
              placeholder="Enter username..."
              value={newChatUsername}
              onChange={(e) => setNewChatUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNewChat()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-green mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowNewChatModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleNewChat}
                className="flex-1 px-4 py-2 bg-whatsapp-green text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
