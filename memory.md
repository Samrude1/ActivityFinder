# Memory — Search Optimizations & UI Overhaul

Last updated: 2026-08-03

## What was built

- **Backend (search.js):** 
  - Increased Overpass API fetch limit to 60 elements to provide broader, more diverse results for frontend filtering.
  - Extracted OpenStreetMap tags (opening hours, website, phone, wheelchair accessibility) into `features` array.
  - Replaced broken Unsplash placeholder URLs with `loremflickr.com` for 100% reliable, category-specific imagery.
  - Implemented automatic Google Maps search URL generation when a place lacks a formal website.
  - Added a 2-second timeout constraint to Wikimedia requests to prevent server hanging.
  - Added in-memory `SEARCH_CACHE` (24h TTL) to drastically speed up repeated searches.
- **Frontend (SearchPage.tsx & ActivityDetail.tsx):**
  - Expanded filter chips to include "Food", "Museums", "Culture", "Nightlife", "Music", and "Sports".
  - Refactored `ActivityDetail.tsx` to completely remove old Yelp branding, replacing it with provider-agnostic "Provider Details", "Get Tickets", or "View on Google Maps" buttons.
  - Added a fast `sessionStorage` cache so hitting the "Back" button to return to search results is literally instant.

## Decisions made

- Switched from Unsplash to LoremFlickr for fallback images, since Unsplash requires hardcoding specific, verified photo IDs which are prone to 404 errors.
- Aggressively cache search requests on both the frontend (session) and backend (memory) to hide third-party API latencies (like Wikipedia).

## Problems solved

- Fixed frontend filter starvation: "Nightlife" and "Sports" searches previously returned 0 results because the backend was hard-capped at 15 items, meaning less common categories never reached the frontend. Raising the limit to 60 fixed this.
- Fixed a React white-screen crash in `ActivityCard.tsx` caused by calling `.toFixed(1)` on a stringified rating variable.
- Fixed infinite "Loading activities..." hangs caused by backend restarts interrupting frontend fetches.

## Current state

- The search pipeline (Overpass + Ticketmaster) is fast, robust, and heavily cached. The UI correctly displays diverse events with reliable images and rich metadata details. 

## Next session starts with

- Building out the remaining planned UI flows, verifying user authentication logic, or expanding the "Home Custom Lists" and personalized recommendations for the Explorer tier.

## Open questions

- None at the moment.
