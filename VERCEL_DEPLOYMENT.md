# 🚀 Vercel Deployment Guide

Complete guide to deploy NextChat to production using Vercel (frontend) and Railway/Render (backend).

---

## ⚠️ Important Note

**Vercel is best for frontend only.** For the backend (which needs WebSocket support and persistent connections), you'll need a separate service like:

- **Railway** (Recommended - Easy, free tier)
- **Render** (Good alternative)
- **Heroku** (Paid)
- **DigitalOcean** (VPS)

---

## 📋 Deployment Strategy

```
┌─────────────────────────────────────────┐
│  Frontend (React)                       │
│  Deployed to: Vercel                    │
│  URL: https://nextchat.vercel.app       │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Backend (Node.js + Socket.io)          │
│  Deployed to: Railway/Render            │
│  URL: https://nextchat.railway.app      │
└─────────────────────────────────────────┘
```

---

## 🎯 Step-by-Step Deployment

### Part 1: Deploy Backend to Railway

#### Step 1: Prepare Backend for Production

**Update `backend/package.json`:**

```json
{
  "name": "nextchat-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.6.1",
    "sqlite": "^5.1.1",
    "sqlite3": "^5.1.7",
    "multer": "^1.4.5-lts.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

#### Step 2: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"

#### Step 3: Configure Railway

**Add Environment Variables in Railway:**

```
PORT=5000
JWT_SECRET=your_super_secret_random_string_here
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Step 4: Deploy Backend

1. Connect your GitHub repository
2. Select the `backend` folder as root
3. Railway will auto-detect Node.js
4. Click "Deploy"
5. Copy your Railway URL (e.g., `https://nextchat.up.railway.app`)

---

### Part 2: Deploy Frontend to Vercel

#### Step 1: Update Frontend Configuration

**Create `frontend/.env.production`:**

```env
VITE_API_URL=https://your-backend.railway.app
VITE_SOCKET_URL=https://your-backend.railway.app
```

**Update `frontend/src/pages/Chat.jsx`:**

Find the socket connection (line ~22) and change to:

```javascript
const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
  auth: { token }
});
```

**Update all API calls to use environment variable:**

Create `frontend/src/config.js`:

```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
```

#### Step 2: Update Frontend Package.json

**Edit `frontend/package.json`:**

```json
{
  "name": "nextchat-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "socket.io-client": "^4.6.1",
    "lucide-react": "^0.294.0",
    "react-router-dom": "^6.20.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.8"
  }
}
```

#### Step 3: Deploy to Vercel

**Option A: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: nextchat
# - Directory: ./
# - Override settings? No
```

**Option B: Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variables:
   - `VITE_API_URL`: Your Railway backend URL
   - `VITE_SOCKET_URL`: Your Railway backend URL
7. Click "Deploy"

---

## 🔧 Production Updates Needed

### 1. Update API Calls

**Create `frontend/src/utils/api.js`:**

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers
    }
  });
  
  return response;
};
```

### 2. Update Login Component

**Edit `frontend/src/pages/Login.jsx`:**

```javascript
import { apiCall } from '../utils/api';

// In handleSubmit function:
const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
const response = await apiCall(endpoint, {
  method: 'POST',
  body: JSON.stringify({ username, password })
});
```

### 3. Update Chat Component

**Edit `frontend/src/pages/Chat.jsx`:**

```javascript
import { API_URL, SOCKET_URL } from '../config';
import { apiCall } from '../utils/api';

// Update socket connection:
const newSocket = io(SOCKET_URL, {
  auth: { token }
});

// Update fetchChats:
const response = await apiCall('/api/chats');
```

### 4. Update Backend CORS

**Edit `backend/server.js`:**

```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Update Socket.io CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});
```

---

## 🗄️ Database Configuration

### Option 1: Keep SQLite (Simple)

SQLite works on Railway but data will be lost on redeploy. Good for testing.

### Option 2: PostgreSQL (Recommended for Production)

**Install PostgreSQL adapter:**

```bash
cd backend
npm install pg
```

**Update `backend/db.js` for PostgreSQL:**

```javascript
import pg from 'pg';

const isProduction = process.env.NODE_ENV === 'production';

let db;

if (isProduction && process.env.DATABASE_URL) {
  // Use PostgreSQL in production
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  db = {
    async get(query, params) {
      const result = await pool.query(query, params);
      return result.rows[0];
    },
    async all(query, params) {
      const result = await pool.query(query, params);
      return result.rows;
    },
    async run(query, params) {
      const result = await pool.query(query, params);
      return { lastID: result.rows[0]?.id };
    }
  };
} else {
  // Use SQLite in development
  const { open } = await import('sqlite');
  const sqlite3 = await import('sqlite3');
  
  db = await open({
    filename: './chat.db',
    driver: sqlite3.Database
  });
}

export { db };
```

**Add PostgreSQL to Railway:**

