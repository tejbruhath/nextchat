# 📞 Voice Calling Feature

Complete guide to the voice calling functionality in NextChat.

---

## ✨ Overview

NextChat now supports **peer-to-peer voice calling** using WebRTC technology. Users can make real-time voice calls directly within their chats.

---

## 🎯 Features

### Call Features
- ✅ **One-on-one voice calls**
- ✅ **Real-time audio streaming**
- ✅ **Call controls** (mute, speaker, end call)
- ✅ **Call timer** (shows call duration)
- ✅ **Incoming call notifications**
- ✅ **Answer/Reject incoming calls**
- ✅ **Call status indicators**
- ✅ **Beautiful WhatsApp-style UI**

### Technical Features
- ✅ **WebRTC peer-to-peer connection**
- ✅ **STUN server support**
- ✅ **ICE candidate exchange**
- ✅ **Socket.io signaling**
- ✅ **Automatic microphone access**
- ✅ **Error handling**

---

## 🚀 How to Use

### Making a Call

1. **Open a chat** with the person you want to call
2. **Click the phone icon** (📞) in the chat header
3. **Wait for them to answer**
4. **Start talking!**

### Receiving a Call

1. **Incoming call screen appears** automatically
2. **Click green phone button** to answer
3. **Click red phone button** to reject
4. **Call connects** when you answer

### During a Call

**Controls Available:**
- 🎤 **Mute/Unmute** - Toggle your microphone
- 🔊 **Speaker** - Toggle speaker output
- 📞 **End Call** - Hang up the call

**Call Information:**
- See caller/recipient name
- View call duration timer
- Connection status indicator

---

## 🔧 Technical Implementation

### Architecture

```
User A                    Server                    User B
  │                         │                         │
  │──── callUser ──────────>│                         │
  │                         │──── incomingCall ──────>│
  │                         │                         │
  │                         │<──── answerCall ────────│
  │<──── callAnswered ──────│                         │
  │                         │                         │
  │──── ICE Candidates ────>│──── ICE Candidates ────>│
  │<──── ICE Candidates ────│<──── ICE Candidates ────│
  │                         │                         │
  │<════ WebRTC P2P Audio Connection ═══════════════>│
```

### WebRTC Flow

1. **Caller initiates call**
   - Requests microphone access
   - Creates RTCPeerConnection
   - Generates SDP offer
   - Sends offer via Socket.io

2. **Receiver gets notification**
   - Receives incoming call event
   - Shows call UI
   - Waits for user action

3. **Receiver answers**
   - Requests microphone access
   - Creates RTCPeerConnection
   - Sets remote description (offer)
   - Generates SDP answer
   - Sends answer via Socket.io

4. **Connection established**
   - ICE candidates exchanged
   - Peer-to-peer connection formed
   - Audio streams connected
   - Call becomes active

---

## 📡 Socket.io Events

### Client → Server

#### callUser
Initiate a voice call
```javascript
socket.emit('callUser', {
  chatId: 1,
  targetUserId: 2,
  offer: RTCSessionDescription
});
```

#### answerCall
Answer an incoming call
```javascript
socket.emit('answerCall', {
  callerId: 1,
  answer: RTCSessionDescription
});
```

#### iceCandidate
Exchange ICE candidates
```javascript
socket.emit('iceCandidate', {
  targetUserId: 2,
  candidate: RTCIceCandidate
});
```

#### endCall
End an active call
```javascript
socket.emit('endCall', {
  targetUserId: 2
});
```

#### rejectCall
Reject an incoming call
```javascript
socket.emit('rejectCall', {
  callerId: 1
});
```

### Server → Client

#### incomingCall
Notification of incoming call
```javascript
socket.on('incomingCall', (data) => {
  // data: { chatId, callerId, callerName, offer }
});
```

#### callAnswered
Call was answered
```javascript
socket.on('callAnswered', (data) => {
  // data: { answer, answererId }
});
```

#### iceCandidate
Receive ICE candidate
```javascript
socket.on('iceCandidate', (data) => {
  // data: { candidate, senderId }
});
```

#### callEnded
Call was ended
```javascript
socket.on('callEnded', (data) => {
  // data: { userId }
});
```

#### callRejected
Call was rejected
```javascript
socket.on('callRejected', (data) => {
  // data: { userId }
});
```

#### callError
Error during call
```javascript
socket.on('callError', (data) => {
  // data: { message }
});
```

---

## 🎨 UI Components

### VoiceCall Component

**Location**: `frontend/src/components/VoiceCall.jsx`

**Features:**
- Full-screen call interface
- User avatar display
- Call status text
- Call duration timer
- Control buttons (mute, speaker, end)
- Incoming call UI (answer/reject)
- Beautiful gradient background
- Smooth animations

**States:**
- `connecting` - Establishing connection
- `ringing` - Waiting for answer
- `active` - Call in progress
- `ended` - Call finished

---

## 🔐 Security & Privacy

### Microphone Permissions
- Browser requests permission before accessing microphone
- User must explicitly grant permission
- Permission persists for the session

