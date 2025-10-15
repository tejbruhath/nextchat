# 🚀 Git Setup & Push Guide

Quick guide to push NextChat to GitHub.

---

## 📋 Step-by-Step Instructions

### Step 1: Configure Git Identity

Run these commands in PowerShell (replace with your actual email):

```powershell
git config --global user.name "tejbruhath"
git config --global user.email "your-email@example.com"
```

**Important**: Replace `your-email@example.com` with your actual GitHub email!

---

### Step 2: Add All Files

```powershell
git add .
```

---

### Step 3: Make First Commit

```powershell
git commit -m "Initial commit: NextChat with voice calling"
```

---

### Step 4: Push to GitHub

```powershell
git push -u origin main
```

If this fails, try:

```powershell
git branch -M main
git push -u origin main
```

---

## 🔧 Alternative: Use the Setup Script

I've created a batch file for you. Just edit it first:

1. **Open** `git-setup.bat`
2. **Replace** `your-email@example.com` with your actual email
3. **Save** the file
4. **Double-click** `git-setup.bat` to run it

---

## 🐛 Common Issues

### Issue 1: "src refspec main does not match any"

**Solution**: You need to make a commit first

```powershell
git add .
git commit -m "Initial commit"
git push -u origin main
```

---

### Issue 2: "Author identity unknown"

**Solution**: Configure your Git identity

```powershell
git config --global user.name "YourName"
git config --global user.email "your@email.com"
```

---

### Issue 3: "failed to push some refs"

**Solution**: Pull first, then push

```powershell
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

### Issue 4: Authentication Required

If GitHub asks for authentication:

**Option A: Use Personal Access Token**
1. Go to GitHub Settings → Developer Settings → Personal Access Tokens
2. Generate new token (classic)
3. Select scopes: `repo` (all)
4. Copy the token
5. Use token as password when pushing

**Option B: Use GitHub CLI**
```powershell
gh auth login
```

---

## ✅ Complete Command Sequence

Here's the complete sequence to run:

```powershell
# 1. Configure Git (one-time setup)
git config --global user.name "tejbruhath"
git config --global user.email "your-email@example.com"

# 2. Check status
git status

# 3. Add all files
git add .

# 4. Commit
git commit -m "Initial commit: NextChat with voice calling"

# 5. Ensure you're on main branch
git branch -M main

# 6. Push to GitHub
git push -u origin main
```

---

## 📝 What to Do Now

### Option 1: Manual Commands (Recommended)

Copy and paste these commands one by one in PowerShell:

```powershell
git config --global user.name "tejbruhath"
```

```powershell
git config --global user.email "YOUR_GITHUB_EMAIL_HERE"
```

```powershell
git add .
```

```powershell
git commit -m "Initial commit: NextChat with voice calling"
```

```powershell
git branch -M main
```

```powershell
git push -u origin main
```

---

### Option 2: Edit and Run Script

1. Open `git-setup.bat`
2. Change `your-email@example.com` to your real email
3. Save and run the file

---

## 🎯 After Successful Push

Once pushed, you'll see:

```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
Delta compression using up to X threads
Compressing objects: 100% (XX/XX), done.
Writing objects: 100% (XX/XX), XX.XX KiB | XX.XX MiB/s, done.
Total XX (delta X), reused 0 (delta 0), pack-reused 0
To https://github.com/tejbruhath/nextchat.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

Then visit: https://github.com/tejbruhath/nextchat

---

## 📦 What Will Be Pushed

Your repository will include:

- ✅ Complete NextChat application
- ✅ Backend (Node.js + Express + Socket.io)
- ✅ Frontend (React + Vite + Tailwind)
- ✅ Voice calling feature (WebRTC)
- ✅ All documentation (10+ markdown files)
- ✅ Configuration files
- ✅ README and setup guides

**Total**: ~35 files, ~2000+ lines of code

---

## 🔐 Security Note

The `.gitignore` file already excludes:
- ✅ `node_modules/`
- ✅ `.env` files
- ✅ Database files
- ✅ Uploaded files

Your sensitive data is protected!

---

## 🆘 Still Having Issues?

If you're still stuck, here's what to check:

1. **Git installed?** Run: `git --version`
2. **Remote configured?** Run: `git remote -v`
3. **GitHub repo exists?** Visit: https://github.com/tejbruhath/nextchat
4. **Authentication?** You may need a Personal Access Token

---

## 📞 Quick Help Commands

```powershell
# Check Git version
git --version

# Check remote
git remote -v

# Check branch
git branch

# Check status
git status

# View commit history
git log --oneline
```

---

**Ready to push? Follow the steps above! 🚀**
