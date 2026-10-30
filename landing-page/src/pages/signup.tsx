import { useState, type FormEvent } from 'react'
import { Link } from '@tanstack/react-router'
import DropdownSelect from '../components/dropdown/dropdown-select'
import Footer from '../components/footer/footer'

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false)

  function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  const inputClass = 'mt-2 h-[52px] w-full rounded-lg border border-[#525252] bg-black px-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] sm:h-[56px] sm:px-5 sm:text-base'
  const labelClass = 'block min-w-0 text-sm font-medium text-white/90 sm:text-base'

  return (
    <>
      <main className="min-h-[calc(100vh-110px)] bg-black px-5 py-10 text-white sm:px-8 sm:py-14 lg:min-h-[calc(100vh-120px)]">
        <section className="mx-auto w-full max-w-[760px] overflow-hidden rounded-xl border border-[#525252] bg-[#0a0a0a]">
          <h1 className="border-b border-white/15 bg-[#171717] px-5 py-4 text-lg font-semibold sm:px-7 sm:py-5 sm:text-xl">Choose To Register As</h1>

          <div className="p-5 sm:p-7 lg:p-8">
            <p className="text-sm text-white/85 mb-5 sm:text-base">
              Already have an account?{' '}
              <Link to="/login" className="cursor-pointer text-[#00aeef] transition hover:underline">Log In Instead</Link>
            </p>
            <button type="button" className="flex h-[48px] w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-[#525252] text-sm transition hover:bg-white/5 sm:h-[56px] sm:text-base">
                <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5"><path fill="#FFC107" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"/><path fill="#FF3D00" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2A20 20 0 0 0 24 44Z"/><path fill="#4CAF50" d="M12.6 27.5a12 12 0 0 1 0-7v-5.2H5.8a20 20 0 0 0 0 17.4l6.8-5.2Z"/><path fill="#1976D2" d="M24 12.1c3 0 5.6 1 7.7 3.1l5.8-5.8A19.4 19.4 0 0 0 24 4 20 20 0 0 0 5.8 15.3l6.8 5.2C14.2 15.7 18.7 12.1 24 12.1Z"/></svg>
                Sign in with Google
            </button>

            <div className="my-8 flex items-center gap-4 text-sm text-white/75 sm:my-10">
              <span className="h-px flex-1 bg-white/30" />or<span className="h-px flex-1 bg-white/30" />
            </div>

            <form onSubmit={submitSignup} className="space-y-4 sm:space-y-5">
              <label className={labelClass}>
                Name <span className="text-white">*</span>
                <input className={inputClass} name="name" autoComplete="name" placeholder="Name" required />
              </label>

              <label className={labelClass}>
                Email <span className="text-white">*</span>
                <input className={inputClass} type="email" name="email" autoComplete="email" placeholder="Email Id" required />
              </label>

              <label className={labelClass}>
                Password <span className="text-white">*</span>
                <span className="relative mt-2 block">
                  <input className="h-[52px] w-full rounded-lg border border-[#525252] bg-black px-4 pr-12 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] sm:h-[56px] sm:px-5 sm:pr-14 sm:text-base" type={showPassword ? 'text' : 'password'} name="password" autoComplete="new-password" placeholder="Password" required />
                  <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-3 grid cursor-pointer place-items-center text-white/75 hover:text-white sm:right-4">
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.7"/></svg>
                  </button>
                </span>
              </label>

              <label className="inline-flex cursor-pointer items-center gap-3 text-sm text-white/80 sm:text-base">
                <input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} className="h-4 w-4 cursor-pointer accent-[#00aeef]" />
                Show Password
              </label>

              <label className={labelClass}>
                Country <span className="text-white">*</span>
                <DropdownSelect name="country" defaultValue="India" autoComplete="country-name" containerClassName="mt-2 w-full" className="h-[52px] w-full rounded-lg border border-[#525252] bg-black px-4 text-sm text-white outline-none focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] sm:h-[56px] sm:px-5 sm:text-base" iconClassName="right-4 h-4 w-4" selectPaddingClassName="pr-10">
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>Other</option>
                </DropdownSelect>
              </label>

              <label className={labelClass}>
                Phone
                <span className="mt-2 grid grid-cols-[minmax(116px,0.38fr)_minmax(0,1fr)] gap-2">
                  <DropdownSelect name="countryCode" aria-label="Country calling code" defaultValue="+91" containerClassName="w-full" className="h-[52px] w-full rounded-lg border border-[#525252] bg-black px-3 text-sm text-white outline-none focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] sm:h-[56px] sm:px-4 sm:text-base" iconClassName="right-3 h-4 w-4" selectPaddingClassName="pr-8">
                    <option value="+91">India (+91)</option>
                    <option value="+1">US (+1)</option>
                    <option value="+44">UK (+44)</option>
                    <option value="+61">Australia (+61)</option>
                  </DropdownSelect>
                  <input className="h-[52px] min-w-0 rounded-lg border border-[#525252] bg-black px-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] sm:h-[56px] sm:px-5 sm:text-base" type="tel" name="phone" autoComplete="tel-national" placeholder="Phone" />
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 pt-2 text-xs leading-5 text-white/80 sm:text-sm">
                <input type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-[#00aeef]" />
                <span>I have read and agree to the Yatzar Manage <strong className="font-semibold text-white">Terms Of Service</strong> and <strong className="font-semibold text-white">Privacy Policy</strong>.</span>
              </label>

              <button type="submit" className="h-11 cursor-pointer rounded-md bg-[#00A6F4] px-7 text-sm font-semibold text-white transition hover:bg-[#078fc1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00aeef] sm:h-12 sm:text-base">Verify</button>
            </form>
          </div>
        </section>
      </main>
      <Footer backgroundClass="bg-[#171717]" />
    </>
  )
}
