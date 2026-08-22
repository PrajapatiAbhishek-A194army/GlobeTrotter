import { useEffect, useState } from 'react'
import AppLayout from '../../layouts/AppLayout'
import WelcomeCard         from './components/WelcomeCard'
import StatsCards          from './components/StatsCards'
import UpcomingTrips       from './components/UpcomingTrips'
import QuickActions        from './components/QuickActions'
import PopularDestinations from './components/PopularDestinations'
import * as tripService   from '../../services/trip.service'
import * as destService   from '../../services/destination.service'

export default function DashboardPage() {
  const [stats,        setStats]        = useState(null)
  const [trips,        setTrips]        = useState([])
  const [destinations, setDestinations] = useState([])
  const [loading,      setLoading]      = useState({ stats: true, trips: true, destinations: true })

  useEffect(() => {
    // Fetch stats
    tripService.getTripStats()
      .then(setStats)
      .catch(() => {}) // graceful fail — shows zeros
      .finally(() => setLoading(p => ({ ...p, stats: false })))

    // Fetch recent trips
    tripService.getTrips({ limit: 5 })
      .then(({ trips }) => setTrips(trips))
      .catch(() => {})
      .finally(() => setLoading(p => ({ ...p, trips: false })))

    // Fetch popular destinations
    destService.getDestinations({ limit: 4 })
      .then(setDestinations)
      .catch(() => {})
      .finally(() => setLoading(p => ({ ...p, destinations: false })))
  }, [])

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Welcome banner */}
        <WelcomeCard />

        {/* Stat cards */}
        <StatsCards stats={stats} loading={loading.stats} />

        {/* Quick actions */}
        <QuickActions />

        {/* Main two-column grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Trips list — takes 2/3 */}
          <div className="xl:col-span-2">
            <UpcomingTrips trips={trips} loading={loading.trips} />
          </div>

          {/* Destinations — takes 1/3 */}
          <div className="xl:col-span-1">
            <PopularDestinations destinations={destinations} loading={loading.destinations} />
          </div>
        </div>

        {/* Motivational footer tip */}
        <div className="bg-primary-50 border border-primary-100 rounded-2xl px-6 py-4 flex items-center gap-4">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-sm font-semibold text-primary-800">Pro Tip</p>
            <p className="text-xs text-primary-600">Add a cover image to your trips to make them stand out. Use the Itinerary Builder to plan day-by-day activities!</p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
