import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff,
  HiOutlineUser, HiOutlinePhone, HiOutlineLocationMarker,
} from 'react-icons/hi'
import toast from 'react-hot-toast'
import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import * as authService from '../../services/auth.service'

// Password strength calculator
function getPasswordStrength(pw) {
  let score = 0
  if (!pw) return { score: 0, label: '', color: '' }
  if (pw.length >= 8)  score++
  if (/[A-Z]/.test(pw)) score++
  if (/[a-z]/.test(pw)) score++
  if (/\d/.test(pw))    score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  if (score <= 2) return { score, label: 'Weak',   color: 'bg-red-400' }
  if (score === 3) return { score, label: 'Fair',   color: 'bg-amber-400' }
  if (score === 4) return { score, label: 'Good',   color: 'bg-primary-400' }
  return              { score, label: 'Strong', color: 'bg-primary-600' }
}

export default function SignupPage() {
  const navigate   = useNavigate()
  const { loginCtx } = useAuth()

  const [form, setForm] = useState({
    firstName: '', lastName: '',
    email: '', phone: '',
    city: '', country: '',
    password: '', confirmPassword: '',
    agreeTerms: false,
  })
  const [errors,       setErrors]       = useState({})
  const [showPass,     setShowPass]     = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)
  const [loading,      setLoading]      = useState(false)

  const pwStrength = getPasswordStrength(form.password)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.firstName.trim()) errs.firstName = 'First name is required.'
    if (!form.lastName.trim())  errs.lastName  = 'Last name is required.'
    if (!form.email)            errs.email     = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email.'
    if (!form.password)         errs.password  = 'Password is required.'
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.'
    else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(form.password))
      errs.password = 'Must include uppercase, lowercase, and a number.'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.'
    if (!form.agreeTerms) errs.agreeTerms = 'You must agree to the terms to continue.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const { user, token } = await authService.signup({
        firstName: form.firstName,
        lastName:  form.lastName,
        email:     form.email,
        password:  form.password,
        phone:     form.phone || undefined,
        city:      form.city || undefined,
        country:   form.country || undefined,
      })
      loginCtx(user, token, true)
      toast.success(`Account created! Welcome, ${user.firstName}! 🌍`)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Sign up failed. Please try again.'
      if (err.response?.data?.errors) {
        const fieldErrs = {}
        err.response.data.errors.forEach(({ field, message }) => { fieldErrs[field] = message })
        setErrors(fieldErrs)
      } else {
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start planning your perfect journey — it's free forever."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">

        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First name" id="firstName" name="firstName" required
            placeholder="John" value={form.firstName} onChange={handleChange}
            error={errors.firstName}
            leftIcon={<HiOutlineUser className="w-4 h-4" />}
          />
          <Input
            label="Last name" id="lastName" name="lastName" required
            placeholder="Doe" value={form.lastName} onChange={handleChange}
            error={errors.lastName}
          />
        </div>

        {/* Email */}
        <Input
          label="Email address" id="email" name="email" type="email"
          autoComplete="email" required
          placeholder="you@example.com" value={form.email} onChange={handleChange}
          error={errors.email}
          leftIcon={<HiOutlineMail className="w-4 h-4" />}
        />

        {/* Phone (optional) */}
        <Input
          label="Phone number" id="phone" name="phone" type="tel"
          placeholder="+91 98765 43210 (optional)" value={form.phone} onChange={handleChange}
          error={errors.phone}
          leftIcon={<HiOutlinePhone className="w-4 h-4" />}
        />

        {/* City + Country */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="City" id="city" name="city"
            placeholder="Mumbai" value={form.city} onChange={handleChange}
            leftIcon={<HiOutlineLocationMarker className="w-4 h-4" />}
          />
          <Input
            label="Country" id="country" name="country"
            placeholder="India" value={form.country} onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div>
          <Input
            label="Password" id="password" name="password"
            type={showPass ? 'text' : 'password'} required
            autoComplete="new-password"
            placeholder="Min. 8 characters" value={form.password} onChange={handleChange}
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
          {/* Strength meter */}
          {form.password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= pwStrength.score ? pwStrength.color : 'bg-neutral-200'}`} />
                ))}
              </div>
              <p className={`text-xs font-medium ${pwStrength.score <= 2 ? 'text-red-500' : pwStrength.score === 3 ? 'text-amber-500' : 'text-primary-600'}`}>
                {pwStrength.label} password
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <Input
          label="Confirm password" id="confirmPassword" name="confirmPassword"
          type={showConfirm ? 'text' : 'password'} required
          autoComplete="new-password"
          placeholder="Repeat your password" value={form.confirmPassword} onChange={handleChange}
          error={errors.confirmPassword}
          leftIcon={<HiOutlineLockClosed className="w-4 h-4" />}
          rightElement={
            <button type="button" onClick={() => setShowConfirm(v => !v)}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label={showConfirm ? 'Hide' : 'Show'}>
              {showConfirm ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
            </button>
          }
        />

        {/* Terms */}
        <div className="pt-1">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox" name="agreeTerms"
              checked={form.agreeTerms} onChange={handleChange}
              className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-400 shrink-0"
            />
            <span className="text-sm text-neutral-600 leading-relaxed">
              I agree to the{' '}
              <Link to="/terms" className="text-primary-600 hover:underline font-medium">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-primary-600 hover:underline font-medium">Privacy Policy</Link>
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="mt-1.5 text-xs text-red-500">{errors.agreeTerms}</p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading} className="mt-2">
          Create My Account
        </Button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-xs text-neutral-400">
            <span className="bg-white px-3">Already have an account?</span>
          </div>
        </div>

        <Link to="/login">
          <Button variant="secondary" size="lg" fullWidth>
            Sign in instead
          </Button>
        </Link>
      </form>
    </AuthLayout>
  )
}
