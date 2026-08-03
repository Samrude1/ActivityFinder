# Project Memory

## Ground Truth
- The project is a travel-inspired web application for discovering local activities ("Activity Finder").
- Features a frontend built with React, Vite, and Leaflet, and a backend using Node.js/Express with both SQLite and PostgreSQL support.
- Implements a modular tier system (Free vs Explorer) where premium features are isolated in specific directories.
- Basic features like map view, list view, search with geocoding, favorites, and tier-based limits are fully implemented.
- The app uses open data (OpenStreetMap/Nominatim/Overpass API) rather than requiring paid API keys.

## Current State
- The frontend and backend are functional and running locally via `npm run dev` (frontend) and `npm start` (backend).
- Codebase is organized, cleanly separating concerns between frontend components and backend middleware/controllers.

## What works currently
- Search functionality (with limits for Free tier).
- Map and List view toggling.
- Favorites system and custom lists (for Explorer).
- JWT Authentication and rate-limiting.

## Unfinished / Next Steps
- Automated testing (Vitest + Playwright) is marked as "In Progress".
- Personalized recommendations, push notifications, and affiliate bookings are planned.
- Migration of Free tier components to `src/tiers/Free/` is planned (currently in `src/components/`).

## Immediate User Requests
- Get familiar with the project using the `legacy-project-onboarding.md` workflow.
