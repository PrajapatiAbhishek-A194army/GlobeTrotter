import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Placeholder pages — will be replaced in their respective phases
const PlaceholderPage = ({ title }) => (
  <div className="flex items-center justify-center min-h-screen bg-surface-secondary">
    <div className="text-center">
      <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">🌍</span>
      </div>
      <h1 className="heading-4 text-neutral-800 mb-2">{title}</h1>
      <p className="text-muted text-sm">Coming soon — Phase development in progress</p>
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
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#fff' },
          },
        }}
      />

      <Routes>
        {/* Phase 2 — Landing Page */}
        <Route path="/" element={<PlaceholderPage title="Landing Page" />} />

        {/* Phase 3 — Auth */}
        <Route path="/login" element={<PlaceholderPage title="Login" />} />
        <Route path="/signup" element={<PlaceholderPage title="Sign Up" />} />
        <Route path="/forgot-password" element={<PlaceholderPage title="Forgot Password" />} />
        <Route path="/reset-password/:token" element={<PlaceholderPage title="Reset Password" />} />

        {/* Phase 4 — Dashboard */}
        <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />

        {/* Phase 5 — Trip Management */}
        <Route path="/trips" element={<PlaceholderPage title="My Trips" />} />
        <Route path="/trips/new" element={<PlaceholderPage title="Create Trip" />} />
        <Route path="/trips/:id" element={<PlaceholderPage title="Trip Details" />} />
        <Route path="/trips/:id/edit" element={<PlaceholderPage title="Edit Trip" />} />

        {/* Phase 6 — Itinerary */}
        <Route path="/trips/:id/itinerary" element={<PlaceholderPage title="Itinerary Builder" />} />

        {/* Phase 7 — Discovery */}
        <Route path="/discover/cities" element={<PlaceholderPage title="City Search" />} />
        <Route path="/discover/activities" element={<PlaceholderPage title="Activity Search" />} />

        {/* Phase 8 — Budget */}
        <Route path="/trips/:id/budget" element={<PlaceholderPage title="Budget Planner" />} />

        {/* Phase 9 — Calendar */}
        <Route path="/trips/:id/calendar" element={<PlaceholderPage title="Trip Calendar" />} />

        {/* Phase 10 — Shared & Profile */}
        <Route path="/share/:token" element={<PlaceholderPage title="Shared Itinerary" />} />
        <Route path="/profile" element={<PlaceholderPage title="My Profile" />} />
        <Route path="/community" element={<PlaceholderPage title="Community" />} />

        {/* Phase 11 — Admin */}
        <Route path="/admin" element={<PlaceholderPage title="Admin Dashboard" />} />

        {/* 404 */}
        <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
      </Routes>
    </Router>
  )
}

export default App
