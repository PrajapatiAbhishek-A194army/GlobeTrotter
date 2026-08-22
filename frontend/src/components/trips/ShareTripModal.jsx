import { useState } from 'react'
import {
  HiOutlineX, HiOutlineGlobe, HiOutlineLockClosed,
  HiOutlineClipboardCopy, HiOutlineCheck, HiOutlineMail,
  HiOutlineUsers, HiOutlineExternalLink,
} from 'react-icons/hi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import * as tripService from '../../services/trip.service'

export default function ShareTripModal({ trip, isOpen, onClose, onUpdateTrip }) {
  const [copied, setCopied] = useState(false)
  const [togglingPublic, setTogglingPublic] = useState(false)

  if (!isOpen || !trip) return null

  const shareToken = trip.shareToken
  const shareUrl = shareToken
    ? `${window.location.origin}/share/${shareToken}`
    : `${window.location.origin}/trips/${trip.id}`

  const handleCopyLink = async () => {
    try {
      let token = trip.shareToken
      if (!token) {
        token = await tripService.generateShareToken(trip.id)
        onUpdateTrip({ ...trip, shareToken: token })
      }
      const url = `${window.location.origin}/share/${token}`
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Share link copied to clipboard! 🔗')
      setTimeout(() => setCopied(false), 2500)
    } catch {
      toast.error('Failed to copy link.')
    }
  }

  const handleTogglePublic = async () => {
    setTogglingPublic(true)
    try {
      const newStatus = !trip.isPublic
      const updated = await tripService.updateTrip(trip.id, { isPublic: newStatus })
      onUpdateTrip(updated)
      if (newStatus) {
        toast.success('Trip published to Community! 🌍 Anyone can discover it.')
      } else {
        toast('Trip removed from Community (private/unlisted).', { icon: '🔒' })
      }
    } catch {
      toast.error('Failed to update trip privacy.')
    } finally {
      setTogglingPublic(false)
    }
  }

  const shareViaWhatsApp = () => {
    const text = `Check out my trip itinerary for "${trip.title}" on GlobeTrotter: ${shareUrl}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const shareViaEmail = () => {
    const subject = `Travel Itinerary: ${trip.title}`
    const body = `Hey,\n\nCheck out my travel itinerary for "${trip.title}" on GlobeTrotter!\n\nView full itinerary here: ${shareUrl}\n\nHappy travels!`
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
  }

  const shareViaTwitter = () => {
    const text = `Check out my trip "${trip.title}" on GlobeTrotter!`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
  }

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-neutral-100 animate-scale-up">

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center text-lg">
              ✈️
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-neutral-900">Share Trip</h3>
              <p className="text-xs text-neutral-500 truncate max-w-xs">{trip.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 flex items-center justify-center transition-colors"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          {/* Option 1: Share with Friends (Private Secret Link) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                1. Share with Friends (Direct Link)
              </label>
              <span className="text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                Anyone with link can view
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-600 select-all focus:outline-none focus:ring-2 focus:ring-primary-400 font-mono"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
              >
                {copied ? <HiOutlineCheck className="w-4 h-4" /> : <HiOutlineClipboardCopy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              <button
                onClick={shareViaWhatsApp}
                className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-2xl border border-neutral-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </div>
                <span className="text-[11px] font-medium text-neutral-600 group-hover:text-emerald-700">WhatsApp</span>
              </button>

              <button
                onClick={shareViaEmail}
                className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <HiOutlineMail className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium text-neutral-600 group-hover:text-primary-700">Email</span>
              </button>

              <button
                onClick={shareViaTwitter}
                className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-2xl border border-neutral-100 hover:border-sky-200 hover:bg-sky-50/50 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" /></svg>
                </div>
                <span className="text-[11px] font-medium text-neutral-600 group-hover:text-sky-700">Twitter / X</span>
              </button>

              <button
                onClick={shareViaFacebook}
                className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-2xl border border-neutral-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-[#4267B2]/10 text-[#4267B2] flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </div>
                <span className="text-[11px] font-medium text-neutral-600 group-hover:text-blue-700">Facebook</span>
              </button>
            </div>
          </div>

          <div className="h-px bg-neutral-100" />

          {/* Option 2: Publish to Community Feed */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              2. Public Community Explore Page
            </label>

            <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/70 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={clsx('w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5',
                  trip.isPublic ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-500'
                )}>
                  {trip.isPublic ? <HiOutlineGlobe className="w-5 h-5" /> : <HiOutlineLockClosed className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-800">
                    {trip.isPublic ? 'Published in Community' : 'Private (Unlisted from Community)'}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {trip.isPublic
                      ? 'Visible to all travelers on the Community page (/community).'
                      : 'Hidden from Community explore. Only people with your secret link can see it.'}
                  </p>
                </div>
              </div>

              <button
                id="toggle-public-btn"
                type="button"
                disabled={togglingPublic}
                onClick={handleTogglePublic}
                className={clsx(
                  'relative w-12 h-6.5 rounded-full transition-colors shrink-0',
                  trip.isPublic ? 'bg-primary-600' : 'bg-neutral-300'
                )}
              >
                <span
                  className={clsx(
                    'absolute top-0.75 w-5 h-5 bg-white rounded-full shadow-md transition-transform',
                    trip.isPublic ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          </div>

          {/* Preview Shared View Button */}
          <div className="pt-2">
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Preview Public Shared Page</span>
              <HiOutlineExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </a>
          </div>

        </div>

      </div>
    </div>
  )
}
