import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  HiOutlinePhotograph, HiOutlineCalendar, HiOutlineGlobe,
  HiOutlineLockClosed, HiOutlineArrowLeft, HiOutlineX, HiOutlinePlus,
  HiOutlineLocationMarker, HiOutlineSparkles, HiOutlineLightBulb,
  HiOutlineCheck, HiOutlineArrowRight,
} from 'react-icons/hi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import AppLayout from '../../layouts/AppLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import * as tripService from '../../services/trip.service'

const STATUS_OPTIONS = [
  { value: 'PLANNING',  label: '📋 Planning',   desc: 'Still in the ideation phase' },
  { value: 'UPCOMING',  label: '✈️ Upcoming',   desc: 'Confirmed and ready to go' },
  { value: 'ONGOING',   label: '🌍 Ongoing',    desc: 'Currently on this trip' },
  { value: 'COMPLETED', label: '✅ Completed',  desc: 'This trip has ended' },
]

// ── Curated Inspiration Templates ─────────────────────────────────────────────
const SUGGESTED_PLANS = [
  {
    id: 'tokyo-sakura',
    title: 'Tokyo Sakura & Modern Vibes',
    destination: 'Tokyo, Japan',
    days: 7,
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=80',
    description: 'Explore Shibuya Crossing, historic Senso-ji temple, Shinjuku food alleys, and take a day trip to view Mt. Fuji.',
    tag: '🌸 Trending in Asia',
  },
  {
    id: 'paris-romance',
    title: 'Parisian Art & Cafe Culture',
    destination: 'Paris, France',
    days: 5,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
    description: 'Eiffel Tower at golden hour, masterpieces at the Louvre, Montmartre cobblestones, and leisurely Seine river walks.',
    tag: '🥐 Culture & Romance',
  },
  {
    id: 'bali-escape',
    title: 'Bali Tropical Island Escape',
    destination: 'Bali, Indonesia',
    days: 10,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    description: 'Ubud lush rice terraces, waterfall trekking, relaxing beach sunsets in Canggu, and Uluwatu cliff temple fire dances.',
    tag: '🌴 Tropical Getaway',
  },
  {
    id: 'nyc-break',
    title: 'New York Skyline & Broadway',
    destination: 'New York, USA',
    days: 4,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80',
    description: 'Times Square lights, morning jog in Central Park, walking the Brooklyn Bridge, and world-class Broadway theater.',
    tag: '🗽 City Break',
  },
  {
    id: 'rome-history',
    title: 'Rome Ancient Wonders & Pasta',
    destination: 'Rome, Italy',
    days: 6,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
    description: 'Colosseum gladiator arenas, Vatican & Sistine Chapel, tossing coins at the Trevi Fountain, and authentic Trastevere dining.',
    tag: '🏛️ Historic Wonder',
  },
  {
    id: 'dubai-luxe',
    title: 'Dubai Desert & Futuristic Luxury',
    destination: 'Dubai, UAE',
    days: 4,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
    description: 'Burj Khalifa views, Dubai Mall shopping, 4x4 desert dune safari with sunset BBQ, and futuristic marina cruises.',
    tag: '✨ Luxe Escape',
  },
]

