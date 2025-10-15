# 💬 NextChat

A full-stack **WhatsApp-style real-time chat application** built with Node.js, React, Socket.io, and SQLite3.

## ✨ Features

- 🔐 User authentication (register/login)
- 💬 Real-time messaging with WebSocket
- 👥 Group chats support
- 📸 Image/video/audio sharing
- ⏰ Message timestamps
- ✅ Read receipts
- ✍️ Typing indicators
- 🎨 Modern WhatsApp-like UI

## 🛠️ Tech Stack

**Frontend:**
- React + Vite
- Tailwind CSS
- Socket.io Client
- Lucide React (icons)

**Backend:**
- Node.js + Express
- Socket.io
- SQLite3
- JWT Authentication
- Multer (file uploads)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd nextchat
```

2. **Install all dependencies**
```bash
npm run install-all
```

3. **Configure environment variables**
Edit `backend/.env` and set your JWT secret:
```
JWT_SECRET=your_super_secret_jwt_key
```

4. **Run the application**
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend dev server on `http://localhost:5173`

### Manual Setup

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
nextchat/
├── backend/
│   ├── server.js           # Main server file
│   ├── db.js               # Database initialization
│   ├── middleware/
│   │   └── auth.js         # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js         # Auth routes (login/register)
│   │   ├── chats.js        # Chat management routes
│   │   ├── messages.js     # Message routes
│   │   └── upload.js       # File upload routes
│   ├── uploads/            # Media storage folder
│   └── chat.db             # SQLite database (auto-created)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   └── FilePreview.jsx
│   │   ├── pages/
│   │   │   ├── Chat.jsx
│   │   │   └── Login.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🗄️ Database Schema

**users**
- id, username, password (hashed), avatar

**chats**
- id, name, is_group

**chat_members**
- chat_id, user_id

**messages**
- id, chat_id, sender_id, text, media_url, created_at

## 🎯 Usage

1. **Register a new account** on the login page
2. **Create a new chat** or select an existing one
3. **Send messages** with text or media files
4. **Real-time updates** - messages appear instantly for all participants

## 🔐 Authentication

- JWT-based authentication
- Passwords hashed with bcrypt
- Token stored in localStorage
- Protected API routes with middleware

## 📸 Media Support

- Upload images, videos, and audio files
- Files stored locally in `/uploads` folder
- Automatic preview in chat window
- Supported formats: jpg, png, gif, mp4, mp3, etc.

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Chats
- `GET /api/chats` - Get user's chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/:id/messages` - Get chat messages

### Upload
- `POST /api/upload` - Upload media file

### WebSocket Events
- `joinChat` - Join a chat room
- `sendMessage` - Send a message
- `receiveMessage` - Receive a message
- `typing` - Typing indicator
- `stopTyping` - Stop typing indicator

## 🎨 UI Components

- **Sidebar**: Chat list with last message preview
- **ChatWindow**: Message display area
- **ChatInput**: Text input with file upload
- **MessageBubble**: Individual message component
- **FilePreview**: Media preview component

## 📝 License

MIT

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

Built with ❤️ using Node.js and React
