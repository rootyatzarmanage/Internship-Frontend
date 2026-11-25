import { useState, useEffect, type FormEvent } from 'react'
import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import logo from '../assets/logo.png'
import AnnouncementBanner from '../components/banner/announcement-banner'
import Header from '../components/header/header'
import Footer from '../components/footer/footer'
import { authApi } from '@/features/auth/api/auth-api'

type ResetStep = 'email' | 'otp' | 'password' | 'done'

const STEP_ORDER: ResetStep[] = ['email', 'otp', 'password', 'done']

const RECOVERY_STEPS: { key: ResetStep; title: string; text: string }[] = [
  { key: 'email', title: 'Confirm your email', text: 'Enter the work email you use to sign in.' },
  { key: 'otp', title: 'Enter the code', text: 'We send a 6-digit code to that inbox.' },
  { key: 'password', title: 'Set a new password', text: 'Pick one you haven’t used before.' },
]

function Mark() {
  return (
    <span className="relative block h-10 w-[50px] overflow-hidden sm:h-12 sm:w-[60px]">
      <img src={logo} alt="Yatzar Manage icon" className="absolute left-0 top-0 h-full w-auto max-w-none" />
    </span>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[#00aeef]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 018 0v2.5" />
    </svg>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.7" />
      </svg>
    )
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  )
}

