import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'
import toast from 'react-hot-toast'
import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import * as authService from '../../services/auth.service'

export default function LoginPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { loginCtx } = useAuth()

  const [form,     setForm]     = useState({ email: '', password: '' })
  const [errors,   setErrors]   = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [remember, setRemember] = useState(true)

  const from = location.state?.from?.pathname || '/dashboard'

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.email)   errs.email    = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address.'
    if (!form.password) errs.password = 'Password is required.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const { user, token } = await authService.login(form)
      loginCtx(user, token, remember)
      toast.success(`Welcome back, ${user.firstName}! 🌍`)
      navigate(from, { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      // Field-level errors from backend
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
      title="Welcome back"
      subtitle="Sign in to your GlobeTrotter account to continue planning."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">

        {/* Email */}
        <Input
          label="Email address"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          leftIcon={<HiOutlineMail className="w-5 h-5" />}
        />

        {/* Password */}
        <Input
          label="Password"
          id="password"
          name="password"
          type={showPass ? 'text' : 'password'}
          autoComplete="current-password"
          required
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          leftIcon={<HiOutlineLockClosed className="w-5 h-5" />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label={showPass ? 'Hide password' : 'Show password'}
            >
              {showPass ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
            </button>
          }
        />

        {/* Remember me + Forgot link */}
        <div className="flex items-center justify-between -mt-2">
          <label id="remember-me-label" className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setRemember(v => !v)}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
                remember ? 'bg-primary-600 border-primary-600' : 'border-neutral-300 hover:border-primary-400'
              }`}
            >
              {remember && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                  <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-xs text-neutral-600">Remember me for 30 days</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={loading}
          className="mt-2"
        >
          Sign in to GlobeTrotter
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-xs text-neutral-400">
            <span className="bg-white px-3">Don't have an account?</span>
          </div>
        </div>

        {/* Sign up link */}
        <Link to="/signup">
          <Button variant="secondary" size="lg" fullWidth>
            Create free account
          </Button>
        </Link>
      </form>
    </AuthLayout>
  )
}
