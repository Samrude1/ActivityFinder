# 🚀 Quick Deployment Guide

This is a condensed guide for deploying your Activity Finder app. For detailed instructions, see [`DEPLOYMENT.md`](./DEPLOYMENT.md) and [`PRODUCTION_CHECKLIST.md`](./PRODUCTION_CHECKLIST.md).

---

## Prerequisites

- GitHub account with your code pushed
- Accounts on: [Neon.tech](https://neon.tech), [Render.com](https://render.com), [Vercel.com](https://vercel.com)

---

## Step 1: Database (5 minutes)

1. Go to [neon.tech](https://neon.tech) → Create project
2. Copy the connection string (starts with `postgresql://`)
3. Save it for Step 2

---

## Step 2: Backend (10 minutes)

1. Go to [render.com](https://render.com) → New Web Service
2. Connect GitHub repo
3. **Settings:**
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
4. **Environment Variables:**
   ```
   DATABASE_TYPE=postgres
   DATABASE_URL=<paste-neon-connection-string>
   JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
   CLIENT_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```
5. Deploy → Copy backend URL

---

## Step 3: Frontend (5 minutes)

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import GitHub repo
3. **Environment Variable:**
   ```
   VITE_API_URL=<backend-url>/api
   ```
4. Deploy → Copy frontend URL

---

## Step 4: Connect (2 minutes)

1. Go back to Render → Your backend service
2. Update `CLIENT_URL` to your Vercel URL (no trailing slash)
3. Wait for auto-redeploy

---

## Step 5: Test

1. Open your Vercel URL
2. Register an account
3. Add favorites
4. Wait 20 minutes → Refresh → Login
5. ✅ Favorites should still be there!

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| White screen | Check Vercel env vars, redeploy |
| CORS error | Update `CLIENT_URL` in Render (exact match) |
| 502 error | Check Render logs, verify `DATABASE_URL` |

---

## Total Time: ~25 minutes

**Free tier limits:**
- Render: Sleeps after 15 min (cold start ~15s)
- Neon: 0.5GB storage
- Vercel: 100GB bandwidth/month

**All free, no credit card required!**
