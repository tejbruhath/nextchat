# 🏗️ NextChat Architecture

Detailed architecture and system design documentation.

---

## 🎯 System Overview

NextChat is a **three-tier architecture** application with real-time capabilities.

---

## 📊 Component Interaction

### Frontend Components
- **Login.jsx** - Authentication UI
- **Chat.jsx** - Main chat container
- **Sidebar.jsx** - Chat list and search
- **ChatWindow.jsx** - Message display area
- **ChatInput.jsx** - Message composition
- **MessageBubble.jsx** - Individual message
- **FilePreview.jsx** - Media display

### Backend Modules
- **server.js** - Express + Socket.io server
- **db.js** - Database initialization
- **auth.js** - JWT middleware
- **routes/** - API endpoints
- **uploads/** - File storage

---

## 🔐 Security Architecture

### Authentication Flow
1. User submits credentials
2. Server validates and hashes password
3. JWT token generated (7-day expiry)
4. Token stored in localStorage
5. Token sent with each request
6. Server validates token
7. Access granted/denied

### Data Protection
- Passwords hashed with bcrypt
- SQL injection prevention
- File type validation
- CORS configuration
- Token expiration

---

## 🚀 Real-time Architecture

### WebSocket Connection
- Socket.io for bidirectional communication
- JWT authentication on connection
- Room-based message broadcasting
- Event-driven architecture

### Events
- **Client → Server**: sendMessage, typing, joinChat
- **Server → Client**: receiveMessage, userTyping, userOnline

---

## 📁 File Storage

### Upload Process
1. Client selects file
2. Multer middleware processes upload
3. File saved to `/uploads` directory
4. Path stored in database
5. URL returned to client
6. Displayed in chat

---

## 🗄️ Database Schema

### Tables
- **users** - User accounts
- **chats** - Chat rooms
- **chat_members** - Many-to-many relationship
- **messages** - All messages with media URLs

### Relationships
- Users ↔ Chats (many-to-many via chat_members)
- Chats → Messages (one-to-many)
- Users → Messages (one-to-many)

---

## 🎨 UI/UX Design

### Design Principles
- WhatsApp-inspired interface
- Clean, minimal design
- Responsive layout
- Smooth animations
- Intuitive navigation

### Color Scheme
- Primary: WhatsApp Green (#25D366)
- Secondary: Teal (#075E54)
- Message: Light Green (#DCF8C6)
- Background: Gray shades

---

## 📈 Scalability Considerations

### Current Architecture
- Single server instance
- SQLite database
- Local file storage
- In-memory socket connections

### Future Scaling Options
- Load balancer for multiple servers
- PostgreSQL/MySQL for production
- S3/CDN for file storage
- Redis for session management
- Socket.io Redis adapter for clustering

---

**Built for performance, security, and scalability.**
