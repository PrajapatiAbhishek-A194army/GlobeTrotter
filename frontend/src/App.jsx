import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Auth context
import { AuthProvider, useAuth } from './context/AuthContext'

// Phase 2 — Landing
import LandingPage from './pages/LandingPage'
import PublicLayout from './layouts/PublicLayout'

// Phase 3 — Auth pages
import LoginPage          from './pages/auth/LoginPage'
import SignupPage         from './pages/auth/SignupPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage  from './pages/auth/ResetPasswordPage'

// Phase 4 — Dashboard
import DashboardPage from './pages/dashboard/DashboardPage'
import AppLayout     from './layouts/AppLayout'

// Phase 5 — Trip Management
import TripsPage      from './pages/trips/TripsPage'
import CreateTripPage from './pages/trips/CreateTripPage'
import TripDetailPage from './pages/trips/TripDetailPage'
import EditTripPage   from './pages/trips/EditTripPage'

// Phase 6 — Itinerary Builder
import ItineraryPage from './pages/trips/ItineraryPage'

// Phase 7 — Discovery
import DiscoverCitiesPage     from './pages/discover/DiscoverCitiesPage'
import DiscoverActivitiesPage from './pages/discover/DiscoverActivitiesPage'

// Phase 8 — Budget Planner
import BudgetPage from './pages/trips/BudgetPage'

// Phase 9 — Trip Calendar
import CalendarPage from './pages/trips/CalendarPage'

// Phase 10 — Profile
import ProfilePage from './pages/profile/ProfilePage'

// Auth guard
import ProtectedRoute from './components/ProtectedRoute'

// ── Placeholders for future phases (replaced in their respective phases) ──────

const PlaceholderPublic = ({ title }) => (
  <PublicLayout>
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🌍</span>
        </div>
        <h1 className="font-display font-bold text-xl text-neutral-800 mb-2">{title}</h1>
        <p className="text-neutral-500 text-sm">Coming soon — Phase development in progress</p>
      </div>
    </div>
  </PublicLayout>
)

const PlaceholderApp = ({ title }) => (
  <AppLayout>
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🌍</span>
        </div>
        <h1 className="font-display font-bold text-xl text-neutral-800 mb-2">{title}</h1>
        <p className="text-neutral-500 text-sm">Coming soon — Phase development in progress</p>
      </div>
    </div>
  </AppLayout>
)

// ── Smart route: redirects logged-in users away from /login & /signup ─────────
function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return children
}

// ── App Routes ────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* ── Phase 2 — Landing ── */}
      <Route path="/" element={<LandingPage />} />

      {/* ── Phase 3 — Auth (guest-only) ── */}
      <Route path="/login" element={
        <GuestRoute><LoginPage /></GuestRoute>
      }/>
      <Route path="/signup" element={
        <GuestRoute><SignupPage /></GuestRoute>
      }/>
      <Route path="/forgot-password" element={
        <GuestRoute><ForgotPasswordPage /></GuestRoute>
      }/>
      <Route path="/reset-password/:token" element={
        <GuestRoute><ResetPasswordPage /></GuestRoute>
      }/>

      {/* ── Phase 4 — Dashboard (protected) ── */}
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      }/>

      {/* ── Phase 5 — Trip Management (protected) ── */}
      <Route path="/trips" element={
        <ProtectedRoute><TripsPage /></ProtectedRoute>
      }/>
      <Route path="/trips/new" element={
        <ProtectedRoute><CreateTripPage /></ProtectedRoute>
      }/>
      <Route path="/trips/:id" element={
        <ProtectedRoute><TripDetailPage /></ProtectedRoute>
      }/>
      <Route path="/trips/:id/edit" element={
        <ProtectedRoute><EditTripPage /></ProtectedRoute>
      }/>

      {/* ── Phase 6 — Itinerary (protected) ── */}
      <Route path="/trips/:id/itinerary" element={
        <ProtectedRoute><ItineraryPage /></ProtectedRoute>
      }/>

      {/* ── Phase 7 — Discovery (public) ── */}
      <Route path="/discover/cities"     element={<DiscoverCitiesPage />} />
      <Route path="/discover/activities" element={<DiscoverActivitiesPage />} />

      {/* ── Phase 8 — Budget (protected) ── */}
      <Route path="/trips/:id/budget" element={
        <ProtectedRoute><BudgetPage /></ProtectedRoute>
      }/>

      {/* ── Phase 9 — Calendar (protected) ── */}
      <Route path="/trips/:id/calendar" element={
        <ProtectedRoute><CalendarPage /></ProtectedRoute>
      }/>

      {/* ── Phase 10 — Shared & Profile ── */}
      <Route path="/share/:token" element={<PlaceholderPublic title="Shared Itinerary" />} />
      <Route path="/profile" element={
        <ProtectedRoute><ProfilePage /></ProtectedRoute>
      }/>
      <Route path="/community" element={<PlaceholderPublic title="Community" />} />

      {/* ── Phase 11 — Admin (admin only) ── */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly><PlaceholderApp title="Admin Dashboard" /></ProtectedRoute>
      }/>

      {/* ── 404 ── */}
      <Route path="*" element={<PlaceholderPublic title="Page Not Found (404)" />} />
    </Routes>
  )
}

// ── Root App ──────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'Inter, sans-serif',
              fontSize:   '0.875rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
              border: '1px solid #f1f5f9',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App
