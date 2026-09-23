# 🚆 RailSathi — Live Indian Train Tracker & AI Travel Companion

**RailSathi** is a modern, real-time Indian Railways tracking platform built with **Next.js 14**, **MapLibre GL**, **TanStack Query**, and **Google Gemini 3.6 Flash AI**. It offers live train telemetry, vector map visualization, delay analytics, weather intelligence, elevation profiles, and an interactive AI travel assistant in both **English** and **Hindi**.

Developed by **hamesh** (CGIT Raipur).

---

## 🌐 Live Demo

🌐 **Live Website:** [https://railsathi.netlify.app](https://railsathi.netlify.app) *(or your Netlify/Vercel URL)*

---

## ✨ Features

- 🛰️ **Live Train Telemetry:** Real-time GPS location tracking, speed monitoring, and ETA predictions via RailRadar API.
- 🗺️ **Interactive Vector Maps:** Dark-themed MapLibre GL vector maps with smooth marker movement, route glow, and follow-camera mode.
- 🤖 **Gemini 3.6 Flash AI Assistant:** AI travel companion providing personalized food recommendations, delay forecasts, scenic spot highlights, and station amenity guides.
- 🌦️ **Live Weather Intelligence:** Real-time temperature, condition, and comfort advisories powered by OpenWeather API.
- 🏔️ **Terrain & Altitude Profiles:** SRTM elevation profiles along the train route powered by OpenTopography.
- ⏱️ **Delay Analytics:** Delay trends, station-by-station history, and recovery forecasts.
- 🌐 **Bilingual Support (EN / HI):** One-click toggle between English and Hindi (हिंदी) script.
- 📱 **Responsive PWA:** Mobile-first design with quick search, offline fallback intelligence, and smooth animations.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Library:** [React 18](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **State & Data Fetching:** [TanStack Query v5](https://tanstack.com/query) & [Zustand](https://zustand-demo.pmnd.rs/)
- **Vector Maps:** [MapLibre GL](https://maplibre.org/) & [MapTiler](https://www.maptiler.com/)
- **AI Model:** [Google Gemini 3.6 Flash API](https://ai.google.dev/)
- **Icons & UI:** [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or later
- **npm** or **yarn** or **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/spider714/RailGaadi.git
   cd RailGaadi
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory (refer to `.env.example`):
   ```env
   RAILRADAR_API_KEY=your_railradar_api_key
   NEXT_PUBLIC_MAPTILER_API_KEY=your_maptiler_api_key
   OPENWEATHER_API_KEY=your_openweather_api_key
   OPENTOPOGRAPHY_API_KEY=your_opentopography_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 📦 Project Structure

```text
├── app/                  # Next.js 14 App Router routes & API endpoints
│   ├── api/              # Backend API proxies (AI, train, weather, terrain, POI)
│   ├── train/[id]/       # Live train details dashboard
│   ├── layout.tsx        # Root layout & providers
│   └── page.tsx          # Homepage with quick train search
├── components/           # Shared UI components (Navbar, Footer, Timeline, Cards)
├── config/               # Application configuration & env handlers
├── features/             # Feature modules (AI, maps, weather, analytics, POI)
├── hooks/                # Custom React hooks (search, live journey polling)
├── lib/                  # External API service wrappers (Gemini, RailRadar, etc.)
├── store/                # Zustand global stores (language, recent searches)
├── public/               # Static assets & PWA manifest icons
└── types/                # TypeScript interface definitions
```

---

## 🛠️ Scripts

- `npm run dev` – Starts the development server.
- `npm run build` – Builds the application for production.
- `npm start` – Starts the production server.
- `npm run lint` – Runs Next.js ESLint checks.

---
