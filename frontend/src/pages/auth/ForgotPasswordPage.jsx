import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineMail, HiArrowLeft, HiOutlineCheckCircle } from 'react-icons/hi'
import toast from 'react-hot-toast'
import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import * as authService from '../../services/auth.service'

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) { setError('Email address is required.'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address.'); return }

    setLoading(true)
    try {
      await authService.forgotPassword(email)
      setSent(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a link to reset your password."
    >
      {/* Success state */}
      {sent ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <HiOutlineCheckCircle className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="font-display font-bold text-xl text-neutral-900 mb-2">Check your inbox</h3>
          <p className="text-neutral-500 text-sm leading-relaxed mb-6">
            If an account exists for <span className="font-medium text-neutral-700">{email}</span>,
            we've sent a password reset link. It expires in 1 hour.
          </p>
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 text-sm text-primary-700 mb-6">
            💡 Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={() => setSent(false)}
              className="font-semibold underline hover:no-underline"
            >
              try again
            </button>.
          </div>
          <Link to="/login">
            <Button variant="primary" size="lg" fullWidth>
              Back to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
            Send Reset Link
          </Button>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors mt-4"
          >
            <HiArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </form>
      )}
    </AuthLayout>
  )
}
