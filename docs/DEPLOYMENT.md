# 🚀 Deployment Guide

This guide explains how to deploy the **Activity Finder** application to production with a persistent PostgreSQL database.

Since this project consists of two parts (Frontend and Backend), you need to deploy them separately.

## 🏗️ Architecture Overview

- **Frontend**: A React static site (Vite). Hosted on **Vercel** or **Netlify**.
- **Backend**: A Node.js API. Hosted on **Render**, **Railway**, or **Fly.io**.
- **Database**: PostgreSQL (Neon.tech) for production, SQLite for local development.

> [!IMPORTANT]
> **Database Migration Required**: SQLite uses file-based storage which is **ephemeral** on free hosting platforms like Render. Data will be lost every time the server restarts (~15 minutes of inactivity). For production, we use **PostgreSQL** (Neon.tech free tier) which provides persistent, reliable storage.

---

## 📋 Quick Start

**For a detailed step-by-step checklist, see [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)**

---

## 🗄️ Step 0: Database Setup (Neon.tech PostgreSQL)

Before deploying the backend, set up a persistent PostgreSQL database.

### Why PostgreSQL?

- ✅ **Persistent Storage**: Data survives server restarts
- ✅ **Production-Ready**: Industry standard for web applications
- ✅ **Free Tier**: Neon.tech offers generous free tier (0.5GB storage)
- ✅ **Automatic Backups**: Point-in-time recovery available
- ✅ **Better Performance**: Optimized for concurrent connections

### Setup Instructions

1. **Create Neon.tech Account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up with GitHub (recommended)
   - Click "Create a project"

2. **Create Database**
   - **Project Name**: `activity-finder-db`
   - **Region**: Select closest to your users (e.g., US East, EU West)
   - **PostgreSQL Version**: 15 or later
   - Click "Create Project"

3. **Get Connection String**
   - After creation, you'll see a connection string
   - Format: `postgresql://username:password@host/database?sslmode=require`
   - **Copy this string** - you'll need it for Render deployment
   - Example: `postgresql://user:abc123@ep-cool-name.us-east-1.aws.neon.tech/neondb?sslmode=require`

4. **Test Connection Locally (Optional)**
   ```bash
   # In backend directory
   cd backend
   
   # Create .env file with your Neon connection string
   echo "DATABASE_TYPE=postgres" >> .env
   echo "DATABASE_URL=your-neon-connection-string" >> .env
   
   # Install dependencies
   npm install
   
   # Run migration to create tables
   npm run migrate
   
   # Start server
   npm start
   ```

   You should see:
   ```
   ✅ PostgreSQL database initialized successfully
   🚀 Server running on http://localhost:3002
   📊 Database: postgres
   ```

---

## 📦 Step 1: Backend Deployment (Render.com)

We recommend **Render** for the backend as it offers a free tier for Node.js services.

### Prerequisites
- GitHub repository with your code
- Neon.tech PostgreSQL connection string (from Step 0)

### Deployment Steps

