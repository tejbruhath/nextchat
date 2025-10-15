import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { LogOut } from 'lucide-react';
import { SOCKET_URL } from '../config';
import { apiCall } from '../utils/api';

function Chat({ setIsAuthenticated }) {
  const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }

    // Initialize socket connection
    const token = localStorage.getItem('token');
    const newSocket = io(SOCKET_URL, {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    // Listen for new messages to update chat list
    newSocket.on('receiveMessage', (message) => {
      // Update the chat list with the new message
      setChats(prevChats => {
        // Check if chat already exists in the list
        const chatExists = prevChats.some(chat => chat.id === message.chat_id);
        
        if (chatExists) {
          // Update existing chat
          const updatedChats = prevChats.map(chat => {
            if (chat.id === message.chat_id) {
              return {
                ...chat,
                last_message: message.text || 'Media',
                last_message_time: message.created_at
              };
            }
            return chat;
          });
          
          // Sort chats by last message time (most recent first)
          return updatedChats.sort((a, b) => {
            const timeA = new Date(a.last_message_time || 0);
            const timeB = new Date(b.last_message_time || 0);
            return timeB - timeA;
          });
        } else {
          // New chat - refresh the entire chat list
          fetchChats();
          return prevChats;
        }
      });
    });

    setSocket(newSocket);

    // Fetch chats
    fetchChats();

    return () => {
      newSocket.off('receiveMessage');
      newSocket.close();
    };
  }, []);

  const fetchChats = async () => {
    try {
      const response = await apiCall('/api/chats');

      if (!response.ok) throw new Error('Failed to fetch chats');

      const data = await response.json();
      setChats(data.chats);
    } catch (error) {
      console.error('Fetch chats error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (socket) socket.close();
    setIsAuthenticated(false);
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleNewChat = async (username) => {
    try {
      // Search for user
      const searchResponse = await apiCall(`/api/chats/users/search?query=${username}`);

      if (!searchResponse.ok) throw new Error('Failed to search users');

      const searchData = await searchResponse.json();
      
      if (searchData.users.length === 0) {
        alert('User not found');
        return;
      }

      const user = searchData.users[0];

      // Create chat
      const createResponse = await apiCall('/api/chats', {
        method: 'POST',
        body: JSON.stringify({
          isGroup: false,
          memberIds: [user.id]
        })
      });

      if (!createResponse.ok) throw new Error('Failed to create chat');

      // Refresh chats
      await fetchChats();
    } catch (error) {
      console.error('Create chat error:', error);
      alert('Failed to create chat');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/3 max-w-md bg-white border-r border-gray-200 flex flex-col">
        <div className="bg-whatsapp-teal text-white p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">NextChat</h2>
            <p className="text-sm text-gray-200">
              {currentUser?.username}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-whatsapp-green rounded-full transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        <Sidebar
          chats={chats}
          selectedChat={selectedChat}
          onChatSelect={handleChatSelect}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            socket={socket}
            currentUser={currentUser}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Welcome to NextChat
              </h3>
              <p className="text-gray-500">
                Select a chat to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
