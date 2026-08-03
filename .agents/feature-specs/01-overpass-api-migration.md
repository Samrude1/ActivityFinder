# Feature: Overpass API + Wikimedia Migration

**Status:** Completed
**Date:** 2026-08-03

## Overview
Replaced the commercial Yelp Fusion API with 100% open and free data providers (Overpass API and Wikimedia Action API) in the `search.js` backend logic. This removes any requirement for users to register for API keys or provide credit card information, aligning with the project's goal of using open data.

## Implementation Details
1. **Backend Integration (`backend/src/tiers/free/features/search.js`)**:
   - Mapped internal application categories (`Food`, `Museums`, `Nightlife`, etc.) to OpenStreetMap tags (`amenity`, `tourism`, `leisure`).
   - Built a dynamic Overpass QL query to fetch nodes, ways, and relations within the requested radius (max 25km).
   - Filtered results to require a `name` tag to ensure high-quality locations.
   - For locations with a `wikipedia` or `wikidata` tag, asynchronously fetch the main image using the Wikimedia Action API.
   - Implemented a seeded Unsplash fallback for locations without Wikimedia images.
   
2. **Environment**:
   - Removed `YELP_API_KEY` from `backend/.env`.

## Resulting Architecture
The backend search now relies entirely on HTTP calls to `https://overpass-api.de/api/interpreter` and `https://en.wikipedia.org/w/api.php`, requiring no authentication headers.
