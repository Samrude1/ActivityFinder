# Activity Finder �

A premium travel-inspired web application to discover free and paid local activities, points of interest, and events using location-based search, interactive maps, and smart filtering.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat&logo=leaflet&logoColor=white)

### 🚀 **[Live Demo](https://activity-finder-nu.vercel.app/)**

## ✨ Features

### Core Features
- 🗺️ **Interactive Map View** - Visualize activities on an interactive Leaflet map with custom markers
- 📋 **Premium List View** - Browse activities in beautiful, image-focused cards
- 📍 **Smart Location Search** - Search any location worldwide with geocoding
- 🎯 **Category Filtering** - Filter by Outdoor, Cultural, Sports, Music, Food, Family
- ❤️ **Favorites System** - Save activities with full data persistence
- 📱 **Mobile-First Design** - Bottom navigation, responsive layouts
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 👤 **User Accounts** - Full authentication system with JWT tokens
- 💎 **Subscription Tiers** - Free and Explorer plans with progressive features

### Subscription Tiers

#### 🆓 Free Tier
- ✅ Search activities (50 searches/day)
- ✅ Save up to 20 favorites
- ✅ View on map and list
- ✅ Basic category filtering
- ⚠️ Search limit tracking with upgrade prompts

#### 🌟 Explorer Tier ($4.99/month)
- ✅ **Unlimited searches**
- ✅ **Unlimited favorites**
- ✅ **Custom Lists** - Create and organize activity collections
- ✅ **Calendar Export** - Export favorites to iCal format
- ✅ **Advanced Filters** - Price range, ratings, accessibility
- ✅ Ad-free experience
- ✅ Priority support

### Premium UI/UX
- 🎨 **Modern Travel App Design** - Large image cards with gradient overlays
- ✨ **Smooth Animations** - Micro-interactions and transitions
- 🔄 **Horizontal Scrolling** - Featured activities carousel
- ⚙️ **Settings Menu** - Centralized controls for view mode, favorites, and preferences
- 🏠 **Quick Navigation** - Main button in map view to return to list
- 💰 **Clear Pricing** - FREE (green) and Paid (red) badges

### Advanced Features
- 🔍 **Functional Search** - Type location and press Enter to update results
- 🔍 **Radius Control** - Adjust search range (10km - 100km)
- 🎭 **Multiple Results** - Grid layout showing all matching activities
- 🔀 **View Switching** - Seamless toggle between list and map modes
- 📄 **Activity Details** - Full information pages with sharing capabilities
- 📊 **Usage Tracking** - Real-time search counter for Free tier users

### ⚡ Performance & Reliability
- 💀 **Skeleton Screens** - Instant visual feedback while loading data
- 💤 **Lazy Loading** - Images and routes load only when needed
- 💾 **Smart Caching** - API results cached to minimize network requests
- 🔄 **Auto-Retry** - Automatic failure recovery for API requests
- 🌍 **Robust Fallback** - Offline activity data when external APIs fail
- 🏷️ **Smart SEO** - Dynamic document titles for better history/bookmarks
- ♿ **Accessible** - Semantic HTML (`<article>`, `<nav>`) and ARIA labels
- 🔒 **Privacy-First** - No tracking, no analytical cookies

## 📖 Usage Guide

### 🔍 Finding Activities
1. **Search**: Enter any city name (e.g., "Paris", "Tokyo") in the top search bar and press Enter.
2. **Filter**: Tap the category pills (Outdoor, Cultural, etc.) to refine results.
3. **View**: Toggle between **List** and **Map** views using the bottom/side navigation.

### ❤️ Saving Favorites
1. Click the **Heart icon** on any activity card.
2. The activity is instantly saved to your local database.
3. Access your saved items via the **User Menu** -> **Favorites**.

### 📱 Mobile Experience
- The app is fully responsive.
- On mobile, use the **Bottom Navigation Bar** to switch between Explore, Map, and Profile.