function RecoveryProgress({ step }: { step: ResetStep }) {
  const current = STEP_ORDER.indexOf(step)

  return (
    <aside aria-label="Password reset progress" className="mx-auto w-full max-w-[460px] lg:order-1 lg:mx-0 lg:max-w-[560px]">
      <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-[39px] lg:leading-[1.18]">
        {step === 'done' ? 'You’re all set. Welcome back.' : 'Back in your workspace in three quick steps.'}
      </h2>
      <p className="mt-4 text-sm text-white/80 sm:text-base lg:text-lg">
        {step === 'done'
          ? 'Your projects, models and meetings are right where you left them.'
          : 'Your projects, models and meetings stay exactly as you left them.'}
      </p>

      <ol className="mt-7 sm:mt-9">
        {RECOVERY_STEPS.map((item, index) => {
          const complete = index < current
          const active = index === current
          const isLast = index === RECOVERY_STEPS.length - 1

          return (
            <li key={item.key} className="relative flex gap-4 pb-6 last:pb-0" aria-current={active ? 'step' : undefined}>
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={`absolute left-[15px] top-9 h-[calc(100%-2.25rem)] w-px transition-colors duration-300 ${complete ? 'bg-[#00A6F4]' : 'bg-[#3d3d3d]'}`}
                />
              )}
              <span
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-300 ${
                  complete
                    ? 'border-[#00A6F4] bg-[#00A6F4] text-white'
                    : active
                      ? 'border-[#00aeef] bg-[#00aeef]/10 text-[#00aeef]'
                      : 'border-[#525252] bg-black text-white/50'
                }`}
              >
                {complete ? <CheckIcon /> : index + 1}
              </span>
              <div className="min-w-0 pt-0.5">
                <p className={`text-base font-semibold transition-colors duration-300 ${active || complete ? 'text-white' : 'text-white/55'}`}>{item.title}</p>
                <p className={`mt-0.5 text-sm ${active ? 'text-white/80' : 'text-white/45'}`}>{item.text}</p>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-8 flex items-start gap-3 border-t border-[#3d3d3d] pt-5 sm:mt-10">
        <LockIcon />
        <p className="text-sm text-white/65">We’ll never ask for your password by email. If a message does, don’t reply to it.</p>
      </div>
    </aside>
  )
}

export default function ForgotPassword() {
  const [step, setStep] = useState<ResetStep>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  async function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail) {
      setError('Please enter your work email.')
      return
    }

    setLoading(true)
    try {
      const msg = await authApi.forgotPassword(trimmedEmail)
      toast.success(msg || `Verification code sent to ${trimmedEmail}`)
      setStep('otp')
      setResendCooldown(60)
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to send verification code. Please check your email and try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  async function submitOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const cleanOtp = otp.trim()
    if (cleanOtp.length !== 6) {
      setError('Please enter the full 6-digit verification code.')
      return
    }

    setLoading(true)
    try {
      const msg = await authApi.verifyOtp(email.trim().toLowerCase(), cleanOtp)
      toast.success(msg || 'Code verified.')
      setStep('password')
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'That code doesn’t match or has expired. Check it and try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  async function handleResendCode() {
    if (resending || resendCooldown > 0) return
    setError('')
    setResending(true)
    try {
      const msg = await authApi.forgotPassword(email.trim().toLowerCase())
      toast.success(msg || 'A new verification code has been sent.')
      setResendCooldown(60)
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to resend verification code. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setResending(false)
    }
  }

  async function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Use at least 8 characters for your new password.')
      return
    }
    if (password !== confirmPassword) {
      setError('Your passwords don’t match yet.')
      return
    }

    setLoading(true)
    try {
      const msg = await authApi.resetPassword({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        new_password: password,
      })
      toast.success(msg || 'Password updated successfully.')
      setStep('done')
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to reset password. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'mt-2 h-12 w-full min-w-0 rounded-lg border border-[#525252] bg-black px-4 text-base font-normal outline-none placeholder:text-white/35 focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] disabled:opacity-50 sm:h-[60px] sm:px-6'
  const buttonClass = 'flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#00A6F4] px-5 text-center text-sm font-medium text-white transition hover:bg-[#078fc1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00aeef] disabled:cursor-not-allowed disabled:opacity-60 sm:h-[60px] sm:text-base'

  const titles: Record<ResetStep, string> = {
    email: 'Forgot your password?',
    otp: 'Check your inbox',
    password: 'Create a new password',
    done: 'Password updated',
  }

  const descriptions: Record<ResetStep, string> = {
    email: 'No worries. Enter your work email and we’ll send you a verification code.',
    otp: `Enter the 6-digit code sent to ${email || 'your email'}.`,
    password: 'Choose a strong password you haven’t used before.',
    done: 'Your password has been reset successfully. You can now sign in with your new password.',
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <AnnouncementBanner />
      <Header />
      <main className="flex flex-1 items-center justify-center bg-black px-4 py-8 text-white sm:px-8 sm:py-12 lg:px-10 lg:py-16">
        <div className="grid w-full max-w-[1220px] grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,460px)] lg:gap-16 xl:gap-24">
          <section className="mx-auto w-full min-w-0 max-w-[460px] rounded-2xl border border-[#3d3d3d] bg-[#202020] p-5 sm:p-8 lg:order-2">
            <div className="mb-3 flex justify-center"><Mark /></div>
            <h1 className="text-center text-xl font-bold leading-tight tracking-tight sm:text-2xl">{titles[step]}</h1>
            <p className="mt-2 break-words text-center text-sm text-white/80 sm:text-base">{descriptions[step]}</p>

            {step === 'email' && (
              <form onSubmit={submitEmail} className="mt-6 space-y-4 sm:mt-8">
                <label className="block text-sm font-semibold sm:text-base">
                  Work Email
                  <input
                    className={inputClass}
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    disabled={loading}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                  />
                </label>
                <button type="submit" disabled={loading} className={buttonClass}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? 'Sending code…' : 'Send verification code'}
                </button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={submitOtp} className="mt-6 space-y-4 sm:mt-8">
                <label className="block text-sm font-semibold sm:text-base">
                  Verification code
                  <input
                    className={`${inputClass} text-center tracking-[0.35em] sm:tracking-[0.45em]`}
                    type="text"
                    name="otp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    disabled={loading}
                    value={otp}
                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                  />
                </label>
                <button type="submit" disabled={loading || otp.length < 6} className={buttonClass}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? 'Verifying…' : 'Verify code'}
                </button>
                <div className="flex flex-col gap-2 pt-1 text-center text-sm">
                  <button
                    type="button"
                    disabled={resending || resendCooldown > 0}
                    onClick={handleResendCode}
                    className="cursor-pointer text-white/75 transition hover:text-[#00aeef] disabled:cursor-not-allowed disabled:text-white/40"
                  >
                    {resending ? 'Resending…' : resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend verification code'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStep('email'); setOtp(''); setError('') }}
                    className="cursor-pointer py-1 text-white/75 transition hover:text-[#00aeef]"
                  >
                    Change email address
                  </button>
                </div>
              </form>
            )}

            {step === 'password' && (
              <form onSubmit={submitPassword} className="mt-6 space-y-4 sm:mt-8">
                <label className="block text-sm font-semibold sm:text-base">
                  New password
                  <span className="relative block">
                    <input
                      className={`${inputClass} pr-12`}
                      type={showPassword ? 'text' : 'password'}
                      name="new-password"
                      autoComplete="new-password"
                      minLength={8}
                      required
                      disabled={loading}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 8 characters"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 grid cursor-pointer place-items-center text-white/80 hover:text-white sm:right-4"
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </span>
                </label>
                <label className="block text-sm font-semibold sm:text-base">
                  Confirm new password
                  <span className="relative block">
                    <input
                      className={`${inputClass} pr-12`}
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirm-password"
                      autoComplete="new-password"
                      required
                      disabled={loading}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Enter your new password again"
                    />
                    <button
                      type="button"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 grid cursor-pointer place-items-center text-white/80 hover:text-white sm:right-4"
                    >
                      <EyeIcon open={showConfirmPassword} />
                    </button>
                  </span>
                </label>
                <button type="submit" disabled={loading} className={buttonClass}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? 'Resetting…' : 'Reset password'}
                </button>
              </form>
            )}

            {step === 'done' && (
              <div className="mt-6 sm:mt-8">
                <Link to="/sign-in" className={buttonClass}>Return to sign in</Link>
              </div>
            )}

            {error && <p role="alert" className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
            {step !== 'done' && (
              <p className="mt-6 text-center text-sm text-white/80">
                Remembered your password? <Link to="/sign-in" className="cursor-pointer text-[#00aeef] transition hover:underline">Back to sign in</Link>
              </p>
            )}
          </section>

          <RecoveryProgress step={step} />
        </div>
      </main>
      <Footer backgroundClass="bg-[#171717]" />
    </div>
  )
}
