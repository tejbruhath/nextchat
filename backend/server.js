import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

import { initDatabase, getDatabase } from './db.js';
import authRoutes from './routes/auth.js';
import chatsRoutes from './routes/chats.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatsRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NextChat server is running' });
});

// Socket.io authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.username = decoded.username;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Store active users
const activeUsers = new Map();

// Socket.io connection handling
io.on('connection', async (socket) => {
  console.log(`✅ User connected: ${socket.username} (${socket.id})`);
  
  // Store active user
  activeUsers.set(socket.userId, socket.id);
  
  // Broadcast user online status
  io.emit('userOnline', { userId: socket.userId, username: socket.username });

  // Automatically join user to all their chats
  try {
    const db = getDatabase();
    const userChats = await db.all(
      'SELECT chat_id FROM chat_members WHERE user_id = ?',
      [socket.userId]
    );
    
    userChats.forEach(({ chat_id }) => {
      socket.join(`chat_${chat_id}`);
    });
    
    console.log(`📥 ${socket.username} auto-joined ${userChats.length} chats`);
  } catch (error) {
    console.error('Auto-join chats error:', error);
  }

  // Join chat room
  socket.on('joinChat', async (chatId) => {
    try {
      const db = getDatabase();
      
      // Verify user is member of chat
      const membership = await db.get(
        'SELECT id FROM chat_members WHERE chat_id = ? AND user_id = ?',
        [chatId, socket.userId]
      );

      if (membership) {
        socket.join(`chat_${chatId}`);
        console.log(`📥 ${socket.username} joined chat ${chatId}`);
      }
    } catch (error) {
      console.error('Join chat error:', error);
    }
  });

  // Leave chat room
  socket.on('leaveChat', (chatId) => {
    socket.leave(`chat_${chatId}`);
    console.log(`📤 ${socket.username} left chat ${chatId}`);
  });

  // Send message
  socket.on('sendMessage', async (data) => {
    try {
      const { chatId, text, mediaUrl, mediaType } = data;
      const db = getDatabase();

      // Verify user is member of chat
      const membership = await db.get(
        'SELECT id FROM chat_members WHERE chat_id = ? AND user_id = ?',
        [chatId, socket.userId]
      );

      if (!membership) {
        socket.emit('error', { message: 'Not a member of this chat' });
        return;
      }

      // Insert message into database
      const result = await db.run(
        'INSERT INTO messages (chat_id, sender_id, text, media_url, media_type) VALUES (?, ?, ?, ?, ?)',
        [chatId, socket.userId, text || null, mediaUrl || null, mediaType || null]
      );

      const message = {
        id: result.lastID,
        chat_id: chatId,
        sender_id: socket.userId,
        sender_username: socket.username,
        text,
        media_url: mediaUrl,
        media_type: mediaType,
        is_read: false,
        created_at: new Date().toISOString()
      };

      // Broadcast message to all users in the chat room
      io.to(`chat_${chatId}`).emit('receiveMessage', message);
      
      console.log(`💬 Message sent in chat ${chatId} by ${socket.username}`);
    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { chatId } = data;
    socket.to(`chat_${chatId}`).emit('userTyping', {
      chatId,
      userId: socket.userId,
      username: socket.username
    });
  });

  // Stop typing indicator
  socket.on('stopTyping', (data) => {
    const { chatId } = data;
    socket.to(`chat_${chatId}`).emit('userStoppedTyping', {
      chatId,
      userId: socket.userId
    });
  });

  // Mark messages as read
  socket.on('markAsRead', async (data) => {
    try {
      const { chatId } = data;
      const db = getDatabase();

      await db.run(
        'UPDATE messages SET is_read = 1 WHERE chat_id = ? AND sender_id != ? AND is_read = 0',
        [chatId, socket.userId]
      );

      socket.to(`chat_${chatId}`).emit('messagesRead', {
        chatId,
        userId: socket.userId
      });
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  });

  // ========== VOICE CALL EVENTS (WebRTC Signaling) ==========

  // Initiate voice call
  socket.on('callUser', (data) => {
    const { chatId, targetUserId, offer } = data;
    const targetSocketId = activeUsers.get(targetUserId);
    
    if (targetSocketId) {
      io.to(targetSocketId).emit('incomingCall', {
        chatId,
        callerId: socket.userId,
        callerName: socket.username,
        offer
      });
      console.log(`📞 Call initiated from ${socket.username} to user ${targetUserId}`);
    } else {
      socket.emit('callError', { message: 'User is offline' });
    }
  });

  // Answer voice call
  socket.on('answerCall', (data) => {
    const { callerId, answer } = data;
    const callerSocketId = activeUsers.get(callerId);
    
    if (callerSocketId) {
      io.to(callerSocketId).emit('callAnswered', {
        answer,
        answererId: socket.userId
      });
      console.log(`📞 Call answered by ${socket.username}`);
    }
  });

  // ICE candidate exchange
  socket.on('iceCandidate', (data) => {
    const { targetUserId, candidate } = data;
    const targetSocketId = activeUsers.get(targetUserId);
    
    if (targetSocketId) {
      io.to(targetSocketId).emit('iceCandidate', {
        candidate,
        senderId: socket.userId
      });
    }
  });

  // End call
  socket.on('endCall', (data) => {
    const { targetUserId } = data;
    const targetSocketId = activeUsers.get(targetUserId);
    
    if (targetSocketId) {
      io.to(targetSocketId).emit('callEnded', {
        userId: socket.userId
      });
      console.log(`📞 Call ended by ${socket.username}`);
    }
  });

  // Reject call
  socket.on('rejectCall', (data) => {
    const { callerId } = data;
    const callerSocketId = activeUsers.get(callerId);
    
    if (callerSocketId) {
      io.to(callerSocketId).emit('callRejected', {
        userId: socket.userId
      });
      console.log(`📞 Call rejected by ${socket.username}`);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.username} (${socket.id})`);
    activeUsers.delete(socket.userId);
    
    // Broadcast user offline status
    io.emit('userOffline', { userId: socket.userId });
  });
});

// Initialize database and start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initDatabase();
    
    server.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║                                        ║
║   💬 NextChat Server Running           ║
║                                        ║
║   🌐 Port: ${PORT}                        ║
║   📡 WebSocket: Enabled                ║
║   🗄️  Database: SQLite3                 ║
║                                        ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
