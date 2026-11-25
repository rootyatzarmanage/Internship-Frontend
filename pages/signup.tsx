import { useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useSearch } from '@tanstack/react-router';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
import { resolvePostAuthRedirect } from '@/lib/api';
import apiClient from '@/lib/axios';
import { authApi } from '@/features/auth/api/auth-api';
import { safeLandingPath } from '@/features/settings/settings-routing';
import DropdownSelect from '../components/dropdown/dropdown-select';
import { RecaptchaV2 } from '../components/recaptcha-v2';

const recaptchaSiteKey: string | undefined = import.meta.env.VITE_RECAPTCHA_SITE_KEY
const googleClientId: string | undefined = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function Signup() {
  const queryClient = useQueryClient()
  const search = useSearch({ strict: false }) as { redirect?: string }
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaVersion, setCaptchaVersion] = useState(0)

  const finishSignup = async (
    idToken: string,
    accessToken: string,
    profileDetails?: { country: string; countryCode: string; phone: string },
  ) => {
    await useAuthStore.getState().login(idToken, accessToken)
    queryClient.clear()
    if (profileDetails && (profileDetails.country || profileDetails.phone)) {
      try {
        await authApi.updateEditProfile({
          country: profileDetails.country || undefined,
          country_code: profileDetails.phone ? profileDetails.countryCode : undefined,
          phone: profileDetails.phone || undefined,
        })
        await useAuthStore.getState().refreshProfile()
      } catch {
        toast.warning('Your account was created, but contact details could not be saved. You can add them from your profile.')
      }
    }
    toast.success('Account created. Welcome aboard!')
    const inviteRedirect = search.redirect?.startsWith('/invite') ? search.redirect : undefined
    const destination = inviteRedirect ?? safeLandingPath(search.redirect ?? '') ?? await resolvePostAuthRedirect()
    window.location.assign(destination)
  }

  const submitSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (recaptchaSiteKey && !captchaToken) {
      toast.error('Please complete the “I’m not a robot” check.')
      return
    }

    const form = new FormData(event.currentTarget)
    const fullName = String(form.get('name') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')
    const confirmPassword = String(form.get('confirmPassword') ?? '')
    const country = String(form.get('country') ?? '')
    const countryCode = String(form.get('countryCode') ?? '')
    const phone = String(form.get('phone') ?? '').trim()
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      // Create the account through the existing backend endpoint, then use the
      // established login flow to initialize the app session and user profile.
      await apiClient.post('/auth/cognito-signup', {
        full_name: fullName,
        email,
        password,
      })
      const tokens = await authApi.cognitoLogin(email, password, captchaToken ?? undefined)
      await finishSignup(tokens.id_token, tokens.access_token, { country, countryCode, phone })
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Sign up failed. Please try again.')
      if (recaptchaSiteKey) {
        setCaptchaToken(null)
        setCaptchaVersion((value) => value + 1)
      }
    } finally {
      setLoading(false)
    }
  }

  const signUpWithGoogle = async (credential?: string) => {
    if (!credential) {
      toast.error('Google sign-up did not return a credential. Please try again.')
      return
    }
    setLoading(true)
    try {
      // The backend creates a new user on the first verified Google sign-in.
      const tokens = await authApi.googleLogin(credential)
      await finishSignup(tokens.id_token, tokens.access_token)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Google sign-up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'mt-2 h-[52px] w-full rounded-lg border border-[#525252] bg-black px-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] disabled:opacity-60 sm:h-[56px] sm:px-5 sm:text-base'
  const labelClass = 'block min-w-0 text-sm font-medium text-white/90 sm:text-base'

  return (
    <>
      <main className='min-h-[calc(100vh-110px)] bg-black px-5 py-10 text-white sm:px-8 sm:py-14 lg:min-h-[calc(100vh-120px)]'>
        <section className='mx-auto w-full max-w-[760px] overflow-hidden rounded-xl border border-[#525252] bg-[#0a0a0a]'>
          <h1 className='border-b border-white/15 bg-[#171717] px-5 py-4 text-lg font-semibold sm:px-7 sm:py-5 sm:text-xl'>
            Choose To Register As
          </h1>
          <div className='p-5 sm:p-7 lg:p-8'>
            <p className='mb-5 text-sm text-white/85 sm:text-base'>
              Already have an account?{' '}
              <Link
                to='/sign-in'
                search={
                  search.redirect ? { redirect: search.redirect } : undefined
                }
                className='cursor-pointer text-[#00aeef] transition hover:underline'
              >
                Log In Instead
              </Link>
            </p>
            {googleClientId && (
              <div className='flex justify-center'>
                <GoogleOAuthProvider clientId={googleClientId}>
                  <GoogleLogin
                    onSuccess={(response) =>
                      void signUpWithGoogle(response.credential)
                    }
                    onError={() =>
                      toast.error('Google sign-up failed. Please try again.')
                    }
                    theme='filled_black'
                    size='large'
                    text='signup_with'
                    shape='rectangular'
                  />
                </GoogleOAuthProvider>
              </div>
            )}
            <div className='my-8 flex items-center gap-4 text-sm text-white/75 sm:my-10'>
              <span className='h-px flex-1 bg-white/30' />
              or
              <span className='h-px flex-1 bg-white/30' />
            </div>

            <form onSubmit={submitSignup} className='space-y-4 sm:space-y-5'>
              <label className={labelClass}>
                Name <span className='text-white'>*</span>
                <input
                  className={inputClass}
                  name='name'
                  autoComplete='name'
                  placeholder='Name'
                  required
                  disabled={loading}
                />
              </label>
              <label className={labelClass}>
                Email <span className='text-white'>*</span>
                <input
                  className={inputClass}
                  type='email'
                  name='email'
                  autoComplete='email'
                  placeholder='Email Id'
                  required
                  disabled={loading}
                />
              </label>
              <label className={labelClass}>
                Password <span className='text-white'>*</span>
                <span className='relative mt-2 block'>
                  <input
                    className='h-[52px] w-full rounded-lg border border-[#525252] bg-black px-4 pr-12 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] disabled:opacity-60 sm:h-[56px] sm:px-5 sm:pr-14 sm:text-base'
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    autoComplete='new-password'
                    placeholder='Password'
                    required
                    disabled={loading}
                  />
                  <button
                    type='button'
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    onClick={() => setShowPassword((visible) => !visible)}
                    className='absolute inset-y-0 right-3 grid cursor-pointer place-items-center text-white/75 hover:text-white sm:right-4'
                  >
                    <svg
                      aria-hidden='true'
                      viewBox='0 0 24 24'
                      className='h-5 w-5'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='1.6'
                    >
                      <path d='M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z' />
                      <circle cx='12' cy='12' r='2.7' />
                    </svg>
                  </button>
                </span>
              </label>
              <label className={labelClass}>
                Confirm Password
                <input
                  className={inputClass}
                  type={showPassword ? 'text' : 'password'}
                  name='confirmPassword'
                  autoComplete='new-password'
                  placeholder='Confirm password'
                  required
                  disabled={loading}
                />
              </label>
              <label className='inline-flex cursor-pointer items-center gap-3 text-sm text-white/80 sm:text-base'>
                <input
                  type='checkbox'
                  checked={showPassword}
                  onChange={(event) => setShowPassword(event.target.checked)}
                  className='h-4 w-4 cursor-pointer accent-[#00aeef]'
                />
                Show Password
              </label>
              <label className={labelClass}>
                Country <span className='text-white'>*</span>
                <DropdownSelect
                  name='country'
                  defaultValue='India'
                  autoComplete='country-name'
                  disabled={loading}
                  containerClassName='mt-2 w-full'
                  className='h-[52px] w-full rounded-lg border border-[#525252] bg-black px-4 text-sm text-white outline-none focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] sm:h-[56px] sm:px-5 sm:text-base'
                  iconClassName='right-4 h-4 w-4'
                  selectPaddingClassName='pr-10'
                >
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>Other</option>
                </DropdownSelect>
              </label>
              <label className={labelClass}>
                Phone
                <span className='mt-2 grid grid-cols-[minmax(116px,0.38fr)_minmax(0,1fr)] gap-2'>
                  <DropdownSelect
                    name='countryCode'
                    aria-label='Country calling code'
                    defaultValue='+91'
                    disabled={loading}
                    containerClassName='w-full'
                    className='h-[52px] w-full rounded-lg border border-[#525252] bg-black px-3 text-sm text-white outline-none focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] sm:h-[56px] sm:px-4 sm:text-base'
                    iconClassName='right-3 h-4 w-4'
                    selectPaddingClassName='pr-8'
                  >
                    <option value='+91'>India (+91)</option>
                    <option value='+1'>US (+1)</option>
                    <option value='+44'>UK (+44)</option>
                    <option value='+61'>Australia (+61)</option>
                  </DropdownSelect>
                  <input
                    className='h-[52px] min-w-0 rounded-lg border border-[#525252] bg-black px-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] disabled:opacity-60 sm:h-[56px] sm:px-5 sm:text-base'
                    type='tel'
                    name='phone'
                    autoComplete='tel-national'
                    placeholder='Phone'
                    disabled={loading}
                  />
                </span>
              </label>
              {recaptchaSiteKey && (
                <div className='flex justify-center pt-1'>
                  <RecaptchaV2
                    key={captchaVersion}
                    siteKey={recaptchaSiteKey}
                    onChange={setCaptchaToken}
                    theme='dark'
                  />
                </div>
              )}
              <label className='flex cursor-pointer items-start gap-3 pt-2 text-xs leading-5 text-white/80 sm:text-sm'>
                <input
                  type='checkbox'
                  name='terms'
                  required
                  disabled={loading}
                  className='mt-1 h-4 w-4 shrink-0 accent-[#00aeef]'
                />
                <span>
                  I have read and agree to the Yatzar Manage{' '}
                  <strong className='font-semibold text-white'>
                    Terms Of Service
                  </strong>{' '}
                  and{' '}
                  <strong className='font-semibold text-white'>
                    Privacy Policy
                  </strong>
                  .
                </span>
              </label>
              <button
                type='submit'
                disabled={loading}
                className='flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#00A6F4] px-7 text-sm font-semibold text-white transition hover:bg-[#078fc1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00aeef] disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:text-base'
              >
                {loading && <Loader2 className='h-4 w-4 animate-spin' />}
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  )
}