export default function CreateTripPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const fileRef  = useRef(null)

  const selectedDestination = location.state?.destination || null

  const [form, setForm] = useState({
    title:       selectedDestination ? `${selectedDestination.name} Adventure` : '',
    description: selectedDestination ? (selectedDestination.description || `Exploring ${selectedDestination.name}, ${selectedDestination.country}`) : '',
    startDate: '',
    endDate: '',
    status: 'PLANNING',
    isPublic: false,
  })
  const [coverFile,    setCoverFile]    = useState(null)
  const [coverPreview, setCoverPreview] = useState(selectedDestination?.image || null)
  const [errors,       setErrors]       = useState({})
  const [submitting,   setSubmitting]   = useState(false)
  const [appliedPlanId, setAppliedPlanId] = useState(null)

  useEffect(() => {
    if (selectedDestination) {
      setForm(prev => ({
        ...prev,
        title: prev.title || `${selectedDestination.name} Adventure`,
        description: prev.description || selectedDestination.description || `Exploring ${selectedDestination.name}, ${selectedDestination.country}`,
      }))
      if (!coverPreview && selectedDestination.image) {
        setCoverPreview(selectedDestination.image)
      }
    }
  }, [selectedDestination])

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => { const e = { ...prev }; delete e[key]; return e })
  }

  // 1-Click apply suggestion template
  const applySuggestedPlan = (plan) => {
    setForm(prev => ({
      ...prev,
      title: plan.title,
      description: plan.description,
      status: 'PLANNING',
    }))
    setCoverFile(null)
    setCoverPreview(plan.image)
    setAppliedPlanId(plan.id)
    toast.success(`Applied template: "${plan.title}"! ✨`, { icon: '💡' })

    // Auto calculate suggested end date if startDate is chosen, or pre-fill next week
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7)
    const end   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7 + plan.days)
    setForm(prev => ({
      ...prev,
      startDate: prev.startDate || start.toISOString().slice(0, 10),
      endDate:   prev.endDate   || end.toISOString().slice(0, 10),
    }))
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB.'); return }
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Trip title is required.'
    if (form.title.trim().length > 100) e.title = 'Title must be under 100 characters.'
    if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate))
      e.endDate = 'End date must be after start date.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('title',       form.title.trim())
      fd.append('description', form.description.trim())
      fd.append('status',      form.status)
      fd.append('isPublic',    form.isPublic ? 'true' : 'false')
      if (form.startDate) fd.append('startDate', form.startDate)
      if (form.endDate)   fd.append('endDate',   form.endDate)

      if (coverFile) {
        fd.append('coverImage', coverFile)
      } else if (coverPreview && typeof coverPreview === 'string' && coverPreview.startsWith('http')) {
        fd.append('coverImage', coverPreview)
      }

      const trip = await tripService.createTrip(fd)
      toast.success('Trip created! 🎉')
      navigate(`/trips/${trip.id}`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create trip.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Back + Header */}
        <div>
          <button
            id="back-btn"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors mb-3 group"
          >
            <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900">Plan a New Trip</h1>
              <p className="text-sm text-neutral-500 mt-0.5">
                Fill in the details or select an inspiration plan from the side to start instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Destination Pre-fill Banner */}
        {selectedDestination && (
          <div className="bg-gradient-to-r from-primary-50 to-emerald-50 border border-primary-100 rounded-3xl p-4 flex items-center gap-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-200 shrink-0 shadow-xs">
              <img
                src={selectedDestination.image}
                alt={selectedDestination.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-700 uppercase tracking-wider">
                <HiOutlineSparkles className="w-3.5 h-3.5" /> Destination Selected
              </div>
              <h3 className="font-display font-bold text-lg text-neutral-900 truncate">
                {selectedDestination.name}, {selectedDestination.country}
              </h3>
              <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                {selectedDestination.continent} · Cost Index: {selectedDestination.costIndex || 7}/10
              </p>
            </div>
          </div>
        )}

        {/* ── 2-Column Responsive Layout: Form (Left) + Suggestions Sidebar (Right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column (7 cols): Trip Creation Form */}
          <div className="lg:col-span-7 space-y-6">
            <form id="create-trip-form" onSubmit={handleSubmit} className="space-y-6">

              {/* ── Cover Image ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-neutral-700">
                    Cover Image <span className="text-neutral-400 font-normal">(optional)</span>
                  </label>
                  {coverPreview && typeof coverPreview === 'string' && (
                    <span className="text-xs text-primary-600 font-medium">
                      📸 Cover photo ready
                    </span>
                  )}
                </div>
                <div
                  onClick={() => fileRef.current?.click()}
                  className={clsx(
                    'relative w-full h-56 rounded-3xl border-2 border-dashed cursor-pointer transition-all overflow-hidden group shadow-xs',
                    coverPreview
                      ? 'border-transparent'
                      : 'border-neutral-200 hover:border-primary-400 hover:bg-primary-50/30'
                  )}
                >
                  {coverPreview ? (
                    <>
                      <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-sm font-semibold">Change Image</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setCoverFile(null); setCoverPreview(null); setAppliedPlanId(null) }}
                        className="absolute top-3 right-3 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors shadow-md"
                        title="Remove image"
                      >
                        <HiOutlineX className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-neutral-400">
                      <HiOutlinePhotograph className="w-10 h-10 text-neutral-300" />
                      <p className="text-sm font-semibold text-neutral-600">Click to upload a custom cover image</p>
                      <p className="text-xs text-neutral-400">JPG, PNG, WebP — max 5 MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleCoverChange}
                  className="hidden"
                />
              </div>

              {/* ── Trip Basics ── */}
              <div className="bg-white rounded-3xl border border-neutral-100 shadow-card p-6 space-y-4">
                <h2 className="font-display font-bold text-neutral-900 text-base">Trip Details</h2>

                <Input
                  id="trip-title"
                  label="Trip Title"
                  required
                  placeholder="e.g. Japan Cherry Blossom Trip"
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  error={errors.title}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="block text-sm font-medium text-neutral-700">
                    Description <span className="text-neutral-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="trip-description"
                    rows={3}
                    placeholder="What's this trip about? e.g. Exploring famous landmarks, dining, and scenic views..."
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all resize-none hover:border-neutral-300"
                  />
                </div>
              </div>

              {/* ── Dates ── */}
              <div className="bg-white rounded-3xl border border-neutral-100 shadow-card p-6 space-y-4">
                <h2 className="font-display font-bold text-neutral-900 text-base flex items-center gap-2">
                  <HiOutlineCalendar className="w-4 h-4 text-primary-500" />
                  Travel Dates <span className="text-neutral-400 font-normal text-sm">(optional)</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="start-date"
                    label="Start Date"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => set('startDate', e.target.value)}
                  />
                  <Input
                    id="end-date"
                    label="End Date"
                    type="date"
                    value={form.endDate}
                    onChange={(e) => set('endDate', e.target.value)}
                    error={errors.endDate}
                    min={form.startDate || undefined}
                  />
                </div>

                {form.startDate && form.endDate && !errors.endDate && (
                  <p className="text-xs text-primary-600 font-bold flex items-center gap-1.5">
                    <span>🗓️</span>
                    <span>Duration: {Math.round((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24))} days</span>
                  </p>
                )}
              </div>

              {/* ── Status ── */}
              <div className="bg-white rounded-3xl border border-neutral-100 shadow-card p-6 space-y-3">
                <h2 className="font-display font-bold text-neutral-900 text-base">Trip Status</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      id={`status-${opt.value}`}
                      onClick={() => set('status', opt.value)}
                      className={clsx(
                        'flex flex-col items-start gap-0.5 px-4 py-3 rounded-2xl border-2 text-left transition-all',
                        form.status === opt.value
                          ? 'border-primary-400 bg-primary-50/70 shadow-xs'
                          : 'border-neutral-100 hover:border-neutral-300'
                      )}
                    >
                      <span className="text-sm font-bold text-neutral-800">{opt.label}</span>
                      <span className="text-xs text-neutral-400">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Visibility ── */}
              <div className="bg-white rounded-3xl border border-neutral-100 shadow-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center">
                      {form.isPublic
                        ? <HiOutlineGlobe className="w-5 h-5 text-primary-600" />
                        : <HiOutlineLockClosed className="w-5 h-5 text-neutral-500" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-800">
                        {form.isPublic ? 'Public trip' : 'Private trip'}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {form.isPublic
                          ? 'Anyone with the link can view & copy this trip'
                          : 'Only you can see and edit this trip'}
                      </p>
                    </div>
                  </div>
                  <button
                    id="visibility-toggle"
                    type="button"
                    onClick={() => set('isPublic', !form.isPublic)}
                    className={clsx(
                      'relative w-12 h-7 rounded-full transition-colors',
                      form.isPublic ? 'bg-primary-600' : 'bg-neutral-200'
                    )}
                  >
                    <span
                      className={clsx(
                        'absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform',
                        form.isPublic ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* ── Submit ── */}
              <div className="flex items-center gap-3 justify-end pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/trips')}
                  id="cancel-btn"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  id="submit-create-trip"
                  isLoading={submitting}
                  leftIcon={<HiOutlinePlus className="w-4 h-4" />}
                >
                  Create Trip
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column (5 cols): Suggested Plans & Trip Inspiration */}
          <div className="lg:col-span-5 space-y-6">

            {/* Suggestions Header Card */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-base">
                    ✨
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base text-neutral-900">
                      Suggested Plans & Inspiration
                    </h3>
                    <p className="text-[11px] text-neutral-400">Click any idea below to pre-fill your trip form</p>
                  </div>
                </div>
              </div>

              {/* Plan Suggestion Cards */}
              <div className="space-y-3.5">
                {SUGGESTED_PLANS.map((plan) => {
                  const isSelected = appliedPlanId === plan.id

                  return (
                    <div
                      key={plan.id}
                      onClick={() => applySuggestedPlan(plan)}
                      className={clsx(
                        'group p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3.5 items-start',
                        isSelected
                          ? 'border-primary-500 bg-primary-50/50 shadow-sm ring-1 ring-primary-400'
                          : 'border-neutral-100 hover:border-primary-200 hover:bg-neutral-50/80'
                      )}
                    >
                      {/* Image Thumbnail */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0 shadow-xs relative">
                        <img
                          src={plan.image}
                          alt={plan.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white rounded-md">
                          {plan.days}d
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">
                            {plan.tag}
                          </span>
                          {isSelected && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                              <HiOutlineCheck className="w-3 h-3" /> Applied
                            </span>
                          )}
                        </div>

                        <h4 className="font-display font-bold text-sm text-neutral-900 group-hover:text-primary-700 transition-colors truncate mt-0.5">
                          {plan.title}
                        </h4>

                        <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
                          {plan.description}
                        </p>

                        <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-primary-600 group-hover:translate-x-0.5 transition-transform">
                          <span>Use this Plan</span>
                          <HiOutlineArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Smart Travel Tips Card */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-6 text-white shadow-card space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <HiOutlineLightBulb className="w-4 h-4" /> Trip Planning Tips
              </div>
              <ul className="space-y-2.5 text-xs text-neutral-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 font-bold">•</span>
                  <span><strong>Dates auto-sync:</strong> Choosing travel dates automatically plots your journey onto the <strong>Master Calendar</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 font-bold">•</span>
                  <span><strong>Add Stops & Activities:</strong> Once created, you can add multi-city stops, flights, and restaurants in the <strong>Itinerary Builder</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 font-bold">•</span>
                  <span><strong>Set Budgets:</strong> Track transport, stays, and activities directly from the <strong>Budget Planner</strong>.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  )
}
