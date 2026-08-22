import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker,
  HiOutlinePencil, HiOutlineCheck, HiOutlineLockClosed, HiOutlineMap,
  HiOutlineGlobe, HiOutlineCamera, HiOutlineLogout, HiOutlineX,
} from 'react-icons/hi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import AppLayout from '../../layouts/AppLayout'
import { useAuth } from '../../context/AuthContext'
import * as authService from '../../services/auth.service'
import * as tripService from '../../services/trip.service'

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh',
  'Belgium','Brazil','Canada','Chile','China','Colombia','Croatia','Czech Republic',
  'Denmark','Egypt','Ethiopia','Finland','France','Germany','Ghana','Greece',
  'Hungary','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Japan',
  'Jordan','Kenya','Malaysia','Mexico','Morocco','Netherlands','New Zealand',
  'Nigeria','Norway','Pakistan','Peru','Philippines','Poland','Portugal','Romania',
  'Russia','Saudi Arabia','Singapore','South Africa','South Korea','Spain','Sri Lanka',
  'Sweden','Switzerland','Thailand','Turkey','Ukraine','United Arab Emirates',
  'United Kingdom','United States','Vietnam','Zimbabwe',
]

// ── Change Password Modal ──────────────────────────────────────────────────────
function ChangePasswordModal({ onClose }) {
  const [form,  setForm]  = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
    if (errors[k]) setErrors(p => { const e = {...p}; delete e[k]; return e })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.currentPassword) errs.currentPassword = 'Required'
    if (form.newPassword.length < 8) errs.newPassword = 'At least 8 characters'
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.newPassword)) errs.newPassword = 'Must include upper, lower, number'
    if (form.newPassword !== form.confirm) errs.confirm = 'Passwords do not match'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    try {
      await authService.changePassword(form.currentPassword, form.newPassword)
      toast.success('Password changed successfully!')
      onClose()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to change password.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-neutral-900">Change Password</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 transition-colors">
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            { key: 'currentPassword', label: 'Current Password' },
            { key: 'newPassword',     label: 'New Password' },
            { key: 'confirm',         label: 'Confirm New Password' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-neutral-600 mb-1">{label}</label>
              <input
                type="password"
                value={form[key]}
                onChange={e => set(key, e.target.value)}
                className={clsx(
                  'w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400',
                  errors[key] ? 'border-red-300 bg-red-50' : 'border-neutral-200'
                )}
              />
              {errors[key] && <p className="text-xs text-red-500 mt-0.5">{errors[key]}</p>}
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-60">
              {saving ? 'Saving…' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, updateUserLocal, logout } = useAuth()
  const [stats,  setStats]  = useState(null)
  const [form,   setForm]   = useState(null)
  const [saving, setSaving] = useState(false)
  const [dirty,  setDirty]  = useState(false)
  const [showPwModal, setShowPwModal] = useState(false)

  // Init form from auth context
  useEffect(() => {
    if (!user) return
    setForm({
      firstName: user.firstName || '',
      lastName:  user.lastName  || '',
      phone:     user.phone     || '',
      city:      user.city      || '',
      country:   user.country   || '',
      bio:       user.bio       || '',
    })
  }, [user])

  // Load stats
  useEffect(() => {
    tripService.getTripStats().then(setStats).catch(() => {})
  }, [])

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
    setDirty(true)
  }

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error('First and last name are required.')
      return
    }
    setSaving(true)
    try {
      const updated = await authService.updateProfile({
        firstName: form.firstName.trim(),
        lastName:  form.lastName.trim(),
        phone:     form.phone.trim()   || null,
        city:      form.city.trim()    || null,
        country:   form.country        || null,
        bio:       form.bio.trim()     || null,
      })
      updateUserLocal(updated)
      setDirty(false)
      toast.success('Profile updated! ✅')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : '?'

  if (!form) return <AppLayout><div className="p-8 text-center text-neutral-400">Loading…</div></AppLayout>

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-2xl text-neutral-900 flex items-center gap-2">
            <HiOutlineUser className="w-6 h-6 text-primary-500" />
            My Profile
          </h1>
          {dirty && (
            <button
              id="save-profile-btn"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-60"
            >
              <HiOutlineCheck className="w-4 h-4" />
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          )}
        </div>

        {/* ── Avatar + Stats ── */}
        <div className="bg-gradient-to-br from-primary-600 to-emerald-600 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-white">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold text-white border-2 border-white/40">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover rounded-3xl" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <button
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md text-primary-600 hover:bg-primary-50 transition-colors"
              title="Change avatar (coming soon)"
            >
              <HiOutlineCamera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Name + email + role */}
          <div className="text-center sm:text-left flex-1">
            <h2 className="font-display font-black text-2xl">{user?.firstName} {user?.lastName}</h2>
            <p className="text-white/70 text-sm mt-0.5 flex items-center gap-1 justify-center sm:justify-start">
              <HiOutlineMail className="w-3.5 h-3.5" /> {user?.email}
            </p>
            <span className="inline-block mt-2 px-2.5 py-0.5 bg-white/20 backdrop-blur-sm text-xs font-semibold rounded-full capitalize">
              {user?.role?.toLowerCase()} member
            </span>
          </div>

          {/* Stats row */}
          {stats && (
            <div className="flex items-center gap-5 shrink-0">
              {[
                { val: stats.total,     label: 'Trips' },
                { val: stats.countries, label: 'Countries' },
                { val: stats.completed, label: 'Done' },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <p className="font-black text-2xl">{val}</p>
                  <p className="text-white/70 text-xs">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Personal Info ── */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6 space-y-4">
          <h2 className="font-semibold text-neutral-800 text-base flex items-center gap-2">
            <HiOutlinePencil className="w-4 h-4 text-primary-500" />
            Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'firstName', label: 'First Name', icon: HiOutlineUser, required: true },
              { key: 'lastName',  label: 'Last Name',  icon: HiOutlineUser, required: true },
              { key: 'phone',     label: 'Phone',      icon: HiOutlinePhone },
            ].map(({ key, label, icon: Icon, required }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  {label}{required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    id={`profile-${key}`}
                    value={form[key]}
                    onChange={e => set(key, e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 hover:border-neutral-300 transition-all"
                  />
                </div>
              </div>
            ))}

            {/* Email (read-only) */}
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                <input
                  value={user?.email || ''}
                  readOnly
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-neutral-100 rounded-xl bg-neutral-50 text-neutral-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Bio</label>
            <textarea
              id="profile-bio"
              rows={3}
              value={form.bio}
              onChange={e => set('bio', e.target.value)}
              placeholder="Tell fellow globetrotters about yourself…"
              className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 hover:border-neutral-300 transition-all resize-none"
            />
          </div>
        </div>

        {/* ── Location ── */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6 space-y-4">
          <h2 className="font-semibold text-neutral-800 text-base flex items-center gap-2">
            <HiOutlineLocationMarker className="w-4 h-4 text-primary-500" />
            Location
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">City</label>
              <div className="relative">
                <HiOutlineMap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  id="profile-city"
                  value={form.city}
                  onChange={e => set('city', e.target.value)}
                  placeholder="Your city"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 hover:border-neutral-300 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Country</label>
              <div className="relative">
                <HiOutlineGlobe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <select
                  id="profile-country"
                  value={form.country}
                  onChange={e => set('country', e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 hover:border-neutral-300 transition-all bg-white appearance-none"
                >
                  <option value="">Select country…</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ── Security ── */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6">
          <h2 className="font-semibold text-neutral-800 text-base flex items-center gap-2 mb-4">
            <HiOutlineLockClosed className="w-4 h-4 text-primary-500" />
            Security
          </h2>
          <div className="flex items-center justify-between py-3 border-b border-neutral-50">
            <div>
              <p className="text-sm font-medium text-neutral-800">Password</p>
              <p className="text-xs text-neutral-400">Update your account password</p>
            </div>
            <button
              id="change-password-btn"
              onClick={() => setShowPwModal(true)}
              className="px-4 py-2 text-xs font-semibold text-primary-600 border border-primary-200 rounded-xl hover:bg-primary-50 transition-colors"
            >
              Change Password
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-neutral-800">Sign Out</p>
              <p className="text-xs text-neutral-400">Log out of your GlobeTrotter account</p>
            </div>
            <button
              id="logout-btn"
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
            >
              <HiOutlineLogout className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            id="save-profile-bottom"
            onClick={handleSave}
            disabled={saving || !dirty}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-40 active:scale-[0.98]"
          >
            <HiOutlineCheck className="w-4 h-4" />
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {showPwModal && <ChangePasswordModal onClose={() => setShowPwModal(false)} />}
    </AppLayout>
  )
}