1. In Railway dashboard, click "New"
2. Select "Database" → "PostgreSQL"
3. Copy the `DATABASE_URL`
4. Add to environment variables

---

## 📁 File Structure for Production

```
nextchat/
├── frontend/
│   ├── src/
│   │   ├── config.js          # NEW: API URLs
│   │   ├── utils/
│   │   │   └── api.js         # NEW: API helper
│   │   └── ...
│   ├── .env.production        # NEW: Production env vars
│   └── package.json
├── backend/
│   ├── server.js              # UPDATED: CORS config
│   ├── db.js                  # UPDATED: PostgreSQL support
│   └── package.json           # UPDATED: Engines field
├── vercel.json                # NEW: Vercel config
├── .env.example               # NEW: Environment template
└── VERCEL_DEPLOYMENT.md       # This file
```

---

## 🔐 Environment Variables

### Backend (Railway)

```
PORT=5000
JWT_SECRET=<generate-random-string>
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
DATABASE_URL=<postgresql-url-if-using>
```

### Frontend (Vercel)

```
VITE_API_URL=https://your-backend.railway.app
VITE_SOCKET_URL=https://your-backend.railway.app
```

---

## ✅ Pre-Deployment Checklist

### Backend
- [ ] Update CORS configuration
- [ ] Add production environment variables
- [ ] Test database connection
- [ ] Verify all API endpoints work
- [ ] Test WebSocket connection
- [ ] Configure file upload storage (use S3 or Cloudinary)

### Frontend
- [ ] Create config.js with API URLs
- [ ] Update all API calls to use environment variables
- [ ] Update socket connection
- [ ] Test build locally (`npm run build`)
- [ ] Verify all routes work
- [ ] Test on mobile viewport

### Security
- [ ] Generate strong JWT secret
- [ ] Enable HTTPS only
- [ ] Configure proper CORS
- [ ] Add rate limiting
- [ ] Sanitize user inputs
- [ ] Add CSP headers

---

## 🧪 Testing Production Build

### Test Backend Locally

```bash
cd backend
NODE_ENV=production JWT_SECRET=test123 FRONTEND_URL=http://localhost:5173 node server.js
```

### Test Frontend Build

```bash
cd frontend
npm run build
npm run preview
```

Visit `http://localhost:4173` to test the production build.

---

## 🚀 Deployment Commands

### Deploy Backend to Railway

```bash
# Push to GitHub
git add .
git commit -m "Production ready"
git push origin main

# Railway will auto-deploy
```

### Deploy Frontend to Vercel

```bash
cd frontend
vercel --prod
```

Or push to GitHub and Vercel will auto-deploy.

---

## 📊 Post-Deployment

### Monitor Your App

**Railway:**
- View logs in Railway dashboard
- Monitor resource usage
- Set up alerts

**Vercel:**
- View deployment logs
- Monitor analytics
- Check performance metrics

### Custom Domain (Optional)

**Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records

**Railway:**
1. Go to Settings → Domains
2. Add custom domain
3. Update DNS records

---

## 🐛 Common Issues

### Issue 1: CORS Errors

**Solution**: Ensure FRONTEND_URL in backend matches your Vercel URL exactly.

### Issue 2: WebSocket Not Connecting

**Solution**: 
- Check SOCKET_URL in frontend
- Verify Railway backend is running
- Check browser console for errors

### Issue 3: 404 on Refresh

**Solution**: Vercel handles this automatically with React Router.

### Issue 4: Environment Variables Not Working

**Solution**:
- Redeploy after adding env vars
- Check variable names (VITE_ prefix for frontend)
- Verify in deployment logs

---

## 💰 Cost Estimate

### Free Tier

- **Vercel**: Free (Hobby plan)
  - Unlimited deployments
  - 100GB bandwidth/month
  - Automatic HTTPS

- **Railway**: $5/month credit free
  - ~500 hours/month
  - Good for small apps

### Paid (If Needed)

- **Vercel Pro**: $20/month
- **Railway**: Pay as you go (~$5-10/month for small app)
- **PostgreSQL**: Included in Railway

---

## 🔮 Production Enhancements

### Recommended Additions

1. **File Storage**: Use Cloudinary or AWS S3 instead of local storage
2. **Database**: PostgreSQL instead of SQLite
3. **Caching**: Redis for sessions
4. **Monitoring**: Sentry for error tracking
5. **Analytics**: Google Analytics or Plausible
6. **CDN**: Cloudflare for static assets
7. **Email**: SendGrid for notifications

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [Socket.io Production](https://socket.io/docs/v4/server-deployment/)

---

## 🆘 Need Help?

If you encounter issues:

1. Check deployment logs
2. Verify environment variables
3. Test API endpoints directly
4. Check CORS configuration
5. Review browser console errors

---

**Ready to deploy! Follow the steps above to get NextChat live! 🚀✨**
