import { useState, type FormEvent } from 'react'
import { Link } from '@tanstack/react-router'
import logo from '../assets/logo.png'
import AnnouncementBanner from '../components/banner/announcement-banner'
import Header from '../components/header/header'
import Footer from '../components/footer/footer'

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
  const [error, setError] = useState('')

  function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setStep('otp')
  }

  function submitOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (otp !== '123456') {
      setError('That code doesn’t match. Check it and try again.')
      return
    }
    setError('')
    setStep('password')
  }

  function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (password.length < 8) {
      setError('Use at least 8 characters for your new password.')
      return
    }
    if (password !== confirmPassword) {
      setError('Your passwords don’t match yet.')
      return
    }
    setError('')
    setStep('done')
  }

  const inputClass = 'mt-2 h-12 w-full min-w-0 rounded-lg border border-[#525252] bg-black px-4 text-base font-normal outline-none placeholder:text-white/35 focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] sm:h-[60px] sm:px-6'
  const buttonClass = 'flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-[#00A6F4] px-5 text-center text-sm font-medium text-white transition hover:bg-[#078fc1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00aeef] sm:h-[60px] sm:text-base'
  const titles: Record<ResetStep, string> = {
    email: 'Forgot your password?',
    otp: 'Check your inbox',
    password: 'Create a new password',
    done: 'Password updated',
  }
  const descriptions: Record<ResetStep, string> = {
    email: 'No worries. Enter your work email and we’ll send you a verification code.',
    otp: `Enter the 6-digit code sent to ${email}.`,
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
                  <input className={inputClass} type="email" name="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" />
                </label>
                <button type="submit" className={buttonClass}>Send verification code</button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={submitOtp} className="mt-6 space-y-4 sm:mt-8">
                <label className="block text-sm font-semibold sm:text-base">
                  Verification code
                  <input className={`${inputClass} text-center tracking-[0.35em] sm:tracking-[0.45em]`} type="text" name="otp" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" />
                </label>
                <p className="text-xs text-white/55">Prototype preview code: <span className="font-semibold text-white/75">123456</span></p>
                <button type="submit" className={buttonClass}>Verify code</button>
                <button type="button" onClick={() => { setStep('email'); setOtp(''); setError('') }} className="w-full cursor-pointer py-1 text-sm text-white/75 transition hover:text-[#00aeef]">Change email address</button>
              </form>
            )}

            {step === 'password' && (
              <form onSubmit={submitPassword} className="mt-6 space-y-4 sm:mt-8">
                <label className="block text-sm font-semibold sm:text-base">
                  New password
                  <input className={inputClass} type="password" name="new-password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" />
                </label>
                <label className="block text-sm font-semibold sm:text-base">
                  Confirm new password
                  <input className={inputClass} type="password" name="confirm-password" autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Enter your new password again" />
                </label>
                <button type="submit" className={buttonClass}>Reset password</button>
              </form>
            )}

            {step === 'done' && (
              <div className="mt-6 sm:mt-8">
                <Link to="/login" className={buttonClass}>Return to sign in</Link>
              </div>
            )}

            {error && <p role="alert" className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
            {step !== 'done' && <p className="mt-6 text-center text-sm text-white/80">Remembered your password? <Link to="/login" className="cursor-pointer text-[#00aeef] transition hover:underline">Back to sign in</Link></p>}
          </section>

          <RecoveryProgress step={step} />
        </div>
      </main>
      <Footer backgroundClass="bg-[#171717]" />
    </div>
  )
}