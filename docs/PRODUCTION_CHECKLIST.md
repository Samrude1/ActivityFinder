# 🚀 Production Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

## Pre-Deployment

### Database Setup
- [ ] Create Neon.tech account at [neon.tech](https://neon.tech)
- [ ] Create new PostgreSQL database project
- [ ] Copy connection string (format: `postgresql://user:pass@host/db`)
- [ ] Test connection locally with migration script
- [ ] Verify tables are created successfully

### Backend Preparation
- [ ] Generate strong JWT secret (32+ characters)
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Push latest code to GitHub
- [ ] Verify `backend/package.json` includes all dependencies
- [ ] Test backend locally with PostgreSQL
- [ ] Ensure all environment variables are documented

### Frontend Preparation
- [ ] Test production build locally
  ```bash
  npm run build
  npm run preview
  ```
- [ ] Verify no console errors
- [ ] Check bundle size (should be < 500KB)
- [ ] Run Lighthouse audit (target: >90)

---

## Deployment Steps

### 1. Backend Deployment (Render)

- [ ] Create Render account at [render.com](https://render.com)
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Configure service:
  - **Name**: `activity-finder-backend`
  - **Root Directory**: `backend`
  - **Environment**: `Node`
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
  - **Instance Type**: Free

- [ ] Add environment variables:
  ```
  DATABASE_TYPE=postgres
  DATABASE_URL=<your-neon-connection-string>
  JWT_SECRET=<generated-secret>
  CLIENT_URL=https://your-app.vercel.app
  NODE_ENV=production
  ```

- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes)
- [ ] Copy backend URL (e.g., `https://activity-finder-backend.onrender.com`)
- [ ] Test health endpoint: `https://your-backend.onrender.com/api/health`

### 2. Frontend Deployment (Vercel)

- [ ] Create Vercel account at [vercel.com](https://vercel.com)
- [ ] Click "Add New..." → "Project"
- [ ] Import GitHub repository
- [ ] Configure project:
  - **Framework Preset**: Vite (auto-detected)
  - **Root Directory**: `./`
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`

- [ ] Add environment variable:
  ```
  VITE_API_URL=https://your-backend.onrender.com/api
  ```

- [ ] Click "Deploy"
- [ ] Wait for deployment (2-5 minutes)
- [ ] Copy frontend URL (e.g., `https://activity-finder.vercel.app`)

### 3. Connect Frontend & Backend

- [ ] Go back to Render dashboard
- [ ] Navigate to your backend service
- [ ] Update `CLIENT_URL` environment variable to your Vercel URL
- [ ] Wait for automatic redeployment
- [ ] Verify CORS is working (no errors in browser console)

---

## Verification

### Database Persistence Test
- [ ] Register a new user account
- [ ] Add some favorites
- [ ] Wait 20 minutes (Render free tier sleeps)
- [ ] Wake the service by visiting the app
- [ ] Verify user and favorites still exist

### Authentication Flow
- [ ] Register new account
- [ ] Logout
- [ ] Login with same credentials
- [ ] Verify JWT token is stored
- [ ] Test protected routes (favorites)

### Performance Check
- [ ] Run Lighthouse audit on deployed site
- [ ] Check Time to First Byte (TTFB < 1s)
- [ ] Monitor cold start time on Render
- [ ] Verify images load correctly
- [ ] Test on mobile device

### Security Verification
- [ ] Verify HTTPS on both frontend and backend
- [ ] Check security headers (use securityheaders.com)
- [ ] Test rate limiting (try 6+ login attempts)
- [ ] Verify no sensitive data in error messages
- [ ] Check that `.env` files are not committed to Git

### Cross-Browser Testing
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari (if available)
- [ ] Test on mobile browser

---

## Post-Deployment

### Monitoring
- [ ] Set up Render dashboard monitoring
- [ ] Enable Vercel analytics (optional)
- [ ] Monitor Neon.tech database metrics
- [ ] Check application after 24 hours of inactivity

### Documentation
- [ ] Update README with live demo URL
- [ ] Document any deployment issues encountered
- [ ] Create rollback plan
- [ ] Share deployment guide with team

### Optional Enhancements
- [ ] Set up custom domain
- [ ] Configure email notifications for errors
- [ ] Add application monitoring (Sentry, LogRocket)
- [ ] Set up automated backups for database

---

## Troubleshooting

### Frontend Issues

**White Screen**
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly in Vercel
- Rebuild and redeploy

**API Errors**
- Check Network tab in DevTools
- Verify backend URL is correct
- Check CORS errors

### Backend Issues

**502 Bad Gateway**
- Check Render logs
- Verify `npm install` succeeded
- Check that Root Directory is set to `backend`

**Database Connection Failed**
- Verify `DATABASE_URL` is correct
- Check Neon.tech database is running
- Ensure SSL mode is enabled

**CORS Errors**
- Verify `CLIENT_URL` matches Vercel URL exactly
- Remove trailing slashes
- Check browser console for exact origin

### Performance Issues

**Slow Cold Starts**
- Normal on Render free tier (15s+)
- Consider upgrading to paid tier
- Implement loading states in frontend

**Database Slow**
- Check Neon.tech metrics
- Add database indexes if needed
- Consider query optimization

---

## Rollback Procedure

If something goes wrong:

1. **Frontend**: Vercel → Deployments → Previous deployment → "Promote to Production"
2. **Backend**: Render → Manual Deploy → Select previous commit
3. **Database**: Neon.tech has point-in-time recovery (paid feature)
4. **Emergency**: Switch `DATABASE_TYPE` back to `sqlite` temporarily

---

## Success Criteria

✅ Application loads without errors  
✅ Users can register and login  
✅ Favorites persist after server restart  
✅ No CORS errors in console  
✅ Lighthouse score > 90  
✅ Mobile responsive  
✅ HTTPS enabled  
✅ Rate limiting works  

---

**Estimated Total Time**: 2-3 hours for first deployment
