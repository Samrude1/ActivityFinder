# 🗺️ Activity Finder - Project Roadmap

This document serves as the unified guide for deploying, polishing, and evolving the Activity Finder application from a local prototype to a professional-grade web and mobile application.

---

## 🏗️ Phase 1: MVP Deployment (Current Focus)

**Goal:** Get the application live on the web with persistent storage.

### 1.1 Architecture Overview
- **Frontend**: React/Vite (Host: Vercel)
- **Backend**: Node.js/Express (Host: Render)
- **Database**: PostgreSQL (Host: Neon.tech)

### 1.2 Database Setup (Neon.tech)
1.  **Create Account**: Sign up at [neon.tech](https://neon.tech).
2.  **Create Project**: Name it `activity-finder-db`.
3.  **Get Connection String**: Copy the `postgres://...` URL.
4.  **Local Test**:
    ```bash
    # In /backend/.env
    DATABASE_TYPE=postgres
    DATABASE_URL=<your_connection_string>
    ```
    Run `npm run migrate` and `npm start` to verify.

### 1.3 Backend Deployment (Render.com)
1.  **New Web Service**: Connect your GitHub repo.
2.  **Settings**:
    - Root Directory: `backend`
    - Build Command: `npm install`
    - Start Command: `npm start`
3.  **Environment Variables**:
    - `DATABASE_TYPE`: `postgres`
    - `DATABASE_URL`: `<your_neon_string>`
    - `JWT_SECRET`: `<random_32_char_string>`
    - `CLIENT_URL`: `https://<your-app>.vercel.app` (Add this after deploying frontend)
    - `NODE_ENV`: `production`

### 1.4 Frontend Deployment (Vercel)
1.  **New Project**: Import your GitHub repo.
2.  **Settings**:
    - Framework: Vite
    - Output Directory: `dist`
3.  **Environment Variables**:
    - `VITE_API_URL`: `https://<your-render-app>.onrender.com/api`
4.  **Deploy**: Click deploy and copy the resulting URL.

### 1.5 Final Connection
- Go back to **Render** environment variables.
- Update `CLIENT_URL` to your accurate Vercel URL (no trailing slash).
- Render will auto-redeploy.

---

## 💎 Phase 2: Professional Polish

**Goal:** Elevate quality to "Pro Level" before marketing.

### 2.1 Testing Infrastructure (Critical)
- [ ] **Unit Tests**: Install `vitest`. Target 70% coverage for services.
- [ ] **E2E Tests**: Install `playwright` for critical flows (Login -> Search -> Favorite).

### 2.2 Security Hardening
- [ ] **Headers**: Ensure `helmet` is fully configured on backend.
- [ ] **Rate Limiting**: Apply to all endpoints, not just auth.
- [ ] **Secrets**: Rotate JWT secret periodically.

### 2.3 SEO & Analytics
- [ ] **Meta Tags**: Implement dynamic Open Graph tags (Title, Description, Image).
- [ ] **Sitemap**: Generate `sitemap.xml`.
- [ ] **Analytics**: Integrate privacy-friendly analytics (e.g., Plausible).

### 2.4 Legal Compliance
- [ ] Create **Privacy Policy** page.
- [ ] Create **Terms of Service** page.

---

## 🚀 Phase 3: Launch Protocol

**Goal:** Ensure a smooth, error-free production launch.

### Pre-Flight Checklist
- [ ] **Database**: Verify persistence (restart server -> data remains).
- [ ] **SSL**: HTTPS enabled on both Frontend and Backend.
- [ ] **Performance**: Lighthouse score > 90.
- [ ] **Cross-Browser**: Tested on Chrome, Firefox, Safari (Mobile).
- [ ] **Rollback Plan**:
    1. Revert Frontend on Vercel (One-click).
    2. Revert Backend on Render (Deploy previous commit).
    3. Db Backup: `pg_dump` before major updates.

---

## 📱 Phase 4: Mobile Evolution

**Goal:** Convert the web app to a native iOS/Android app.

**Strategy: Ionic Capacitor**
We will wrap the existing React application using Capacitor. This allows 95% code reuse while accessing native features.

### 4.1 Implementation Steps
1.  **Install Capacitor**:
    ```bash
    npm install @capacitor/core @capacitor/cli
    npx cap init
    ```
2.  **Build & Sync**:
    ```bash
    npm run build
    npx cap add android
    npx cap add ios
    npx cap sync
    ```
3.  **Native Features**:
    - Replace `localStorage` with `@capacitor/preferences`.
    - Use `@capacitor/geolocation` for better location accuracy.

### 4.2 App Store Prep
- **Apple**: $99/yr developer account. Mac required for build.
- **Google**: $25 one-time fee.
- **Assets**: Generate splash screens and icons (use `capacitor-assets`).

---

## 📂 Obsolete Files (Merged into this Roadmap)
- `docs/DEPLOYMENT.md`
- `docs/PRODUCTION_CHECKLIST.md`
- `docs/PUBLISHING_STRATEGY.md`
- `docs/MOBILE_STRATEGY.md`
