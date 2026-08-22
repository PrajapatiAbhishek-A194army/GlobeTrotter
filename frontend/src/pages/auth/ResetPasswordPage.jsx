import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineCheckCircle } from 'react-icons/hi'
import toast from 'react-hot-toast'
import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import * as authService from '../../services/auth.service'

function getStrength(pw) {
  let s = 0
  if (!pw) return { score: 0, label: '', color: '' }
  if (pw.length >= 8)          s++
  if (/[A-Z]/.test(pw))       s++
  if (/[a-z]/.test(pw))       s++
  if (/\d/.test(pw))          s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  if (s <= 2) return { score: s, label: 'Weak',   color: 'bg-red-400' }
  if (s === 3) return { score: s, label: 'Fair',   color: 'bg-amber-400' }
  if (s === 4) return { score: s, label: 'Good',   color: 'bg-primary-400' }
  return              { score: s, label: 'Strong', color: 'bg-primary-600' }
}

export default function ResetPasswordPage() {
  const { token }   = useParams()
  const navigate    = useNavigate()

  const [form,       setForm]      = useState({ password: '', confirmPassword: '' })
  const [errors,     setErrors]    = useState({})
  const [showPass,   setShowPass]  = useState(false)
  const [showConf,   setShowConf]  = useState(false)
  const [loading,    setLoading]   = useState(false)
  const [success,    setSuccess]   = useState(false)

  const strength = getStrength(form.password)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.password) errs.password = 'New password is required.'
    else if (form.password.length < 8) errs.password = 'Must be at least 8 characters.'
    else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(form.password))
      errs.password = 'Must include uppercase, lowercase, and a number.'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await authService.resetPassword(token, form.password)
      setSuccess(true)
      toast.success('Password reset successfully!')
      setTimeout(() => navigate('/login', { replace: true }), 3000)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password. The link may have expired.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Choose a strong password for your GlobeTrotter account."
    >
      {success ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <HiOutlineCheckCircle className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="font-display font-bold text-xl text-neutral-900 mb-2">Password reset!</h3>
          <p className="text-neutral-500 text-sm mb-6">
            Your password has been updated. Redirecting you to sign in...
          </p>
          <div className="w-8 h-8 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto mb-4" />
          <Link to="/login">
            <Button variant="primary" size="lg" fullWidth>Go to Sign In</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* New password */}
          <div>
            <Input
              label="New password" id="password" name="password"
              type={showPass ? 'text' : 'password'} required
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              value={form.password} onChange={handleChange}
              error={errors.password}
              leftIcon={<HiOutlineLockClosed className="w-4 h-4" />}
              rightElement={
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                  aria-label={showPass ? 'Hide' : 'Show'}>
                  {showPass ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              }
            />
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-neutral-200'}`} />
                  ))}
                </div>
                <p className={`text-xs font-medium ${strength.score <= 2 ? 'text-red-500' : strength.score === 3 ? 'text-amber-500' : 'text-primary-600'}`}>
                  {strength.label} password
                </p>
              </div>
            )}
          </div>

          {/* Confirm */}
          <Input
            label="Confirm new password" id="confirmPassword" name="confirmPassword"
            type={showConf ? 'text' : 'password'} required
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={form.confirmPassword} onChange={handleChange}
            error={errors.confirmPassword}
            leftIcon={<HiOutlineLockClosed className="w-4 h-4" />}
            rightElement={
              <button type="button" onClick={() => setShowConf(v => !v)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label={showConf ? 'Hide' : 'Show'}>
                {showConf ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
              </button>
            }
          />

          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading}>
            Reset Password
          </Button>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            Back to Sign In
          </Link>
        </form>
      )}
    </AuthLayout>
  )
}
