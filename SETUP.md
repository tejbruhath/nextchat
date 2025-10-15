# 🚀 NextChat Setup Guide

Complete step-by-step guide to get NextChat running on your machine.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for version control)

Check your installations:
```bash
node --version
npm --version
```

---

## 📥 Installation

### Step 1: Navigate to Project Directory

```bash
cd c:/Users/tej/code/chat
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- express
- socket.io
- sqlite & sqlite3
- multer
- bcryptjs
- jsonwebtoken
- cors
- dotenv

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

This will install:
- react & react-dom
- socket.io-client
- lucide-react
- react-router-dom
- vite
- tailwindcss

### Step 4: Configure Environment Variables

The `.env` file is already created in `backend/.env`. You can modify it if needed:

```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**⚠️ IMPORTANT:** Change the `JWT_SECRET` to a strong, random string in production!

---

## 🏃 Running the Application

### Option 1: Run Everything at Once (Recommended)

From the root directory (`c:/Users/tej/code/chat`):

```bash
npm run install-all  # First time only
npm run dev
```

This will start both backend and frontend servers concurrently.

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🌐 Access the Application

Once running, open your browser and navigate to:

```
http://localhost:5173
```

The backend API will be running on:
```
http://localhost:5000
```

---

## 👤 Creating Your First Account

1. Open `http://localhost:5173` in your browser
2. Click on **Register** tab
3. Enter a username and password (minimum 6 characters)
4. Click **Register**
5. You'll be automatically logged in

---

## 💬 Starting Your First Chat

1. **Create a second account** (open in incognito/private window):
   - Register with a different username
   
2. **Start a chat**:
   - Click the **"New Chat"** button
   - Enter the username of the other account
   - Click **"Start Chat"**

3. **Send messages**:
   - Type your message in the input box
   - Press Enter or click the send button
   - Messages appear in real-time!

---

## 📸 Sending Media Files

1. Click the **paperclip icon** in the chat input
2. Select an image, video, or audio file
3. Preview will appear above the input
4. Add optional text message
5. Click **Send**

**Supported formats:**
- Images: jpg, jpeg, png, gif
- Videos: mp4
- Audio: mp3, wav
- Documents: pdf, doc, docx

**File size limit:** 50MB

---

## 🔧 Troubleshooting

### Port Already in Use

If you see an error like "Port 5000 is already in use":

1. Change the port in `backend/.env`:
   ```env
   PORT=5001
   ```

2. Update the socket connection in `frontend/src/pages/Chat.jsx`:
   ```javascript
   const newSocket = io('http://localhost:5001', {
   ```

### Database Issues

If you encounter database errors:

1. Delete the database file:
   ```bash
   rm backend/chat.db
   ```

2. Restart the backend server (database will be recreated)

### Connection Issues

If messages aren't sending in real-time:

1. Check that both backend and frontend are running
2. Open browser console (F12) and check for errors
3. Verify WebSocket connection in Network tab

### Module Not Found Errors

If you see "Cannot find module" errors:

```bash
# In backend directory
cd backend
npm install

# In frontend directory
cd frontend
npm install
```

---

## 🗂️ Project Structure

```
nextchat/
├── backend/
│   ├── server.js              # Main server file
│   ├── db.js                  # Database setup
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   ├── routes/
│   │   ├── auth.js            # Login/register routes
│   │   ├── chats.js           # Chat management
│   │   └── upload.js          # File upload
│   ├── uploads/               # Media storage
│   └── chat.db                # SQLite database (auto-created)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx    # Chat list
│   │   │   ├── ChatWindow.jsx # Message display
│   │   │   ├── ChatInput.jsx  # Message input
│   │   │   ├── MessageBubble.jsx
│   │   │   └── FilePreview.jsx
│   │   ├── pages/
│   │   │   ├── Chat.jsx       # Main chat page
│   │   │   └── Login.jsx      # Login/register page
│   │   └── App.jsx            # Root component
│   └── package.json
│
└── README.md
```

---

## 🎨 Features Included

✅ User authentication (JWT)
✅ Real-time messaging (Socket.io)
✅ Direct chats
✅ Group chat support (backend ready)
✅ File sharing (images, videos, audio)
✅ Typing indicators
✅ Message timestamps
✅ Read receipts
✅ WhatsApp-style UI
✅ Responsive design

---

## 🔐 Security Notes

- Passwords are hashed with bcrypt
- JWT tokens expire after 7 days
- File uploads are validated and size-limited
- SQL injection protection via parameterized queries

---

## 📱 Testing with Multiple Users

### Method 1: Multiple Browsers
- Open Chrome for User 1
- Open Firefox for User 2
- Register different accounts in each

### Method 2: Incognito Windows
- Open regular window for User 1
- Open incognito window for User 2
- Register different accounts

### Method 3: Multiple Devices
- Access from your computer
- Access from your phone (use your computer's IP)
- Update frontend socket connection to use your IP

---

## 🛠️ Development Commands

### Backend
```bash
cd backend
npm start          # Start server
npm run dev        # Start with auto-reload (if configured)
```

### Frontend
```bash
cd frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## 📊 Database Management

The SQLite database is located at `backend/chat.db`.

To view/edit the database, you can use:
- [DB Browser for SQLite](https://sqlitebrowser.org/)
- [SQLite Viewer VSCode Extension](https://marketplace.visualstudio.com/items?itemName=alexcvzz.vscode-sqlite)

### Database Tables

1. **users** - User accounts
2. **chats** - Chat rooms
3. **chat_members** - Chat participants
4. **messages** - All messages

---

## 🚀 Next Steps

Now that you have NextChat running:

1. **Customize the UI** - Edit Tailwind classes in components
2. **Add features** - Group chats, message search, etc.
3. **Deploy** - Host on a server for production use
4. **Enhance security** - Add rate limiting, input validation

---

## 💡 Tips

- Keep the backend running while testing
- Use browser DevTools to debug issues
- Check console logs for errors
- Messages are stored in SQLite database
- Uploaded files are in `backend/uploads/`

---

## 🆘 Need Help?

If you encounter issues:

1. Check the console logs (both backend and frontend)
2. Verify all dependencies are installed
3. Ensure ports 5000 and 5173 are available
4. Try restarting both servers

---

## 🎉 You're All Set!

Enjoy using NextChat! Start chatting with friends in real-time.

**Happy Chatting! 💬**
