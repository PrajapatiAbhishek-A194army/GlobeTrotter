import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  HiOutlinePhotograph, HiOutlineCalendar, HiOutlineGlobe,
  HiOutlineLockClosed, HiOutlineArrowLeft, HiOutlineX, HiOutlinePlus,
  HiOutlineLocationMarker, HiOutlineSparkles,
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Back + Header */}
        <div>
          <button
            id="back-btn"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors mb-5 group"
          >
            <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
          <h1 className="font-display font-bold text-2xl text-neutral-900">Plan a New Trip</h1>
          <p className="text-sm text-neutral-500 mt-1">Fill in the details to start your adventure.</p>
        </div>

        {/* Destination Pre-fill Banner */}
        {selectedDestination && (
          <div className="bg-gradient-to-r from-primary-50 to-emerald-50 border border-primary-100 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-200 shrink-0 shadow-xs">
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
              <h3 className="font-display font-bold text-base text-neutral-900 truncate">
                {selectedDestination.name}, {selectedDestination.country}
              </h3>
              <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                {selectedDestination.continent} · Cost Index: {selectedDestination.costIndex || 7}/10
              </p>
            </div>
          </div>
        )}

        <form id="create-trip-form" onSubmit={handleSubmit} className="space-y-6">

          {/* ── Cover Image ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-neutral-700">
                Cover Image <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              {selectedDestination && coverPreview === selectedDestination.image && (
                <span className="text-xs text-primary-600 font-medium">
                  📸 Default {selectedDestination.name} photo selected
                </span>
              )}
            </div>
            <div
              onClick={() => fileRef.current?.click()}
              className={clsx(
                'relative w-full h-52 rounded-2xl border-2 border-dashed cursor-pointer transition-all overflow-hidden group',
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
                    onClick={(e) => { e.stopPropagation(); setCoverFile(null); setCoverPreview(null) }}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <HiOutlineX className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-neutral-400">
                  <HiOutlinePhotograph className="w-10 h-10" />
                  <p className="text-sm font-medium">Click to upload a custom cover image</p>
                  <p className="text-xs">JPG, PNG, WebP — max 5 MB</p>
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
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6 space-y-4">
            <h2 className="font-semibold text-neutral-800 text-base">Trip Details</h2>

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
                placeholder="What's this trip about?"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all resize-none hover:border-neutral-300"
              />
            </div>
          </div>

          {/* ── Dates ── */}
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6 space-y-4">
            <h2 className="font-semibold text-neutral-800 text-base flex items-center gap-2">
              <HiOutlineCalendar className="w-4 h-4 text-primary-500" />
              Dates <span className="text-neutral-400 font-normal text-sm">(optional)</span>
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
              <p className="text-xs text-primary-600 font-medium">
                🗓️ {Math.round((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24))} days
              </p>
            )}
          </div>

          {/* ── Status ── */}
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6 space-y-3">
            <h2 className="font-semibold text-neutral-800 text-base">Trip Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  id={`status-${opt.value}`}
                  onClick={() => set('status', opt.value)}
                  className={clsx(
                    'flex flex-col items-start gap-0.5 px-4 py-3 rounded-xl border-2 text-left transition-all',
                    form.status === opt.value
                      ? 'border-primary-400 bg-primary-50 shadow-sm'
                      : 'border-neutral-100 hover:border-neutral-300'
                  )}
                >
                  <span className="text-sm font-semibold text-neutral-800">{opt.label}</span>
                  <span className="text-xs text-neutral-400">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Visibility ── */}
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
                  {form.isPublic
                    ? <HiOutlineGlobe className="w-4 h-4 text-primary-600" />
                    : <HiOutlineLockClosed className="w-4 h-4 text-neutral-500" />
                  }
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">
                    {form.isPublic ? 'Public trip' : 'Private trip'}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {form.isPublic
                      ? 'Anyone with the link can view this trip'
                      : 'Only you can see this trip'}
                  </p>
                </div>
              </div>
              <button
                id="visibility-toggle"
                type="button"
                onClick={() => set('isPublic', !form.isPublic)}
                className={clsx(
                  'relative w-11 h-6 rounded-full transition-colors',
                  form.isPublic ? 'bg-primary-600' : 'bg-neutral-200'
                )}
              >
                <span
                  className={clsx(
                    'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                    form.isPublic ? 'translate-x-5' : 'translate-x-0.5'
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
    </AppLayout>
  )
}