### Peer-to-Peer
- Audio streams directly between users
- Server only handles signaling
- No audio data stored on server

### STUN Servers
- Uses Google's public STUN servers
- Helps with NAT traversal
- Enables connection through firewalls

---

## 🐛 Troubleshooting

### Call Not Connecting

**Issue**: Call doesn't connect or fails

**Solutions:**
1. Check microphone permissions in browser
2. Ensure both users are online
3. Check internet connection
4. Try refreshing the page
5. Check browser console for errors

### No Audio

**Issue**: Can't hear the other person

**Solutions:**
1. Check speaker/volume settings
2. Ensure speaker is not muted (volume icon)
3. Check browser audio permissions
4. Try different browser
5. Check system audio settings

### Microphone Not Working

**Issue**: Other person can't hear you

**Solutions:**
1. Check microphone permissions
2. Ensure microphone is not muted (mic icon)
3. Test microphone in system settings
4. Try different browser
5. Check if microphone is being used by another app

### User Offline Error

**Issue**: "User is offline" message

**Solutions:**
1. Ensure recipient is logged in
2. Check their internet connection
3. Ask them to refresh the page
4. Wait for them to come online

---

## 🌐 Browser Compatibility

### Supported Browsers

✅ **Chrome** (recommended)
✅ **Firefox**
✅ **Edge**
✅ **Safari** (macOS/iOS)
✅ **Opera**

### Requirements

- Modern browser with WebRTC support
- Microphone access
- Stable internet connection
- HTTPS (for production)

---

## ⚙️ Configuration

### STUN Servers

Default configuration uses Google's STUN servers:
```javascript
const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};
```

### Custom STUN/TURN Servers

For production, you may want to use your own TURN servers:

```javascript
const rtcConfig = {
  iceServers: [
    { urls: 'stun:your-stun-server.com:3478' },
    {
      urls: 'turn:your-turn-server.com:3478',
      username: 'username',
      credential: 'password'
    }
  ]
};
```

---

## 📊 Performance

### Bandwidth Usage
- **Audio only**: ~50-100 kbps
- **Low latency**: < 200ms typical
- **Efficient**: Peer-to-peer connection

### Resource Usage
- **CPU**: Low (audio encoding/decoding)
- **Memory**: Minimal
- **Battery**: Moderate (on mobile)

---

## 🔮 Future Enhancements

### Planned Features
- ⬜ Video calling
- ⬜ Group voice calls
- ⬜ Screen sharing
- ⬜ Call recording
- ⬜ Call history
- ⬜ Voicemail
- ⬜ Call quality indicators
- ⬜ Echo cancellation settings
- ⬜ Noise suppression
- ⬜ Background blur (for video)

---

## 📝 Code Examples

### Starting a Call

```javascript
// In ChatWindow component
const startVoiceCall = () => {
  setIsInCall(true);
};

// VoiceCall component handles the rest
```

### Handling Incoming Call

```javascript
// Listen for incoming calls
socket.on('incomingCall', (data) => {
  if (data.chatId === chat.id) {
    setIncomingCall(data);
    setIsInCall(true);
  }
});
```

### Muting Microphone

```javascript
const toggleMute = () => {
  if (localStream.current) {
    const audioTrack = localStream.current.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    setIsMuted(!audioTrack.enabled);
  }
};
```

---

## 🎓 Learning Resources

### WebRTC
- [WebRTC Official Site](https://webrtc.org/)
- [MDN WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [WebRTC Samples](https://webrtc.github.io/samples/)

### Socket.io
- [Socket.io Documentation](https://socket.io/docs/)
- [Socket.io WebRTC Example](https://socket.io/get-started/private-messaging-part-1/)

---

## ✅ Testing Checklist

- [ ] Make a call from User A to User B
- [ ] Answer call on User B
- [ ] Verify audio works both ways
- [ ] Test mute/unmute
- [ ] Test speaker on/off
- [ ] End call from caller side
- [ ] End call from receiver side
- [ ] Reject incoming call
- [ ] Test with user offline
- [ ] Test microphone permissions
- [ ] Test call duration timer
- [ ] Test multiple browsers
- [ ] Test on mobile devices

---

## 🆘 Support

### Common Issues

1. **Microphone permission denied**
   - Grant permission in browser settings
   - Reload the page

2. **Connection fails**
   - Check firewall settings
   - Ensure WebRTC is enabled
   - Try different network

3. **Poor audio quality**
   - Check internet speed
   - Close other applications
   - Move closer to router

---

## 📈 Statistics

### Implementation
- **Lines of Code**: ~400 (VoiceCall component)
- **Backend Events**: 5 events
- **Frontend Events**: 6 event listeners
- **Dependencies**: Native WebRTC API

### Features
- **Call States**: 4 states
- **Controls**: 3 buttons (mute, speaker, end)
- **UI Screens**: 3 screens (ringing, active, incoming)

---

**Voice calling is now live in NextChat! 📞✨**

Make your first call and experience real-time communication!
