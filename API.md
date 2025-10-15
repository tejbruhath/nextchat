# 🔌 NextChat API Documentation

Complete API reference for NextChat backend.

---

## 🌐 Base URL

```
http://localhost:5000
```

---

## 🔐 Authentication

Most endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 📡 REST API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepass123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `400` - Username and password are required
- `400` - Password must be at least 6 characters
- `409` - Username already exists
- `500` - Failed to register user

---

#### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepass123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "avatar": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `400` - Username and password are required
- `401` - Invalid username or password
- `500` - Failed to login

---

#### Get Current User
```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "avatar": null
  }
}
```

**Errors:**
- `401` - Access token required
- `403` - Invalid or expired token
- `404` - User not found
- `500` - Failed to get user

---

### Chat Endpoints

#### Get All Chats
```http
GET /api/chats
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "chats": [
    {
      "id": 1,
      "name": null,
      "is_group": 0,
      "created_at": "2024-01-15T10:30:00.000Z",
      "other_username": "jane_doe",
      "last_message": "Hey, how are you?",
      "last_message_time": "2024-01-15T10:35:00.000Z"
    }
  ]
}
```

**Errors:**
- `401` - Access token required
- `403` - Invalid or expired token
- `500` - Failed to get chats

---

#### Create New Chat
```http
POST /api/chats
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (Direct Chat):**
```json
{
  "isGroup": false,
  "memberIds": [2]
}
```

**Request Body (Group Chat):**
```json
{
  "name": "Project Team",
  "isGroup": true,
  "memberIds": [2, 3, 4]
}
```

**Response (201):**
```json
{
  "chatId": 1,
  "message": "Chat created successfully"
}
```

**Response (200) - If chat already exists:**
```json
{
  "chatId": 1,
  "message": "Chat already exists"
}
```

**Errors:**
- `401` - Access token required
- `403` - Invalid or expired token
- `500` - Failed to create chat

---

#### Get Chat Messages
```http
GET /api/chats/:chatId/messages
```

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `chatId` (path) - The ID of the chat

**Response (200):**
```json
{
  "messages": [
    {
      "id": 1,
      "chat_id": 1,
      "sender_id": 1,
      "text": "Hello!",
      "media_url": null,
      "media_type": null,
      "is_read": 1,
      "created_at": "2024-01-15T10:30:00.000Z",
      "sender_username": "john_doe"
    },
    {
      "id": 2,
      "chat_id": 1,
      "sender_id": 2,
      "text": "Hi there!",
      "media_url": "/uploads/1234567890-image.jpg",
      "media_type": "image",
      "is_read": 0,
      "created_at": "2024-01-15T10:31:00.000Z",
      "sender_username": "jane_doe"
    }
  ]
}
```

**Errors:**
- `401` - Access token required
- `403` - Not a member of this chat
- `500` - Failed to get messages

---

#### Search Users
```http
GET /api/chats/users/search?query=john
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `query` (required) - Search term for username

**Response (200):**
```json
{
  "users": [
    {
      "id": 1,
      "username": "john_doe",
      "avatar": null
    },
    {
      "id": 3,
      "username": "johnny_smith",
      "avatar": null
    }
  ]
}
```

**Errors:**
- `400` - Search query required
- `401` - Access token required
- `403` - Invalid or expired token
- `500` - Failed to search users

---

### Upload Endpoint

#### Upload File
```http
POST /api/upload
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file` (required) - The file to upload

**Response (200):**
```json
{
  "message": "File uploaded successfully",
  "filePath": "/uploads/1234567890-image.jpg",
  "mediaType": "image",
  "filename": "1234567890-image.jpg",
  "originalName": "vacation.jpg",
  "size": 245678
}
```

**File Restrictions:**
- Max size: 50MB
- Allowed types: jpeg, jpg, png, gif, mp4, mp3, wav, pdf, doc, docx

**Errors:**
- `400` - No file uploaded
- `400` - Invalid file type
- `401` - Access token required
- `403` - Invalid or expired token
- `500` - Failed to upload file

---

### Health Check

#### Server Health
```http
GET /api/health
```

**Response (200):**
```json
{
  "status": "ok",
  "message": "NextChat server is running"
}
```

---

## 🔌 WebSocket Events

### Connection

Connect to WebSocket server:
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

---

### Client → Server Events

#### Join Chat
```javascript
socket.emit('joinChat', chatId);
```

**Parameters:**
- `chatId` (number) - The ID of the chat to join

---

#### Leave Chat
```javascript
socket.emit('leaveChat', chatId);
```

**Parameters:**
- `chatId` (number) - The ID of the chat to leave

---

#### Send Message
```javascript
socket.emit('sendMessage', {
  chatId: 1,
  text: 'Hello!',
  mediaUrl: '/uploads/image.jpg',  // optional
  mediaType: 'image'                // optional
});
```

