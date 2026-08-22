import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Phase 2 — Landing Page
import LandingPage from './pages/LandingPage'
import PublicLayout from './layouts/PublicLayout'

// Placeholder for future phases — wrapped in PublicLayout for public pages
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

// Placeholder for authenticated pages (no nav/footer — will use AppLayout in Phase 4)
const PlaceholderApp = ({ title }) => (
  <div className="flex items-center justify-center min-h-screen bg-surface-secondary">
    <div className="text-center">
      <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">🌍</span>
      </div>
      <h1 className="font-display font-bold text-xl text-neutral-800 mb-2">{title}</h1>
      <p className="text-neutral-500 text-sm">Coming soon — Phase development in progress</p>
    </div>
  </div>
)

function App() {
  return (
    <Router>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
            border: '1px solid #f1f5f9',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      <Routes>
        {/* ── Phase 2 — Landing Page ── */}
        <Route path="/" element={<LandingPage />} />

        {/* ── Phase 3 — Auth (Public) ── */}
        <Route path="/login"                  element={<PlaceholderPublic title="Sign In" />} />
        <Route path="/signup"                 element={<PlaceholderPublic title="Create Account" />} />
        <Route path="/forgot-password"        element={<PlaceholderPublic title="Forgot Password" />} />
        <Route path="/reset-password/:token"  element={<PlaceholderPublic title="Reset Password" />} />

        {/* ── Phase 4 — Dashboard (App) ── */}
        <Route path="/dashboard" element={<PlaceholderApp title="Dashboard" />} />

        {/* ── Phase 5 — Trip Management ── */}
        <Route path="/trips"          element={<PlaceholderApp title="My Trips" />} />
        <Route path="/trips/new"      element={<PlaceholderApp title="Create Trip" />} />
        <Route path="/trips/:id"      element={<PlaceholderApp title="Trip Details" />} />
        <Route path="/trips/:id/edit" element={<PlaceholderApp title="Edit Trip" />} />

        {/* ── Phase 6 — Itinerary ── */}
        <Route path="/trips/:id/itinerary" element={<PlaceholderApp title="Itinerary Builder" />} />

        {/* ── Phase 7 — Discovery ── */}
        <Route path="/discover/cities"     element={<PlaceholderPublic title="City Discovery" />} />
        <Route path="/discover/activities" element={<PlaceholderPublic title="Activity Discovery" />} />

        {/* ── Phase 8 — Budget ── */}
        <Route path="/trips/:id/budget" element={<PlaceholderApp title="Budget Planner" />} />

        {/* ── Phase 9 — Calendar ── */}
        <Route path="/trips/:id/calendar" element={<PlaceholderApp title="Trip Calendar" />} />

        {/* ── Phase 10 — Shared & Profile ── */}
        <Route path="/share/:token" element={<PlaceholderPublic title="Shared Itinerary" />} />
        <Route path="/profile"      element={<PlaceholderApp title="My Profile" />} />
        <Route path="/community"    element={<PlaceholderPublic title="Community" />} />

        {/* ── Phase 11 — Admin ── */}
        <Route path="/admin" element={<PlaceholderApp title="Admin Dashboard" />} />

        {/* ── 404 ── */}
        <Route path="*" element={<PlaceholderPublic title="Page Not Found (404)" />} />
      </Routes>
    </Router>
  )
}

export default App
