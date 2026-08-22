import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineMail, HiArrowLeft, HiOutlineCheckCircle, HiOutlineKey, HiOutlineLockClosed } from 'react-icons/hi'
import toast from 'react-hot-toast'
import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import * as authService from '../../services/auth.service'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step,        setStep]        = useState(1) // 1: Enter email, 2: Enter OTP & New Password
  const [email,       setEmail]       = useState('')
  const [otp,         setOtp]         = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm,     setConfirm]     = useState('')
  const [error,       setError]       = useState('')
  const [loading,     setLoading]     = useState(false)
  const [previewOtp,  setPreviewOtp]  = useState(null)

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!email) { setError('Email address is required.'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address.'); return }

    setLoading(true)
    try {
      const res = await authService.sendPasswordOtp(email)
      toast.success(`6-digit OTP code sent to ${email}! 📬`)
      if (res.data?.devOtpPreview) {
        setPreviewOtp(res.data.devOtpPreview)
      }
      setStep(2)
      setError('')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send OTP code.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP & Set New Password
  const handleResetWithOtp = async (e) => {
    e.preventDefault()
    if (!otp || otp.trim().length !== 6) { setError('Please enter the 6-digit OTP code.'); return }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setError('Password must contain uppercase, lowercase, and a number.')
      return
    }
    if (newPassword !== confirm) { setError('Passwords do not match.'); return }

    setLoading(true)
    try {
      await authService.verifyOtp(email, otp.trim(), newPassword)
      toast.success('Password updated successfully! 🎉 Please sign in.')
      navigate('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid or expired OTP code.')
      toast.error('Invalid or expired OTP code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title={step === 1 ? 'Reset your password' : 'Enter Verification OTP'}
      subtitle={step === 1 ? 'Enter your email to receive a 6-digit verification code.' : `Enter the 6-digit code sent to ${email}.`}
    >
      {step === 1 ? (
        <form onSubmit={handleSendOtp} noValidate className="space-y-5">
          <Input
            label="Email address"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError('') }}
            error={error}
            leftIcon={<HiOutlineMail className="w-5 h-5" />}
          />

          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading}>
            Send 6-Digit OTP 🚀
          </Button>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors mt-4"
          >
            <HiArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </form>
      ) : (
        <form onSubmit={handleResetWithOtp} noValidate className="space-y-4">
          {previewOtp && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <p className="text-[11px] text-emerald-700 font-medium">Test OTP preview (check console/email):</p>
              <p className="text-lg font-mono font-black text-emerald-900 tracking-widest">{previewOtp}</p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              6-Digit OTP Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setError('') }}
              className="w-full px-4 py-2.5 text-center tracking-[8px] font-mono text-xl font-bold border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 bg-neutral-50"
            />
          </div>

          <Input
            label="New Password"
            id="newPassword"
            type="password"
            required
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => { setNewPassword(e.target.value); setError('') }}
            leftIcon={<HiOutlineLockClosed className="w-5 h-5" />}
          />

          <Input
            label="Confirm New Password"
            id="confirm"
            type="password"
            required
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setError('') }}
            leftIcon={<HiOutlineLockClosed className="w-5 h-5" />}
          />

          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading}>
            Verify OTP & Reset Password
          </Button>

          <div className="flex items-center justify-between text-xs pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-neutral-500 hover:text-neutral-800"
            >
              ← Change Email
            </button>
            <button
              type="button"
              onClick={handleSendOtp}
              className="text-primary-600 font-semibold hover:underline"
            >
              Resend OTP
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  )
}
