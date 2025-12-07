# � API & Data Sources Documentation

This document details all external APIs and data sources used in the Activity Finder application.

## 📊 Overview

| API Name | Purpose | Cost | Auth Required | Location in Code |
|----------|---------|------|---------------|------------------|
| **Nominatim (OSM)** | Geocoding (Address ↔ Coordinates) | 🆓 Free | ❌ No | `src/services/geocoding.ts` |
| **Overpass API (OSM)** | Fetching Points of Interest (Activities) | 🆓 Free | ❌ No | `src/services/activityService.ts` |
| **OpenStreetMap Tiles** | Map background tiles | 🆓 Free | ❌ No | `src/components/MapView.tsx` |
| **Unsplash Images** | Activity placeholder images | 🆓 Free | ❌ No | `src/services/activityService.ts` |

---

## 🌍 OpenStreetMap Nominatim API

**Purpose**: Converts user-entered addresses (e.g., "Helsinki") into geographic coordinates (lat/lng) for the map, and vice-versa.

- **Base URL**: `https://nominatim.openstreetmap.org`
- **Endpoints Used**:
  - `/search`: Forward geocoding.
  - `/reverse`: Reverse geocoding (current location lookup).
- **Cost**: Free.
- **Constraints**:
  - Max 1 request per second.
  - Must provide a valid `User-Agent` header (implemented as `FreeActivityFinder/1.0`).
- **Implementation**:
  - see `geocodeAddress` and `reverseGeocode` functions in `src/services/geocoding.ts`.

---

## 🏢 OpenStreetMap Overpass API

**Purpose**: Retrieves real-time data about "Point of Interest" (POI) nodes within a specific radius of the user's location.

- **Base URL**: `https://overpass-api.de/api/interpreter`
- **Endpoints Used**:
  - Main interpreter endpoint (POST request with Overpass QL query).
- **Cost**: Free.
- **Data Fetched**:
  - Parks, sports centers, playgrounds (Leisure).
  - Museums, galleries, attractions (Tourism).
  - Libraries, theaters, cafes, restaurants (Amenity).
- **Constraints**:
  - Fair usage policy applies.
  - Heavy queries may time out (set to 25s in code).
- **Implementation**:
  - see `fetchOpenStreetMapPOIs` in `src/services/activityService.ts`.

---

## 🗺️ OpenStreetMap Tile Server

**Purpose**: Provides the visual map tiles displayed in the `MapView` component.

- **URL Pattern**: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- **Cost**: Free.
- **Implementation**:
  - Used via `react-leaflet`'s `<TileLayer>` component.

---

## 🖼️ Unsplash Source (Image Placeholder)

**Purpose**: Provides high-quality random images for activities that don't have their own specific photos.

- **URL Pattern**: `https://images.unsplash.com/photo-{id}?w=400`
- **Cost**: Free.
- **Implementation**:
  - Used in `MOCK_ACTIVITIES` within `src/services/activityService.ts`.

---

## � Data Fetching Strategy

1.  **User Search**:
    *   User types a location ➔ **Nominatim API** returns coordinates.
2.  **Activity Loading**:
    *   App sends coordinates + radius to **Overpass API**.
    *   App combines real API results with curated `MOCK_ACTIVITIES` (local fallback data).
    *   Distances are calculated locally using the Haversine formula.
3.  **Display**:
    *   All data is normalized into the `Activity` interface and displayed in the UI.