# 🌍 GlobeTrotter

> A personalized travel planning platform — plan multi-city trips, build day-wise itineraries, discover destinations, estimate budgets, and share your adventures.

Built for the **Odoo Hackathon** using a full-stack modern tech stack.

---

## 🚀 Tech Stack

| Layer      | Technology                                        |
|------------|---------------------------------------------------|
| Frontend   | React, Vite, Tailwind CSS, React Router, Recharts, FullCalendar, Leaflet |
| Backend    | Node.js, Express.js, Prisma ORM, JWT, bcrypt      |
| Database   | PostgreSQL                                        |

---

## 📁 Project Structure

```
GlobeTrotter/
├── frontend/          # React + Vite application
├── backend/           # Node.js + Express API
└── README.md
```

---

## ⚙️ Setup

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 14
- npm >= 9

### 1. Clone & Install

```bash
git clone <repo-url>
cd GlobeTrotter

# Install frontend deps
cd frontend && npm install

# Install backend deps
cd ../backend && npm install
```

### 2. Configure Environment

```bash
# In backend/
cp .env.example .env
# Fill in your DATABASE_URL, JWT_SECRET, PORT, etc.
```

### 3. Initialize Database

```bash
cd backend
npx prisma db push       # Apply schema to PostgreSQL
npx prisma generate      # Generate Prisma client
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000

---

## 📦 Modules

- **Authentication** — Signup, Login, JWT, Password Reset
- **Dashboard** — Upcoming trips, Budget highlights, Destinations
- **Trip Management** — Create, Edit, Delete trips with cover images
- **Itinerary Builder** — Multi-city stops, day-wise activities
- **City & Activity Discovery** — Search, filters, Leaflet maps
- **Budget Module** — Cost breakdown, Recharts visualizations
- **Calendar & Timeline** — FullCalendar integration, drag-and-drop
- **Shared Trips** — Public links, read-only itinerary sharing
- **Profile** — User preferences, saved destinations
- **Admin Dashboard** — Analytics, popular cities, trip statistics

---

## 🌿 Development Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Project Foundation | ✅ Complete |
| 2 | Landing Page & Design System | 🔄 Pending |
| 3 | Authentication | 🔄 Pending |
| 4–12 | Feature Modules | 🔄 Pending |

---

## 🔐 Security

- All secrets stored in `.env` (never committed)
- JWT authentication on protected routes
- Password hashing via bcrypt
- Input validation on all endpoints

---

*GlobeTrotter — Odoo Hackathon Project*