**Parameters:**
- `chatId` (number, required) - The chat ID
- `text` (string, optional) - Message text
- `mediaUrl` (string, optional) - URL to uploaded media
- `mediaType` (string, optional) - Type of media (image, video, audio)

---

#### Typing Indicator
```javascript
socket.emit('typing', {
  chatId: 1
});
```

**Parameters:**
- `chatId` (number) - The chat ID

---

#### Stop Typing
```javascript
socket.emit('stopTyping', {
  chatId: 1
});
```

**Parameters:**
- `chatId` (number) - The chat ID

---

#### Mark Messages as Read
```javascript
socket.emit('markAsRead', {
  chatId: 1
});
```

**Parameters:**
- `chatId` (number) - The chat ID

---

### Server → Client Events

#### Receive Message
```javascript
socket.on('receiveMessage', (message) => {
  console.log(message);
});
```

**Message Object:**
```json
{
  "id": 1,
  "chat_id": 1,
  "sender_id": 2,
  "sender_username": "jane_doe",
  "text": "Hello!",
  "media_url": null,
  "media_type": null,
  "is_read": false,
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

---

#### User Typing
```javascript
socket.on('userTyping', (data) => {
  console.log(`${data.username} is typing...`);
});
```

**Data Object:**
```json
{
  "chatId": 1,
  "userId": 2,
  "username": "jane_doe"
}
```

---

#### User Stopped Typing
```javascript
socket.on('userStoppedTyping', (data) => {
  console.log('User stopped typing');
});
```

**Data Object:**
```json
{
  "chatId": 1,
  "userId": 2
}
```

---

#### Messages Read
```javascript
socket.on('messagesRead', (data) => {
  console.log('Messages marked as read');
});
```

**Data Object:**
```json
{
  "chatId": 1,
  "userId": 2
}
```

---

#### User Online
```javascript
socket.on('userOnline', (data) => {
  console.log(`${data.username} is online`);
});
```

**Data Object:**
```json
{
  "userId": 2,
  "username": "jane_doe"
}
```

---

#### User Offline
```javascript
socket.on('userOffline', (data) => {
  console.log('User went offline');
});
```

**Data Object:**
```json
{
  "userId": 2
}
```

---

#### Error
```javascript
socket.on('error', (error) => {
  console.error(error.message);
});
```

**Error Object:**
```json
{
  "message": "Error description"
}
```

---

#### Connection Events
```javascript
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});
```

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  avatar TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Chats Table
```sql
CREATE TABLE chats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  is_group BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Chat Members Table
```sql
CREATE TABLE chat_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chat_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(chat_id) REFERENCES chats(id) ON DELETE CASCADE,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(chat_id, user_id)
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chat_id INTEGER NOT NULL,
  sender_id INTEGER NOT NULL,
  text TEXT,
  media_url TEXT,
  media_type TEXT,
  is_read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(chat_id) REFERENCES chats(id) ON DELETE CASCADE,
  FOREIGN KEY(sender_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🔒 Security

### JWT Token
- Algorithm: HS256
- Expiration: 7 days
- Payload: `{ id, username }`

### Password Hashing
- Algorithm: bcrypt
- Salt rounds: 10

### File Upload Security
- Size limit: 50MB
- Type validation: Yes
- Filename sanitization: Yes

---

## 📝 Example Usage

### Complete Flow Example

```javascript
// 1. Register
const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john_doe',
    password: 'securepass123'
  })
});
const { token } = await registerResponse.json();

// 2. Connect to WebSocket
const socket = io('http://localhost:5000', {
  auth: { token }
});

// 3. Get chats
const chatsResponse = await fetch('http://localhost:5000/api/chats', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { chats } = await chatsResponse.json();

// 4. Join a chat
socket.emit('joinChat', chats[0].id);

// 5. Listen for messages
socket.on('receiveMessage', (message) => {
  console.log('New message:', message);
});

// 6. Send a message
socket.emit('sendMessage', {
  chatId: chats[0].id,
  text: 'Hello, World!'
});

// 7. Upload a file
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const uploadResponse = await fetch('http://localhost:5000/api/upload', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
const { filePath, mediaType } = await uploadResponse.json();

// 8. Send message with media
socket.emit('sendMessage', {
  chatId: chats[0].id,
  text: 'Check out this image!',
  mediaUrl: filePath,
  mediaType: mediaType
});
```

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

### Get Chats
```bash
curl http://localhost:5000/api/chats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Upload File
```bash
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@/path/to/image.jpg"
```

---

## 📚 Additional Resources

- **Socket.io Documentation**: https://socket.io/docs/
- **Express.js Documentation**: https://expressjs.com/
- **SQLite Documentation**: https://www.sqlite.org/docs.html
- **JWT Documentation**: https://jwt.io/

---

**Happy Coding! 🚀**
