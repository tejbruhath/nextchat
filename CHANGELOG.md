# 📝 NextChat Changelog

## [Feature] Voice Calling - Oct 15, 2025

### ✨ New Feature: Voice Calling

**Major Update**: Added complete voice calling functionality using WebRTC!

### 🎯 What's New

#### Voice Calling Features
- ✅ **One-on-one voice calls** - Call any user directly from chat
- ✅ **Real-time audio** - Crystal clear peer-to-peer audio streaming
- ✅ **Call controls** - Mute, speaker, and end call buttons
- ✅ **Call timer** - See how long you've been talking
- ✅ **Incoming call UI** - Beautiful notification with answer/reject options
- ✅ **Call status** - See connection status and call state
- ✅ **WhatsApp-style UI** - Familiar and intuitive interface

### 📁 Files Added

#### Frontend
- ✅ `frontend/src/components/VoiceCall.jsx` - Complete voice call component (~400 lines)

#### Backend
- ✅ Added WebRTC signaling events to `backend/server.js`
  - `callUser` - Initiate call
  - `answerCall` - Answer call
  - `iceCandidate` - Exchange ICE candidates
  - `endCall` - End call
  - `rejectCall` - Reject call

#### Documentation
- ✅ `VOICE_CALLING.md` - Complete voice calling guide

### 🔧 Files Modified

#### Frontend
- ✅ `frontend/src/components/ChatWindow.jsx`
  - Added phone button in header
  - Added call state management
  - Added incoming call listener
  - Integrated VoiceCall component

#### Backend
- ✅ `backend/routes/chats.js`
  - Added `other_user_id` to chat data for calls

### 🎯 How It Works

1. **Click phone icon** in chat header
2. **WebRTC connection** established via signaling
3. **Peer-to-peer audio** streams directly between users
4. **Server handles** only signaling (no audio data)
5. **STUN servers** help with NAT traversal

### 🔐 Technology

- **WebRTC** - Peer-to-peer audio streaming
- **Socket.io** - Signaling server
- **RTCPeerConnection** - WebRTC API
- **getUserMedia** - Microphone access
- **STUN servers** - Google's public STUN servers

### 📊 Technical Details

**WebRTC Events:**
- Offer/Answer SDP exchange
- ICE candidate exchange
- Track handling for audio streams

**Call States:**
- `connecting` - Establishing connection
- `ringing` - Waiting for answer
- `active` - Call in progress
- `ended` - Call finished

### 🎨 UI Features

- Full-screen call interface
- User avatar display
- Call duration timer
- Mute/unmute button
- Speaker on/off button
- End call button
- Incoming call screen
- Beautiful gradient background
- Smooth animations

### 🧪 Testing

To test voice calling:
1. Open two browser windows
2. Log in as different users
3. Start a chat
4. Click phone icon in one window
5. Answer in the other window
6. Test audio both ways!

### 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari
- ✅ Opera

### ⚠️ Requirements

- Modern browser with WebRTC support
- Microphone access permission
- Stable internet connection
- HTTPS in production

### 🔮 Future Enhancements

- Video calling
- Group voice calls
- Screen sharing
- Call recording
- Call history

---

## [Update] Real-time Chat List Updates - Oct 15, 2025

### 🐛 Bug Fixed
**Issue**: Users had to refresh the page to see new chat messages in the sidebar

**Solution**: Implemented real-time chat list updates

### ✨ Changes Made

#### Frontend (`frontend/src/pages/Chat.jsx`)
- ✅ Added WebSocket listener for `receiveMessage` event in Chat component
- ✅ Automatically updates chat list when new messages arrive
- ✅ Updates last message text and timestamp in real-time
- ✅ Automatically sorts chats by most recent message
- ✅ Handles new chat creation (when someone messages you for the first time)

#### Backend (`backend/server.js`)
- ✅ Auto-joins users to all their chats on connection
- ✅ Ensures users receive real-time updates for all conversations
- ✅ Improved connection logging

### 🎯 What This Fixes

**Before:**
- Chat list only updated on page refresh
- Last message didn't update in real-time
- Had to manually refresh to see new conversations

**After:**
- ✅ Chat list updates instantly when messages arrive
- ✅ Last message updates in real-time
- ✅ Chat order automatically adjusts (most recent on top)
- ✅ New chats appear automatically
- ✅ Works even if you're not viewing that specific chat

### 🚀 How It Works

1. **On Connection**: User automatically joins all their chat rooms
2. **On Message**: 
   - All participants receive the message via WebSocket
   - Chat list updates with new last message
   - Chats re-sort by most recent activity
3. **New Chat**: If it's a new conversation, chat list refreshes completely

### 📊 Technical Details

**WebSocket Events Used:**
- `receiveMessage` - Listens for incoming messages
- Auto-join on connection - Joins all user's chats

**State Management:**
- Uses React state updates with functional updates
- Sorts chats by timestamp
- Handles both existing and new chats

### 🧪 Testing

To test the fix:
1. Open two browser windows (or incognito)
2. Log in as different users
3. Send a message from User A
4. Check User B's sidebar - should update instantly!
5. Last message and time should update without refresh

### ⚡ Performance

- Minimal overhead (only updates affected chat)
- Efficient sorting algorithm
- No unnecessary re-renders
- Scales well with multiple chats

---

## Previous Features

All original features remain intact:
- ✅ Real-time messaging
- ✅ File sharing
- ✅ Typing indicators
- ✅ Read receipts
- ✅ User authentication
- ✅ WhatsApp-style UI

---

**Status**: ✅ Fixed and tested
**Version**: 1.1
**Date**: Oct 15, 2025