## 🎫 APIs & Data
> [!NOTE]
> For detailed documentation on API usage, costs, and data fetching limits, please see [APIS.md](./APIS.md).

We use 100% free, open-source APIs:
- **Nominatim** (Geocoding)
- **Overpass API** (POI Data)
- **OpenStreetMap** (Map Tiles)

## 🏗️ Architecture

### Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Maps**: Leaflet.js
- **Styling**: Vanilla CSS (Variables & Design System)
- **State**: React Context API
- **Backend**: Node.js/Express with PostgreSQL (Neon.tech)

### Project Structure

```
basicapp/
├── src/
│   ├── components/          # UI Components
│   ├── contexts/            # Global State (Auth)
│   ├── services/            # API Clients (see APIS.md)
│   ├── tiers/               # ⚡ Modular Feature Tiers (Explorer, etc.)
│   ├── hooks/               # Custom Hooks
│   └── types/               # TypeScript Interfaces
├── backend/
│   ├── src/
│   │   ├── controllers/     # API Controllers
│   │   ├── middleware/      # Auth & Limits
│   │   ├── models/          # Database Models
│   │   ├── routes/          # API Routes
│   │   └── tiers/           # Tier-specific Features
│   └── server.js            # Express Server
└── docs/                    # Documentation
```

## 🚀 Getting Started

### Installation

**Frontend Setup**
```bash
# Install frontend dependencies
npm install
```

**Backend Setup**
```bash
# Install backend dependencies
cd backend
npm install
cd ..
```

### Running the Application

To run the full application (Frontend + Backend), you need two terminal processes:

**1. Start the Backend Server**
```bash
cd backend
npm start
```
*Server will start on http://localhost:3000*

**2. Start the Frontend Dev Server**
```bash
# In a new terminal
npm run dev
```
*App will open at http://localhost:5173*

### Production Build
1. `npm run build`
2. `npm run preview`

