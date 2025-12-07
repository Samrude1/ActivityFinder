# Activity Finder �

A premium travel-inspired web application to discover free and paid local activities, points of interest, and events using location-based search, interactive maps, and smart filtering.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat&logo=leaflet&logoColor=white)

## ✨ Features

### Core Features
- 🗺️ **Interactive Map View** - Visualize activities on an interactive Leaflet map with custom markers
- 📋 **Premium List View** - Browse activities in beautiful, image-focused cards
- 📍 **Smart Location Search** - Search any location worldwide (Helsinki, Porvoo, etc.) with Enter key support
- 🎯 **Category Filtering** - Filter by Outdoor, Cultural, Sports, Music, Food, Family
- ❤️ **Favorites System** - Save activities with full data persistence
- 📱 **Mobile-First Design** - Bottom navigation, responsive layouts
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 👤 **User Accounts** - Full authentication system with persistent storage

### Premium UI/UX
- 🎨 **Modern Travel App Design** - Large image cards with gradient overlays
- ✨ **Smooth Animations** - Micro-interactions and transitions
- 🔄 **Horizontal Scrolling** - Featured activities carousel
- ⚙️ **Settings Menu** - Centralized controls for view mode, favorites, and preferences
- 🏠 **Quick Navigation** - Main button in map view to return to list
- 💰 **Clear Pricing** - FREE (green) and Paid (red) badges

### Advanced Features
- 🔍 **Functional Search** - Type location and press Enter to update results
- � **Radius Control** - Adjust search range (5km - 100km) in map view
- 🎭 **Multiple Results** - Grid layout showing all matching activities
- 🔀 **View Switching** - Seamless toggle between list and map modes
- 📄 **Activity Details** - Full information pages with sharing capabilities

### ⚡ Performance & Reliability
- 💀 **Skeleton Screens** - Instant visual feedback while loading data
- 💤 **Lazy Loading** - Images and routes load only when needed
- 💾 **Smart Caching** - API results cached to minimize network requests
- 🔄 **Auto-Retry** - Automatic failure recovery for API requests
- 🌍 **Robust Fallback** - Defaults to Helsinki if GPS/Search fails
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
- **State**: React Context API
- **Backend**: Node.js/Express with SQLite database

### Project Structure

```
basicapp/
├── src/
│   ├── components/          # UI Components
│   ├── contexts/            # Global State (Auth)
│   ├── services/            # API Clients (see APIS.md)
│   ├── hooks/               # Custom Hooks
│   └── types/               # TypeScript Interfaces
1. **Frontend Setup**
   ```bash
   # Install frontend dependencies
   npm install
   ```

2. **Backend Setup**
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

### Deployment
This is a static web application that can be deployed to any static host.
**[👉 Click here for our Step-by-Step Deployment Guide (Free)](./docs/DEPLOYMENT.md)**

- **Frontend**: Vercel, Netlify
- **Backend**: Render, Railway

## 🤖 Agent Orchestration
This project is developed with **Antigravity AI**:
- **Role**: Full-stack developer & Architect.
- **Workflow**: Plan -> Implement -> Verify.
- **Artifacts**: All planning docs stored in `.gemini/antigravity`.

## 📝 License

This project is for educational purposes.

## 🙏 Acknowledgments

- **OpenStreetMap** - POI data, map tiles, and geocoding
- **Leaflet.js** - Map library
- **Unsplash** - Activity images
- **React** - UI framework
- **Vite** - Build tool

## ✅ Completed Features

- [x] Premium travel app UI design
- [x] Dark mode with theme toggle
- [x] User accounts (simulated)
- [x] Advanced search with location input
- [x] Category filtering with multiple selection
- [x] Favorites with full data persistence
- [x] Settings menu with view controls
- [x] Bottom navigation for mobile
- [x] Map view with Main button
- [x] Paid vs FREE activity badges
- [x] Responsive grid layouts
- [x] Smooth animations and transitions

## 🔮 Future Enhancements

- [ ] Calendar export (iCal)
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Community-contributed events
- [ ] Reviews and ratings from real users
- [ ] Photo galleries
- [ ] Booking integration

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