1. **Push your code to GitHub** (if you haven't already)
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Create New Web Service**
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Select your repository

4. **Configure Service**
   - **Name**: `activity-finder-backend`
   - **Root Directory**: `backend` ⚠️ **Important!**
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. **Environment Variables**
   Click "Advanced" → "Add Environment Variable" and add:

   | Key | Value | Notes |
   |-----|-------|-------|
   | `DATABASE_TYPE` | `postgres` | Use PostgreSQL |
   | `DATABASE_URL` | `<your-neon-connection-string>` | From Step 0 |
   | `JWT_SECRET` | `<generate-random-string>` | See below |
   | `CLIENT_URL` | `https://your-app.vercel.app` | Update after Step 2 |
   | `NODE_ENV` | `production` | Production mode |

   **Generate JWT Secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and use it as `JWT_SECRET`.

6. **Deploy**
   - Click **"Create Web Service"**
   - Wait 5-10 minutes for deployment
   - You'll get a URL like: `https://activity-finder-backend.onrender.com`
   - **Copy this URL** for Step 2

7. **Verify Backend**
   - Visit: `https://your-backend.onrender.com/api/health`
   - You should see:
     ```json
     {
       "status": "ok",
       "message": "Backend is running",
       "database": "postgres",
       "environment": "production"
     }
     ```

---

## 🎨 Step 2: Frontend Deployment (Vercel)

Vercel is excellent for React apps built with Vite.

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click **"Add New..."** → **"Project"**
   - Import your GitHub repository

3. **Configure Project**
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**
   - Expand "Environment Variables"
   - Add:
     - **Key**: `VITE_API_URL`
     - **Value**: `https://your-backend.onrender.com/api`
     - (Use the URL from Step 1 + `/api`)

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-5 minutes
   - You'll get a URL like: `https://activity-finder.vercel.app`
   - **Copy this URL** for Step 3

---

## 🔗 Step 3: Connect Frontend & Backend

Once both are deployed, update the backend CORS settings:

1. Go to **Render Dashboard**
2. Select your backend service
3. Go to **"Environment"** tab
4. Update `CLIENT_URL` to your **exact Vercel URL**:
   - ✅ Correct: `https://activity-finder.vercel.app`
   - ❌ Wrong: `https://activity-finder.vercel.app/` (no trailing slash)
5. Render will automatically redeploy (2-3 minutes)

---

## ✅ Verification

1. **Open your Vercel URL**
2. The app should load without errors
3. **Test Authentication**:
   - Click "Register" or "Login"
   - Create a new account
   - Add some favorites
4. **Test Persistence**:
   - Wait 20 minutes (Render free tier sleeps)
   - Refresh the page
   - Login again
   - Verify your favorites are still there ✅

### Troubleshooting

**White Screen on Frontend**
- Check browser console (F12)
- Verify `VITE_API_URL` is set in Vercel environment variables
- Redeploy frontend

**Network Error / CORS Error**
- Check `CLIENT_URL` in Render matches Vercel URL exactly
- Remove any trailing slashes
- Wait for Render to redeploy

**Backend 502 Error**
- Check Render logs
- Verify `DATABASE_URL` is correct
- Ensure Root Directory is set to `backend`

**Database Connection Error**
- Verify Neon.tech database is running
- Check `DATABASE_URL` includes `?sslmode=require`
- Test connection locally first

---

## 🛠️ Advanced: Production Optimization

### Custom Domain (Optional)

**Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**Render:**
1. Go to Settings → Custom Domain
2. Add your domain
3. Update `CLIENT_URL` to your custom domain

### Upgrade for Better Performance

**Free Tier Limitations:**
- Render: Server sleeps after 15 min inactivity (cold start: 15-30s)
- Neon.tech: 0.5GB storage, compute scales to zero
- Vercel: 100GB bandwidth/month

**Upgrade Options:**
- **Render Starter** ($7/mo): Always-on, no cold starts
- **Neon.tech Pro** ($19/mo): More storage, always-on compute
- **Vercel Pro** ($20/mo): More bandwidth, better analytics

### Database Backups

Neon.tech free tier includes:
- Automatic backups (7 days retention)
- Point-in-time recovery (paid feature)

For manual backups:
```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
```

### Monitoring & Logging

**Render:**
- Built-in logs (last 7 days on free tier)
- Metrics dashboard (CPU, memory, requests)

**Vercel:**
- Analytics (page views, performance)
- Real-time logs

**Neon.tech:**
- Database metrics (connections, queries, storage)
- Query performance insights

---

## 🔒 Security Best Practices

✅ **Implemented:**
- HTTPS on all endpoints
- Helmet.js security headers
- Rate limiting on auth endpoints
- JWT token authentication
- CORS whitelist
- Environment variable secrets

⚠️ **Additional Recommendations:**
- Rotate JWT secret periodically
- Enable 2FA on hosting accounts
- Monitor for unusual activity
- Keep dependencies updated
- Use strong passwords for database

---

## 📊 Cost Summary

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Neon.tech** | 0.5GB storage | $19/mo (Pro) |
| **Render** | 750 hrs/mo, sleeps | $7/mo (Starter) |
| **Vercel** | 100GB bandwidth | $20/mo (Pro) |
| **Total** | **$0/month** | ~$46/month |

**Recommendation**: Start with free tier, upgrade Render first (biggest UX impact).

---

## 🚀 Next Steps

1. ✅ Follow [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) for detailed deployment
2. 📝 Update README.md with your live demo URL
3. 🎉 Share your deployed app!
4. 📈 Monitor performance and user feedback
5. 🔄 Set up CI/CD for automatic deployments (optional)

---

**Need Help?** Check the troubleshooting section or review Render/Vercel logs for detailed error messages.
