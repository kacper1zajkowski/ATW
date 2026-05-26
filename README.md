# 🌍 ATW — All Things Weather

> *What's going on outside the window?*
## [atw.zajkowski.cloud](https://atw.zajkowski.cloud/)
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

```mermaid
---
config:
  look: handDrawn
  theme: dark
---
flowchart LR
    UI([React UI<br/>Vite]) --> BFF([Node BFF<br/>Express])
    BFF --> Apigee([Apigee X<br/>Gateway])
    Apigee --> Upstream([Upstream APIs,<br/> Open-Meteo, Ambee<br/>ipgeolocation, Gemini])
```


- **Frontend** — React 18, Tailwind, React Three Fiber for the 3D moon, Leaflet for the map
- **Backend** — Node.js + Express, single `/weather` endpoint that fans out to all upstream APIs in parallel and returns one consolidated payload
- **Gateway** — Apigee X handles auth (API key injection), rate limiting, caching, and request shaping

## Apigee features used

- Registered API Product with App credentials
- Reverse proxies with path rewriting (base URL for `v1/weather` and `v1/forecast-summary` → many upstream targets)
- Nearly 100% logic of creating forecast moved to JS policies inside proxies
- KVM (Key-Value Maps, or Key-Value) for storing secrets outside of policy XML
- Caching for repetetive data, HIT/MISS indicator in header

```mermaid
---
config:
  theme: dark
---
flowchart TD
    Start([Client<br/>GET /v1/weather?q=location]) --> Common([Insert shared flow- Verify API Key & apply KV Map])
    Common --> Normalize([Make sure that query suits via JS-NormalizeQuery])
    Normalize --> GeoQ{requires<br/>geocode?}
    GeoQ -->|city name, so yes| PrepGeo([Prepare Geocode Request, Ask about Geocode, Extract values])
    GeoQ -->|coords already in lat,lon| Round(["Round coords, make 'em better for cache"])
    PrepGeo --> Round
    Round --> Lookup(["Lookup cache"])
    Lookup --> n2@{ shape: "diam", label: "HIT or MISS?" }
    n2 -->|"MISS"| n4@{ shape: "stadium", label: "Ask for weather, AQI, Pollen, astro data & put it into nice structure" }
    n2 -->|"HIT"| n3@{ shape: "stadium", label: "use cached data" }
    n4 --> n5["Build response + Cache status"]
    n3 --> n5
	
	
	
	
	
	linkStyle 4 color:#000000
	linkStyle 3 color:#000000
	
	
	
	
	linkStyle 8 color:#000000
	linkStyle 9 color:#000000
	
	
	style Start fill:#A6A6A6,color:#000000,stroke-width:2px,stroke:#000000
	style Common fill:#A6A6A6,color:#000000,stroke:#000000,stroke-width:2px
	style Normalize fill:#A6A6A6,color:#000000,stroke:#000000,stroke-width:2px
	style GeoQ fill:#A6A6A6,color:#000000,stroke-width:2px,stroke:#000000
	style PrepGeo fill:#A6A6A6,color:#000000,stroke-width:2px,stroke:#000000
	style Lookup fill:#D9D9D9,color:#000000,stroke-width:2px,stroke-dasharray:5 5,stroke:#000000
	style Round fill:#A6A6A6,color:#000000,stroke-width:2px,stroke:#000000
	style n2 fill:#A6A6A6,color:#000000,stroke-width:1px,stroke:#000000
	style n4 color:#000000,fill:#A6A6A6,stroke:#000000,stroke-width:2px
	style n3 color:#000000,fill:#A6A6A6,stroke-width:2px,stroke:#000000
	style n5 fill:#A6A6A6,color:#000000,stroke:#00BF63,stroke-width:2px,stroke-dasharray:5 5

```



## ROADMAP TODO'S

### Apigee
- Fallback api for crucial weather data
- CloudLogging for cache hits, unauthorized request, quota alerts
- Mock API Tiering, quota per API Product- for example, weather + forecast for free tier, extra data with *"premium"* plan

### Source Code
- Couple repetitions in **/atw-weather/targets/default.xml** policy

### IaC & CICD
- Terraform files for apigee policies
- GitHub Actions

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

### Note for front

This project is roughly 90% Claude-assisted — I'm not a frontend engineer, so the UI is intentionally minimal and follows whatever Claude suggested. If anything looks off, open an issue.

