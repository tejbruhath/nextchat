import { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import VoiceCall from './VoiceCall';
import { MoreVertical, Phone } from 'lucide-react';

function ChatWindow({ chat, socket, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!chat || !socket) return;

    // Join chat room
    socket.emit('joinChat', chat.id);

    // Fetch messages
    fetchMessages();

    // Listen for new messages
    socket.on('receiveMessage', (message) => {
      if (message.chat_id === chat.id) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
    });

    // Listen for typing indicators
    socket.on('userTyping', (data) => {
      if (data.chatId === chat.id && data.userId !== currentUser.id) {
        setTyping(data.username);
        
        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        // Set new timeout to clear typing indicator
        typingTimeoutRef.current = setTimeout(() => {
          setTyping(null);
        }, 3000);
      }
    });

    socket.on('userStoppedTyping', (data) => {
      if (data.chatId === chat.id) {
        setTyping(null);
      }
    });

    // Listen for incoming calls
    socket.on('incomingCall', (data) => {
      if (data.chatId === chat.id) {
        setIncomingCall(data);
        setIsInCall(true);
      }
    });

    return () => {
      socket.emit('leaveChat', chat.id);
      socket.off('receiveMessage');
      socket.off('userTyping');
      socket.off('userStoppedTyping');
      socket.off('incomingCall');
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chat, socket, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/chats/${chat.id}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch messages');

      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Fetch messages error:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (text, mediaUrl, mediaType) => {
    if (!socket) return;

    socket.emit('sendMessage', {
      chatId: chat.id,
      text,
      mediaUrl,
      mediaType
    });
  };

  const handleTyping = () => {
    if (!socket) return;
    socket.emit('typing', { chatId: chat.id });
  };

  const handleStopTyping = () => {
    if (!socket) return;
    socket.emit('stopTyping', { chatId: chat.id });
  };

  const startVoiceCall = () => {
    setIsInCall(true);
    setIncomingCall(null);
  };

  const endVoiceCall = () => {
    setIsInCall(false);
    setIncomingCall(null);
  };

  // Get the other user's ID for direct chats
  const getOtherUserId = () => {
    // This is a simple implementation - in production you'd fetch this from the chat members
    // For now, we'll need to pass it through the chat object
    return chat.other_user_id || null;
  };

  const chatName = chat.name || chat.other_username || 'Unknown';

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-whatsapp-green flex items-center justify-center text-white font-semibold">
            {chatName[0].toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">{chatName}</h2>
            {typing && (
              <p className="text-sm text-whatsapp-green">
                {typing} is typing...
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={startVoiceCall}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Voice Call"
          >
            <Phone className="w-5 h-5 text-whatsapp-green" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6 space-y-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p>No messages yet</p>
              <p className="text-sm mt-1">Send a message to start the conversation</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender_id === currentUser.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        onStopTyping={handleStopTyping}
      />

      {/* Voice Call Component */}
      {isInCall && (
        <VoiceCall
          socket={socket}
          currentUser={currentUser}
          targetUser={{
            id: getOtherUserId(),
            username: chatName
          }}
          chatId={chat.id}
          isIncoming={!!incomingCall}
          incomingCallData={incomingCall}
          onCallEnd={endVoiceCall}
        />
      )}
    </div>
  );
}

export default ChatWindow;
