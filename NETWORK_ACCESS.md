# 🌐 Network Access Guide

How to access NextChat from other devices on your local network.

---

## 🎯 Overview

By default, NextChat runs on `localhost` which is only accessible from your computer. To access it from your phone or other devices on the same WiFi network, you need to configure it to use your computer's IP address.

---

## 📋 Quick Setup (3 Steps)

### Step 1: Find Your Computer's IP Address

**On Windows (PowerShell):**
```powershell
ipconfig
```

Look for **IPv4 Address** under your active network adapter (usually WiFi or Ethernet).

Example output:
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

Your IP will be something like: `192.168.1.100` or `192.168.0.100`

---

### Step 2: Update Backend Configuration

**Edit `backend/.env`:**
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
FRONTEND_URL=http://192.168.1.100:5173
```

Replace `192.168.1.100` with your actual IP address.

---

### Step 3: Update Frontend Socket Connection

**Edit `frontend/src/pages/Chat.jsx`:**

Find this line (around line 22):
```javascript
const newSocket = io('http://localhost:5000', {
```

Change to:
```javascript
const newSocket = io('http://192.168.1.100:5000', {
```

Replace `192.168.1.100` with your actual IP address.

---

## 🚀 Start the Servers

### Backend
```powershell
cd backend
npm start
```

The backend will be accessible at: `http://192.168.1.100:5000`

### Frontend

**Edit `frontend/vite.config.js`:**

Change from:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
```

To:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Add this line
    port: 5173,
    proxy: {
```

Then start:
```powershell
cd frontend
npm run dev
```

---

## 📱 Access from Other Devices

### From Your Phone or Tablet

1. **Connect to same WiFi** as your computer
2. **Open browser** on your phone
3. **Navigate to**: `http://192.168.1.100:5173`
   (Replace with your IP)

### From Another Computer

1. **Connect to same network**
2. **Open browser**
3. **Navigate to**: `http://192.168.1.100:5173`

---

## 🔥 Windows Firewall Configuration

Windows Firewall might block incoming connections. Here's how to allow them:

### Option 1: Allow Node.js (Recommended)

1. Open **Windows Defender Firewall**
2. Click **Allow an app through firewall**
3. Click **Change settings**
4. Find **Node.js** in the list
5. Check both **Private** and **Public**
6. Click **OK**

### Option 2: Create Firewall Rules

**For Backend (Port 5000):**
```powershell
netsh advfirewall firewall add rule name="NextChat Backend" dir=in action=allow protocol=TCP localport=5000
```

**For Frontend (Port 5173):**
```powershell
netsh advfirewall firewall add rule name="NextChat Frontend" dir=in action=allow protocol=TCP localport=5173
```

### Option 3: Temporarily Disable Firewall (Testing Only)

⚠️ **Not recommended for security reasons**

1. Open Windows Security
2. Firewall & network protection
3. Turn off for Private network (temporarily)

---

## 🔧 Complete Configuration Files

### backend/.env
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
FRONTEND_URL=http://192.168.1.100:5173
```

### frontend/vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Listen on all network interfaces
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

### frontend/src/pages/Chat.jsx

Find and update the socket connection:
```javascript
// Around line 22
const newSocket = io('http://192.168.1.100:5000', {
  auth: { token }
});
```

---

## 🧪 Testing Network Access

### Test Backend
Open browser on another device and visit:
```
http://192.168.1.100:5000/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "NextChat server is running"
}
```

### Test Frontend
Open browser and visit:
```
http://192.168.1.100:5173
```

You should see the NextChat login page.

---

## 📱 Mobile Testing

### On Your Phone

1. **Connect to WiFi** (same network as computer)
2. **Open browser** (Chrome, Safari, etc.)
3. **Type**: `http://YOUR_IP:5173`
4. **Register/Login** and test!

### Features That Work on Mobile

- ✅ Login/Register
- ✅ Send messages
- ✅ Receive messages in real-time
- ✅ File uploads (photos from phone)
- ✅ Voice calling (with microphone permission)
- ✅ Typing indicators
- ✅ All UI features

---

## 🔐 Security Considerations

### For Local Network Use

✅ **Safe:**
- Using on your home WiFi
- Testing with friends on same network
- Development and testing

⚠️ **Be Careful:**
- Public WiFi networks
- Untrusted networks
- Exposing to internet

### For Internet Access

If you want to access from anywhere (not just local network), you need:

1. **Port forwarding** on your router
2. **Dynamic DNS** service
3. **HTTPS** with SSL certificate
4. **Stronger security** measures

**Not recommended** for beginners - use a hosting service instead.

---

## 🐛 Troubleshooting

### Issue 1: Can't Connect from Phone

**Check:**
- [ ] Both devices on same WiFi
- [ ] Used correct IP address
- [ ] Firewall allows connections
- [ ] Backend server is running
- [ ] Frontend server is running

**Test:**
```powershell
# On your computer, check if servers are running
netstat -an | findstr "5000"
netstat -an | findstr "5173"
```

---

### Issue 2: "Connection Refused"

**Solution:**
1. Check firewall settings
2. Ensure `host: '0.0.0.0'` in vite.config.js
3. Restart both servers
4. Try pinging your computer from phone

---

### Issue 3: WebSocket Not Connecting

**Solution:**

Update the socket connection to use your IP:

```javascript
// In Chat.jsx
const newSocket = io('http://192.168.1.100:5000', {
  auth: { token },
  transports: ['websocket', 'polling']  // Add this
});
```

---

### Issue 4: "ERR_CONNECTION_TIMED_OUT"

**Possible causes:**
1. Firewall blocking
2. Wrong IP address
3. Servers not running
4. Different networks

**Solution:**
```powershell
# Check if port is open
Test-NetConnection -ComputerName 192.168.1.100 -Port 5173
Test-NetConnection -ComputerName 192.168.1.100 -Port 5000
```

---

## 📊 Network Architecture

```
┌─────────────────────────────────────────────────┐
│         Your Computer (192.168.1.100)           │
│                                                 │
│  ┌──────────────┐      ┌──────────────┐        │
│  │   Backend    │      │   Frontend   │        │
│  │  Port 5000   │      │  Port 5173   │        │
│  └──────────────┘      └──────────────┘        │
│         ↑                      ↑                │
└─────────┼──────────────────────┼────────────────┘
          │                      │
          │   Local Network      │
          │   (WiFi Router)      │
          │                      │
    ┌─────┴──────────────────────┴─────┐
    │                                   │
    ↓                                   ↓
┌─────────┐                      ┌──────────┐
│  Phone  │                      │  Laptop  │
│ Browser │                      │ Browser  │
└─────────┘                      └──────────┘
```

---

## 🎯 Quick Reference

### Your URLs (Replace IP)

- **Frontend**: `http://192.168.1.100:5173`
- **Backend API**: `http://192.168.1.100:5000`
- **Health Check**: `http://192.168.1.100:5000/api/health`

### Files to Update

1. `backend/.env` - Add FRONTEND_URL
2. `frontend/vite.config.js` - Add `host: '0.0.0.0'`
3. `frontend/src/pages/Chat.jsx` - Update socket URL

### Firewall Ports

- Port **5000** - Backend
- Port **5173** - Frontend

---

## 📝 Step-by-Step Checklist

- [ ] Find your IP address (`ipconfig`)
- [ ] Update `backend/.env` with IP
- [ ] Update `frontend/vite.config.js` with `host: '0.0.0.0'`
- [ ] Update `frontend/src/pages/Chat.jsx` socket URL
- [ ] Configure Windows Firewall
- [ ] Restart backend server
- [ ] Restart frontend server
- [ ] Test on computer browser
- [ ] Test on phone browser
- [ ] Test voice calling on phone

---

## 🚀 Ready to Go!

Once configured, anyone on your network can:

1. Open browser
2. Go to `http://YOUR_IP:5173`
3. Register/Login
4. Start chatting!

---

## 💡 Pro Tips

### Tip 1: Static IP
Set a static IP on your computer so it doesn't change:
- Windows Settings → Network → WiFi → Properties
- Edit IP settings → Manual → Set static IP

### Tip 2: Bookmark on Phone
Add to home screen for easy access:
- Chrome: Menu → Add to Home Screen
- Safari: Share → Add to Home Screen

### Tip 3: QR Code
Create a QR code with your URL for easy sharing:
- Visit: https://www.qr-code-generator.com/
- Enter: `http://YOUR_IP:5173`
- Share QR code with friends

---

**Now you can access NextChat from any device on your network! 📱💻🎉**
