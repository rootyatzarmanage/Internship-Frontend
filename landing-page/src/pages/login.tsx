import { useState, type FormEvent } from 'react'
import { Link } from '@tanstack/react-router'
import logo from '../assets/logo.png'
import WireframeBuilding from '../components/wireframes/wireframebuilding'
import AnnouncementBanner from '../components/banner/announcement-banner'
import Header from '../components/header/header'
import Footer from '../components/footer/footer'

function Mark() {
  return (
    <span className="relative block h-10 w-[50px] overflow-hidden sm:h-12 sm:w-[60px]">
      <img src={logo} alt="Yatzar Manage icon" className="absolute left-0 top-0 h-full w-auto max-w-none" />
    </span>
  )
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <>
    <AnnouncementBanner />
    <Header />
    <main className="flex min-h-[calc(100vh-110px)] items-center justify-center bg-black px-5 py-10 text-white sm:px-8 sm:py-14 lg:min-h-[calc(100vh-120px)] lg:px-10">
      <div className="grid w-full max-w-[1280px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <section className="mx-auto w-full max-w-[600px]">
          <div className="mb-3 flex justify-center"><Mark /></div>
          <h1 className="text-center text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-[60px]">Welcome Back!</h1>
          <p className="mt-2 text-center text-sm text-white/80 sm:text-base">Please enter your details to get started</p>

          <form onSubmit={submitLogin} className="mt-7 space-y-4 sm:mt-8">
            <label className="block text-sm font-semibold sm:text-base">
              Work Email
              <input type="email" name="email" autoComplete="username" required placeholder="you@company.com" className="mt-2 h-[52px] w-full rounded-lg border border-[#525252] bg-black px-4 text-base font-normal outline-none placeholder:text-white/35 focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] sm:h-[60px] sm:px-6" />
            </label>

            <label className="block text-sm font-semibold sm:text-base">
              Password
              <span className="relative mt-2 block">
                <input type={showPassword ? 'text' : 'password'} name="password" autoComplete="current-password" required placeholder="Enter your password" className="h-[52px] w-full rounded-lg border border-[#525252] bg-black px-4 pr-12 text-base font-normal outline-none placeholder:text-white/35 focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] sm:h-[60px] sm:px-6 sm:pr-14" />
                <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-3 grid cursor-pointer place-items-center text-white/80 hover:text-white sm:right-4">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.7"/></svg>
                </button>
              </span>
            </label>

            <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
              <label className="mt-[10px] flex cursor-pointer items-center gap-4 text-white/90">
            {/* Checkbox */}
            <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
            <input
                className="peer h-6 w-6 cursor-pointer appearance-none rounded-[6px] border border-[#00aeef] bg-transparent transition-colors checked:bg-[#00aeef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef]/50"
                type="checkbox"
                name="addToCalendar"
            />
            <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute h-4 w-4 text-black opacity-0 peer-checked:opacity-100"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M5 12.5l4.5 4.5L19 7" />
            </svg>
            </span>

            <span className="flex min-w-0 flex-col gap-1.5">
            <span className="text-sm leading-5 sm:text-base sm:leading-6 lg:text-lg">
                Remember Me
            </span>
            </span>
        </label>
              <button type="button" className="cursor-pointer text-white/90 transition hover:text-[#00aeef]">Forgot Password?</button>
            </div>
            <button type="submit" className="h-[52px] w-full cursor-pointer rounded-lg bg-[#00A6F4] px-5 text-center text-sm font-medium text-white transition hover:bg-[#078fc1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00aeef] sm:h-[60px] sm:text-base">Sign In</button>
          </form>

          <div className="my-4 flex items-center gap-3 text-sm text-white/80 sm:my-5"><span className="h-px flex-1 bg-white/50" />or<span className="h-px flex-1 bg-white/50" /></div>
          <button type="button" className="flex h-[48px] w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-[#525252] text-sm transition hover:bg-white/5 sm:h-[56px] sm:text-base">
            <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5"><path fill="#FFC107" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"/><path fill="#FF3D00" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2A20 20 0 0 0 24 44Z"/><path fill="#4CAF50" d="M12.6 27.5a12 12 0 0 1 0-7v-5.2H5.8a20 20 0 0 0 0 17.4l6.8-5.2Z"/><path fill="#1976D2" d="M24 12.1c3 0 5.6 1 7.7 3.1l5.8-5.8A19.4 19.4 0 0 0 24 4 20 20 0 0 0 5.8 15.3l6.8 5.2C14.2 15.7 18.7 12.1 24 12.1Z"/></svg>
            Sign in with Google
          </button>
          <p className="mt-3 text-center text-xs text-white/90 sm:text-sm">Don’t have an account? <Link to="/signup" className="cursor-pointer text-[#00aeef] transition hover:underline">Sign Up</Link></p>
        </section>

        <aside className="relative flex min-h-[260px] flex-col rounded-2xl border border-[#525252] p-6 sm:min-h-[320px] sm:p-10 lg:min-h-[520px] xl:min-h-[740px] xl:p-12">
          <p className="text-sm uppercase tracking-wide text-white/90">BIM Project Management</p>
          <h2 className="mt-5 max-w-[560px] text-[39px] font-bold leading-[1.18] tracking-tight">Start free and bring your whole team, projects and IFC models into one workspace.</h2>
          <p className="mt-5 text-base text-white/85 sm:text-lg">Yatzar Manage • Projects, models and meetings</p>

          <div className="relative mt-6 min-h-[240px] flex-1">
            <WireframeBuilding className="absolute inset-0 h-full w-full" />
          </div>
        </aside>
      </div>
    </main>
    <Footer backgroundClass="bg-[#171717]" />
    </>
  )
}