### Deployment (Live)
The application is currently deployed and live!
- **Frontend**: [Vercel](https://activity-finder-nu.vercel.app/)
- **Backend**: Render

## 🤖 Agent Orchestration
This project is developed with **Antigravity AI**:
- **Role**: Full-stack developer & Architect.
- **Workflow**: Plan -> Implement -> Verify.
- **Artifacts**: All planning docs stored in `.gemini/antigravity`.

## 🧱 Modular Tier Architecture

The application handles 4 distinct subscription tiers, each with its own isolated codebase and features. This allows for independent development, testing, and feature rollouts for each plan.

### 1. Subscription Tiers

*   **Free**: Essential features (Search, Map View, Basic Details)
*   **Explorer**: Adds Custom Lists, Advanced Filters, Calendar Export

### 2. Isolated Development Workflow

The codebase is structured to allow editing specific plans without affecting others.

*   **To Edit Explorer Plan**: Modify files in `src/tiers/Explorer/` (Frontend) and `backend/src/tiers/explorer/` (Backend).
    *   Changes here **ONLY** affect the Explorer tier (and higher tiers that inherit it).
    *   Free tier users are completely unaffected by changes in these directories.
*   **To Edit Free Plan**: Modify the core components in `src/components/` (Future migration to `src/tiers/Free/` coming soon).

**Example:** If you want to add a new "Export to PDF" feature for Explorer users:
1.  Add the backend logic in `backend/src/tiers/explorer/features/pdfExport.js`.
2.  Add the button in `src/tiers/Explorer/features/PdfButton.tsx`.
3.  This feature will strictly remain within the Explorer tier.

### 3. Dynamic Tier Activation

When a user upgrades their plan (e.g., from Free to Explorer):
1.  The application detects the new `tier` status immediately.
2.  The `Explorer` module is dynamically activated in the frontend.
3.  UI components like **Custom Lists** and **Advanced Filters** instantly unlock.
4.  Backend routes for the new tier become accessible (validated by token).

This means the application "changes" and adapts its interface and capabilities in real-time based on the user's active plan.

## 📝 License

This project is for educational purposes.

## 🙏 Acknowledgments

- **OpenStreetMap** - POI data, map tiles, and geocoding
- **Leaflet.js** - Map library
- **Unsplash** - Activity images
- **React** - UI framework
- **Vite** - Build tool

## ✅ Completed Features

### Core Application
- [x] Premium travel app UI design
- [x] Dark mode with theme toggle
- [x] User authentication with JWT tokens
- [x] PostgreSQL database integration (Neon.tech)
- [x] Advanced search with geocoding
- [x] Category filtering with multiple selection
- [x] Favorites with database persistence
- [x] Settings menu with view controls
- [x] Bottom navigation for mobile
- [x] Map view with interactive markers
- [x] Paid vs FREE activity badges
- [x] Responsive grid layouts
- [x] Smooth animations and transitions

### Subscription Tier System
- [x] Free tier with search limits (50/day)
- [x] Free tier with favorites limits (20 max)
- [x] Explorer tier with unlimited searches
- [x] Explorer tier with unlimited favorites
- [x] Explorer tier custom lists feature
- [x] Explorer tier calendar export (iCal)
- [x] Tier-based feature gating
- [x] Upgrade prompts and messaging
- [x] Backend middleware for limit enforcement

### Reliability & Performance
- [x] Offline fallback data for external API failures
- [x] Smart caching for API results
- [x] Skeleton loading states
- [x] Error handling and retry logic
- [x] Security hardening (Helmet + Rate Limiting)
- [x] **New: Enhanced Real-World Data Discovery** (polygons, historic sites, shops)
- [x] **New: Dynamic Local Fallback** (generates demo data near YOU if API fails)
- [x] Location Search fixed (race condition resolved)
- [x] Map Centering fixed (updates on search)

## 🔮 Future Enhancements

### In Progress
- [ ] Automated testing (Vitest + Playwright)
- [x] Deployment - Pushing to Render (Backend) and Vercel (Frontend) ✅

### Planned Features
- [ ] Personalized recommendations
- [ ] Price drop alerts
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Community-contributed events
- [ ] Review and ratings integration via affiliate partners
- [ ] Booking integration via affiliate partners

### 📈 Data Strategy (Future Roadmap)
We are adopting a **Hybrid Affiliate + Open Data** model to scale activity data sustainably:
1.  **Discovery Layer (Open Data)**: Continue using OpenStreetMap/OpenTripMap for broad, free, initial discovery of points of interest.
2.  **Rich Content Layer (Affiliate)**: Use **Travelpayouts** (aggregating Viator, GetYourGuide, etc.) to fetch premium content like professional photos, verified reviews, and pricing.
3.  **Monetization**: Generate revenue through affiliate commissions on bookings, sustaining the free tier for users.
4.  **AI Orchestration**: Use AI agents to intelligently match open POI data with rich affiliate products to build comprehensive itineraries without scraping or TOS violations.

## 🔑 Test Accounts

For testing different tier functionalities:

### Free Tier User
- **Email**: `testuser@test.com`
- **Password**: `testpass123`
- **Features**: 50 searches/day, 20 favorites max

### Explorer Tier User
- **Email**: `admin@activityfinder.com`
- **Password**: `Explorer2025!`
- **Features**: Unlimited searches, unlimited favorites, custom lists, calendar export

## 💡 Why No API Keys?

This app is designed to be **completely free and accessible**:
- ✅ No registration barriers
- ✅ No API key management
- ✅ Works immediately after `npm install`
- ✅ No rate limit concerns for personal use
- ✅ Privacy-friendly (no tracking)

All data comes from open, community-driven sources like OpenStreetMap!

---

**Built with ❤️ using React, TypeScript, Leaflet, and OpenStreetMap**

**100% Free • No API Keys • No Registration Required • Premium UI**
