# Google Places API Integration

## Overview
Added Google Places API (New) to the backend search features to improve data quality, real photos, and authentic reviews.

## Architecture & Flow
- File: `backend/src/tiers/free/features/search.js`
- Method: Uses `https://places.googleapis.com/v1/places:searchText` via POST request.
- Data merging: The backend now concurrently fetches from:
  1. Overpass API (OpenStreetMap)
  2. Ticketmaster API
  3. Google Places API
- Results are mapped to the generic `Activity` type, merged into a single list, sorted by distance, and returned to the frontend.

## Key Decisions
- **Augmentation over Replacement:** Instead of fully replacing OSM, Google Places API results are merged with OSM and TM results. This provides a rich mix of tourist attractions, real events, and highly accurate Google Places data (specifically for Food, Museums, and Parks).
- **Google Photos API:** Image references returned by the search are automatically parsed into full URL requests (`https://places.googleapis.com/v1/{photo.name}/media`) to serve high-quality photos.

## Configuration
Requires `GOOGLE_PLACES_API_DEMO` environment variable in the backend `.env`.

## Status
Completed and verified working in production.
