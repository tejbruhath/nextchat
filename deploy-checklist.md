# ✅ Deployment Checklist

Quick checklist for deploying NextChat to production.

---

## 📋 Pre-Deployment

- [ ] All code pushed to GitHub
- [ ] `.env.example` file created
- [ ] Production config files added
- [ ] API helpers implemented
- [ ] Build tested locally

---

## 🔧 Backend Deployment (Railway)

- [ ] Create Railway account
- [ ] New project from GitHub repo
- [ ] Set root directory to `backend`
- [ ] Add environment variables:
  - [ ] `PORT=5000`
  - [ ] `JWT_SECRET=<random-string>`
  - [ ] `NODE_ENV=production`
  - [ ] `FRONTEND_URL=<vercel-url>`
- [ ] Deploy backend
- [ ] Copy Railway URL
- [ ] Test: `https://your-backend.railway.app/api/health`

---

## 🎨 Frontend Deployment (Vercel)

- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Configure project:
  - [ ] Framework: Vite
  - [ ] Root: `frontend`
  - [ ] Build: `npm run build`
  - [ ] Output: `dist`
- [ ] Add environment variables:
  - [ ] `VITE_API_URL=<railway-url>`
  - [ ] `VITE_SOCKET_URL=<railway-url>`
- [ ] Deploy frontend
- [ ] Copy Vercel URL
- [ ] Update backend `FRONTEND_URL`

---

## 🧪 Testing

- [ ] Open Vercel URL in browser
- [ ] Register new account
- [ ] Login works
- [ ] Create chat
- [ ] Send message
- [ ] Receive message in real-time
- [ ] Upload file
- [ ] Make voice call
- [ ] Test on mobile

---

## 🔐 Security

- [ ] Strong JWT secret generated
- [ ] CORS configured correctly
- [ ] HTTPS enabled (automatic)
- [ ] Environment variables set
- [ ] No secrets in code

---

## 📱 Post-Deployment

- [ ] Share URL with friends
- [ ] Monitor Railway logs
- [ ] Check Vercel analytics
- [ ] Set up custom domain (optional)
- [ ] Add monitoring (optional)

---

## 🆘 If Something Breaks

1. Check deployment logs
2. Verify environment variables
3. Test API endpoint directly
4. Check browser console
5. Review CORS settings

---

**All checked? You're live! 🎉**
