# ATW — All Things Weather

> What's going on outside the window?

An over-engineered environmental dashboard built as a hands-on case study for **Apigee** as an API aggregation layer. Pulls live weather, air quality, UV, pollen and lunar data from several different providers, all proxied and uniformly authenticated through a single Apigee gateway.

## What it does

- **Current weather** — temperature, feels-like, humidity, wind, pressure, visibility
- **Air quality** — European AQI with pollutant breakdown (PM2.5, PM10, NO₂, O₃, CO)
- **UV index** — current + daily max, sunrise/sunset
- **6-day forecast** — daily highs/lows, conditions, precipitation, wind
- **AI-generated summary** — natural-language outlook from Gemini
- **Pollen** — grass, tree, weed risk levels with per-species breakdown
- **Satellite view** — interactive map centered on the queried location
- **Moon phase** — interactive 3D moon with real-time illumination, moonrise/moonset

## Architecture

Monorepo with a thin BFF pattern:

```
┌─────────────┐     ┌──────────────┐     ┌─────────┐     ┌─────────────────┐
│   React UI  │ ──► │  Node BFF    │ ──► │ Apigee  │ ──► │ Upstream APIs   │
│  (Vite)     │     │  (Express)   │     │ Gateway │     │ (Open-Meteo,    │
│             │     │              │     │         │     │  Ambee, Gemini, │
│             │     │              │     │         │     │  ipgeolocation) │
└─────────────┘     └──────────────┘     └─────────┘     └─────────────────┘
```

- **Frontend** — React 18, Tailwind, React Three Fiber for the 3D moon, Leaflet for the map
- **Backend** — Node.js + Express, single `/weather` endpoint that fans out to all upstream APIs in parallel and returns one consolidated payload
- **Gateway** — Apigee X handles auth (API key injection), rate limiting, caching, and request shaping

## Apigee features exercised

- Reverse proxies with path rewriting (one base URL → many upstream targets)
- API key injection via `AssignMessage` policies (both header and query-param flavors)
- KVM (Key-Value Maps) for storing secrets outside of policy XML
- Per-proxy rate limiting / quotas
- Response caching on idempotent endpoints
- Custom policy chains in PreFlow / PostFlow

## Stack

| Layer    | Tech                                                |
|----------|-----------------------------------------------------|
| Frontend | React 18, Vite, Tailwind, React Three Fiber, Leaflet|
| Backend  | Node.js, Express                                    |
| Gateway  | Apigee X                                            |
| Data     | Open-Meteo, Ambee, Gemini, ipgeolocation.io         |

## Running locally

```bash
# install deps in each workspace
cd backend  && npm install
cd ../frontend && npm install

# backend needs APIGEE_BASE_URL in .env
cd backend && npm run dev

# frontend
cd frontend && npm run dev
```

## A note on the code

This project is roughly 90% Claude-assisted — I'm not a frontend engineer, so the UI is intentionally minimal and follows whatever Claude suggested. If anything looks off, open an issue.

## Roadmap

- [ ] Geolocation auto-detect (currently manual city input)
- [ ] Historical data view
- [ ] Severe weather alerts
- [ ] User-configurable tile layout
