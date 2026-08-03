# Feature: Ticketmaster Integration

**Status:** Completed
**Date:** 2026-08-03

## Overview
Added Ticketmaster Discovery API integration alongside the Overpass API to fetch real, live events (music, sports, theater) for users. This complements the static location data (restaurants, museums, parks) provided by OpenStreetMap.

## Implementation Details
1. **Backend Integration (`backend/src/tiers/free/features/search.js`)**:
   - Integrated `fetchTicketmasterActivities` to run concurrently with `fetchOverpassActivities` using `Promise.all`.
   - Created a dynamic tag mapper to convert our UI categories (`Music`, `Sports`, `Arts & theater`, `Family`) into Ticketmaster's `classificationName`.
   - Mapped Ticketmaster's `event._embedded.venues` to our `Activity.location` model.
   - Handled Ticketmaster's high-res images to populate the `Activity.gallery`.
   - Sorted the combined results globally by Haversine distance from the user's searched coordinates.
   - Implemented limits (`size=15` for TM, `slice(0,15)` for OSM) and a global slice to 30 items to keep payload sizes and processing fast.
   
2. **Environment**:
   - Consumes `TICKETMASTER_API_KEY` from `process.env`.

## Resulting Architecture
The backend search engine is now a hybrid fetcher. It selectively hits Overpass, Ticketmaster, or both based on user category selection. No frontend model changes were required as the mapping fully conforms to the expected UI `Activity` interface.
