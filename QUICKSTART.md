# ⚡ NextChat Quick Start

Get up and running in 5 minutes!

---

## 🚀 Super Quick Start

### Windows Users (Easiest Method)

1. **Double-click** `start.bat` in the project folder
2. Wait for both servers to start
3. Open browser to `http://localhost:5173`
4. Register and start chatting!

---

## 📦 Manual Installation

### 1️⃣ Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2️⃣ Start Servers

**Option A: Both at once (from root directory)**
```bash
npm run dev
```

**Option B: Separate terminals**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 3️⃣ Open Browser

Navigate to: `http://localhost:5173`

---

## 👤 First Steps

1. **Register** a new account
2. **Open incognito window** and register another account
3. **Click "New Chat"** and enter the other username
4. **Start messaging!**

---

## 💡 Quick Tips

### Sending Messages
- Type and press **Enter** to send
- **Shift + Enter** for new line
- Click **paperclip** icon to attach files

### File Sharing
- Supports: images, videos, audio, documents
- Max size: 50MB
- Preview before sending

### Typing Indicators
- Start typing to show "typing..." to others
- Stops automatically after 1 second of inactivity

### Multiple Users
- Use different browsers (Chrome, Firefox, Edge)
- Use incognito/private windows
- Use different devices on same network

---

## 🔧 Common Commands

### Backend Commands
```bash
cd backend
npm start          # Start server
npm install        # Install dependencies
```

### Frontend Commands
```bash
cd frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm install        # Install dependencies
```

### Full Project Commands (from root)
```bash
npm run dev        # Start both servers
npm run install-all # Install all dependencies
```

---

## 🌐 URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

---

## 📁 Important Files

```
backend/
  server.js         # Main server
  .env              # Configuration (change JWT_SECRET!)
  chat.db           # Database (auto-created)
  uploads/          # Media files

frontend/
  src/
    pages/
      Login.jsx     # Login/Register
      Chat.jsx      # Main chat page
    components/     # UI components
```

---

## 🐛 Quick Fixes

### Port Already in Use
Change port in `backend/.env`:
```env
PORT=5001
```

### Can't Connect
1. Check both servers are running
2. Check browser console (F12)
3. Restart servers

### Database Issues
Delete `backend/chat.db` and restart

### Missing Dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

## 🎯 Testing Checklist

- [ ] Register new account
- [ ] Login with account
- [ ] Create new chat
- [ ] Send text message
- [ ] Send image
- [ ] See typing indicator
- [ ] Open in second browser
- [ ] Chat between two accounts
- [ ] Check real-time updates

---

## 📱 Features at a Glance

✅ Real-time messaging
✅ File sharing
✅ Typing indicators
✅ Read receipts
✅ Message history
✅ User authentication
✅ WhatsApp-style UI
✅ Multiple chat support

---

## 🆘 Need Help?

1. Check `SETUP.md` for detailed instructions
2. Check `FEATURES.md` for feature list
3. Check `README.md` for overview
4. Look at console logs for errors

---

## 🎉 That's It!

You're ready to use NextChat. Happy chatting! 💬

---

**Pro Tip**: Keep both terminal windows open to see server logs and debug any issues.
