# 🌍 GlobeTrotter — Empowering Personalized Travel Planning

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.19-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.18-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat&logo=leaflet&logoColor=white)](https://leafletjs.com/)

> **GlobeTrotter** is a personalized, intelligent, and collaborative end-to-end travel planning platform built for the **Odoo Hackathon**. It empowers travelers to discover destinations worldwide, build multi-city day-wise itineraries, track category-level budgets with live progress bars, visualize journeys across master calendars, and share trips within a vibrant community.

---

## 🌟 Key Highlights & Innovations

* 🗺️ **Interactive Leaflet World Map & Geocoding:** Pinned global destinations with smooth `flyTo` camera transitions, reverse-geocoding on map click, and custom popup cards.
* 📸 **Real Place Photography & Live Intelligence:** Integrated Wikipedia REST API & OpenStreetMap to retrieve genuine high-res photographs and historical overviews for any monument, city, or landmark worldwide.
* 💰 **Multi-Segment Smart Budget Planner:** Category-by-category allocation (*Transport, Accommodation, Meals, Activities, Other*), automatic sum calculations, real-time spending progress bars, and budget alert thresholds.
* 🗓️ **Master Travel Calendar & Journey Spans:** Multi-day colored trip bars across monthly grids, upcoming journey countdowns, and date-level activity inspectors.
* 🔐 **6-Digit Email OTP Security:** Secure two-step email OTP verification for password changes and password resets via Nodemailer.
* 👥 **Community Trips Hub & 1-Click Clone:** Public itinerary sharing with custom secret links, social share buttons (WhatsApp, Twitter/X, Email), and 1-click trip cloning.
* 🛡️ **Admin Intelligence & Control Center:** Analytics dashboard with user growth tracking, top visited cities ranking, activity categories distribution, user role management (`USER` ↔ `ADMIN`), and catalog controls.

---

## 💻 Tech Stack & Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GLOBETROTTER ARCHITECTURE                       │
├────────────────────┬────────────────────────────┬──────────────────────┤
│   FRONTEND LAYER   │       BACKEND LAYER        │    DATABASE & DATA   │
├────────────────────┼────────────────────────────┼──────────────────────┤
│ • React 18 (Hooks) │ • Node.js Runtime          │ • PostgreSQL 14+     │
│ • Vite 5.4 Bundler │ • Express.js REST API      │ • Prisma ORM v5.18   │
│ • TailwindCSS v3.4 │ • JWT & 30-Day Persistence │ • Leaflet & OSM      │
│ • React Router v6  │ • Nodemailer OTP Service   │ • Wikipedia REST API │
│ • React Leaflet    │ • Multer File Disk Storage │ • Unsplash Media CDN │
│ • React Hot Toast  │ • Helmet & Security Guard  │                      │
└────────────────────┴────────────────────────────┴──────────────────────┘
```

---

## 📋 Comprehensive Feature Compliance (All 13 PDF Screens)

| # | Screen / Module | Key Capabilities & Features |
|:---:|---|---|
| **1** | **Auth & Security** | Signup, Login, 30-day persistent sessions, Forgot Password & **6-digit Email OTP Verification** for password changes. |
| **2** | **Dashboard / Home** | Personalized traveler welcome, quick stats, active trip cards with progress bars, and curated destination highlights. |
| **3** | **Create Trip** | Title, date ranges, description, custom cover image upload, and **Suggested Plans & Inspiration Sidebar** with 1-click templates. |
| **4** | **My Trips** | Filterable grid (*All, Planning, Upcoming, Ongoing, Completed*), live search, stop counts, and edit/delete actions. |
| **5** | **Itinerary Builder** | Add sequential multi-city stops, specify travel dates, reorder routes, and schedule day-by-day activities. |
| **6** | **Itinerary View** | Chronological timeline, city headers, activity blocks with cost and start/end times, and direct view toggles. |
| **7** | **City Discovery** | Search 25+ global cities (*Ahmedabad, Paris, Tokyo, NYC, Bali, Rome, Mumbai, etc.*), continent filters, cost ratings, and dedicated City Guides. |
| **8** | **Activity Discovery** | Search and filter thousands of experiences by category (*Sightseeing, Adventure, Food, Culture, Nature*) and price. |
| **9** | **Budget & Expense Tracker** | Multi-segment stacked category progress bars, donut allocation charts, category **Spent vs Allocated** trackers, and auto-summing. |
| **10** | **Calendar & Timeline** | Master monthly calendar grid with multi-day journey span bars, upcoming plans countdown, and date-level activity inspector. |
| **11** | **Shared & Public Trips** | Public sharable URL with secret tokens, read-only itinerary view, **Copy Trip** 1-click clone, and WhatsApp/Twitter sharing. |
| **12** | **User Profile & Settings** | Profile photo avatar upload, bio & country preferences, password change with 2-step OTP modal, and account management. |
| **13** | **Admin Intelligence Suite** | Top KPI stats, user growth velocity, top visited cities ranking table, activity category breakdown charts, user role promotion/demotion, and destination management. |

---

## 📁 Repository Structure

```
GlobeTrotter/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # PostgreSQL relational schema
│   │   └── seed.js             # 25+ Destinations, demo accounts, sample trips
│   ├── src/
│   │   ├── config/             # Database & environment configurations
│   │   ├── controllers/        # Auth, Trip, Stop, Activity, Budget, Destination, Admin
│   │   ├── middleware/         # JWT Auth, Role Guard, File Upload, Error Handler
│   │   ├── routes/             # RESTful API routing
│   │   ├── services/           # Business logic & Prisma ORM queries
│   │   ├── utils/              # Email Nodemailer, Token, Password Hashing
│   │   └── index.js            # Express server initialization
│   ├── uploads/                # User avatars and uploaded trip cover images
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, Modals, Buttons, Shared UI elements
│   │   ├── context/            # AuthContext & global state
│   │   ├── layouts/            # AppLayout (Sidebar) & PublicLayout
│   │   ├── pages/
│   │   │   ├── admin/          # AdminPage (Intelligence & User Tools)
│   │   │   ├── auth/           # LoginPage, SignupPage, ForgotPasswordPage
│   │   │   ├── discover/       # DiscoverCitiesPage, DiscoverActivitiesPage, DestinationDetailPage
│   │   │   ├── profile/        # ProfilePage (Avatars, OTP Password Change)
│   │   │   └── trips/          # CreateTripPage, TripsPage, TripDetailPage, BudgetPage,
│   │   │                       # GlobalBudgetPage, CalendarPage, GlobalCalendarPage,
│   │   │                       # GlobalItineraryPage, CommunityPage, SharedTripPage
│   │   ├── services/           # Axios API connectors
│   │   └── styles/             # TailwindCSS & Leaflet design system
│   └── package.json
└── README.md
```

---

## ⚡ Quickstart & Setup Guide

### 1. Prerequisites
- **Node.js** >= 18.x
- **PostgreSQL** >= 14.x running on port `5432`
- **npm** >= 9.x

---

### 2. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/PrajapatiAbhishek-A194army/GlobeTrotter.git
cd GlobeTrotter

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

---

### 3. Configure Environment Variables

Create `.env` in `backend/`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:A194army@localhost:5432/globalTrotter?schema=public"
JWT_SECRET="globetrotter_super_secret_jwt_key_2026"
JWT_EXPIRES_IN="30d"
CLIENT_URL="http://localhost:5173"
```

---

### 4. Database Migration & Seeding

```bash
cd backend

# Push schema to PostgreSQL
npx prisma db push

# Seed 25+ Global Destinations, Demo Accounts & Sample Itineraries
npm run db:seed
```

---

### 5. Start Development Servers

**Terminal 1 — Backend Server:**
```bash
cd backend
npm run dev
# Running on http://localhost:5000
```

**Terminal 2 — Frontend Client:**
```bash
cd frontend
npm run dev
# Running on http://localhost:5173
```

---

## 🔑 Default Demo Accounts

| Role | Email | Password | Access / Notes |
|---|---|---|---|
| **Platform Administrator** | `admin@globetrotter.app` | `Admin@123` | Full access to `/admin` Analytics & User Tools |
| **Traveler (Completed Trips)** | `priya.sharma@demo.com` | `Travel@123` | Pre-loaded with European & Asian itineraries |
| **Traveler (Upcoming Trips)** | `james.walker@demo.com` | `Travel@123` | Pre-loaded with upcoming Tokyo trip |
| **Traveler (Planning Trips)** | `sofia.reyes@demo.com` | `Travel@123` | Pre-loaded with Bali planning itinerary |

---

## 📡 RESTful API Endpoints Summary

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a new account
* `POST /api/auth/login` — Authenticate and receive JWT
* `GET /api/auth/me` — Retrieve current authenticated profile
* `POST /api/auth/send-otp` — Dispatch 6-digit email OTP for password change
* `POST /api/auth/verify-otp` — Validate 6-digit email OTP
* `PATCH /api/auth/change-password` — Change password with OTP or current password

### Trips & Itineraries (`/api/trips`)
* `GET /api/trips` — Get user trips with status and search filters
* `POST /api/trips` — Create a new trip (supports destination pre-fills)
* `GET /api/trips/:id` — Get trip details with stops and activities
* `PATCH /api/trips/:id` — Update trip details and cover image
* `DELETE /api/trips/:id` — Delete trip
* `POST /api/trips/:id/copy` — Clone a community trip into user account

### Stops & Activities (`/api/trips/:id/stops` & `/api/stops/:stopId/activities`)
* `POST /api/trips/:id/stops` — Add a new destination stop
* `PATCH /api/stops/:stopId` — Update stop dates or order
* `POST /api/stops/:stopId/activities` — Add scheduled activity with costs and times
* `PATCH /api/activities/:activityId` — Edit activity details

### Budgets (`/api/trips/:id/budget`)
* `GET /api/trips/:id/budget` — Get trip budget with category actual spend breakdowns
* `PUT /api/trips/:id/budget` — Update allocations with auto-sum calculation

### Destinations (`/api/destinations`)
* `GET /api/destinations` — Search destinations with continent & typo-tolerant fuzzy matching
* `GET /api/destinations/:id` — Retrieve city guide with curated experiences & highlights

### Admin Intelligence (`/api/admin`)
* `GET /api/admin/stats` — Platform-wide analytics, popular cities ranking, category distribution
* `GET /api/admin/users` — Search and manage user accounts
* `PATCH /api/admin/users/:id/role` — Promote/demote user roles (`USER` ↔ `ADMIN`)
* `DELETE /api/admin/users/:id` — Delete user account
* `GET /api/admin/trips` — Platform-wide itinerary inspector

---

## 📄 License & Attribution
Developed with ❤️ by **Abhishek Prajapati** (`PrajapatiAbhishek-A194army`) for the **Odoo Hackathon**.
Licensed under the [MIT License](LICENSE).