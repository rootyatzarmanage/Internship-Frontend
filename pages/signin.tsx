import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
import { authApi } from '@/features/auth/api/auth-api';
import { getPostLoginDestination } from '@/features/settings/settings-routing';
import logo from '../assets/logo.png';
import { RecaptchaV2 } from '../components/recaptcha-v2';
import WireframeBuilding from '../components/wireframes/wireframebuilding';

const recaptchaSiteKey: string | undefined = import.meta.env.VITE_RECAPTCHA_SITE_KEY
const googleClientId: string | undefined = import.meta.env.VITE_GOOGLE_CLIENT_ID

function Mark() {
  return (
    <span className='relative block h-10 w-[50px] overflow-hidden sm:h-12 sm:w-[60px]'>
      <img src={logo} alt='Yatzar Manage icon' className='absolute top-0 left-0 h-full w-auto max-w-none' />
    </span>
  )
}

export default function Signin() {
  // Automatically clean redirect slug from URL bar if present
  useState(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  });
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as { redirect?: string }
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaVersion, setCaptchaVersion] = useState(0)

  const finishLogin = async (idToken: string, accessToken: string) => {
    const result = await useAuthStore.getState().login(idToken, accessToken)
    queryClient.clear()
    toast.success(`Welcome back${result.user.full_name ? `, ${result.user.full_name}` : ''}!`)
    const inviteRedirect = search.redirect?.startsWith('/invite')
      ? search.redirect
      : undefined
    const pricingPlanRedirect = search.redirect === 'workspace-admin/billing/upgrade?type=pim'
      ? search.redirect
      : undefined
    if (inviteRedirect) {
      await navigate({ to: inviteRedirect as never, replace: true })
      return
    }
    if (pricingPlanRedirect) {
      await navigate({ to: '/workspace-admin/billing/upgrade' as never, search: { type: 'pim' }, replace: true })
      return
    }
    await navigate({ to: getPostLoginDestination() as never, replace: true })
  }

  const submitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (recaptchaSiteKey && !captchaToken) {
      toast.error('Please complete the “I’m not a robot” check.')
      return
    }
    const formData = new FormData(event.currentTarget)
    setLoading(true)
    try {
      const tokens = await authApi.cognitoLogin(
        String(formData.get('email') ?? '').trim(),
        String(formData.get('password') ?? ''),
        captchaToken ?? undefined,
      )
      await finishLogin(tokens.id_token, tokens.access_token)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Sign in failed. Check your email and password, then try again.')
      if (recaptchaSiteKey) {
        setCaptchaToken(null)
        setCaptchaVersion((value) => value + 1)
      }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async (credential?: string) => {
    if (!credential) {
      toast.error('Google sign-in did not return a credential. Please try again.')
      return
    }
    setLoading(true)
    try {
      const tokens = await authApi.googleLogin(credential)
      await finishLogin(tokens.id_token, tokens.access_token)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Google sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main className='flex min-h-[calc(100vh-110px)] items-center justify-center bg-black px-5 py-10 text-white sm:px-8 sm:py-14 lg:min-h-[calc(100vh-120px)] lg:px-10'>
        <div className='grid w-full max-w-[1280px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20'>
          <section className='mx-auto w-full max-w-[600px]'>
            <div className='mb-3 flex justify-center'>
              <Mark />
            </div>
            <h1 className='text-center text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-[60px]'>
              Welcome Back!
            </h1>
            <p className='mt-2 text-center text-sm text-white/80 sm:text-base'>
              Please enter your details to get started
            </p>

            <form onSubmit={submitLogin} className='mt-7 space-y-4 sm:mt-8'>
              <label className='block text-sm font-semibold sm:text-base'>
                Work Email
                <input
                  type='email'
                  name='email'
                  autoComplete='username'
                  required
                  disabled={loading}
                  placeholder='you@company.com'
                  className='mt-2 h-[52px] w-full rounded-lg border border-[#525252] bg-black px-4 text-base font-normal outline-none placeholder:text-white/35 focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] sm:h-[60px] sm:px-6'
                />
              </label>
              <label className='block text-sm font-semibold sm:text-base'>
                Password
                <span className='relative mt-2 block'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    autoComplete='current-password'
                    required
                    disabled={loading}
                    placeholder='Enter your password'
                    className='h-[52px] w-full rounded-lg border border-[#525252] bg-black px-4 pr-12 text-base font-normal outline-none placeholder:text-white/35 focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] sm:h-[60px] sm:px-6 sm:pr-14'
                  />
                  <button
                    type='button'
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    onClick={() => setShowPassword((visible) => !visible)}
                    className='absolute inset-y-0 right-3 grid cursor-pointer place-items-center text-white/80 hover:text-white sm:right-4'
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
              <div className='flex items-center justify-between gap-3 text-xs sm:text-sm'>
                <label className='mt-2 inline-flex cursor-pointer items-center gap-3 text-white/90'>
                  <input
                    type='checkbox'
                    name='rememberMe'
                    className='h-4 w-4 accent-[#00aeef]'
                  />
                  Remember Me
                </label>
                <Link
                  to='/forgot-password'
                  className='mt-2 text-white/90 transition hover:text-[#00aeef]'
                >
                  Forgot Password?
                </Link>
              </div>
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
              <button
                type='submit'
                disabled={loading}
                className='flex h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#00A6F4] px-5 text-center text-sm font-medium text-white transition hover:bg-[#078fc1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00aeef] disabled:cursor-not-allowed disabled:opacity-60 sm:h-[60px] sm:text-base'
              >
                {loading && <Loader2 className='h-4 w-4 animate-spin' />}
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <div className='my-4 flex items-center gap-3 text-sm text-white/80 sm:my-5'>
              <span className='h-px flex-1 bg-white/50' />
              or
              <span className='h-px flex-1 bg-white/50' />
            </div>
            {googleClientId && (
              <div className='flex justify-center'>
                <GoogleOAuthProvider clientId={googleClientId}>
                  <GoogleLogin
                    onSuccess={(response) =>
                      void signInWithGoogle(response.credential)
                    }
                    onError={() =>
                      toast.error('Google sign-in failed. Please try again.')
                    }
                    theme='filled_black'
                    size='large'
                    text='signin_with'
                    shape='rectangular'
                  />
                </GoogleOAuthProvider>
              </div>
            )}
            <p className='mt-3 text-center text-xs text-white/90 sm:text-sm'>
              Don’t have an account?{' '}
              <Link
                to='/sign-up'
                search={
                  search.redirect ? { redirect: search.redirect } : undefined
                }
                className='cursor-pointer text-[#00aeef] transition hover:underline'
              >
                Sign Up
              </Link>
            </p>
            <p className='mt-2 text-center text-xs text-white/90 sm:text-sm'>
              <Link
                to='/forgot-password'
                className='cursor-pointer text-[#00aeef] transition hover:underline'
              >
                Forgot Password?
              </Link>
            </p>
          </section>

          <aside className='relative flex min-h-[260px] flex-col rounded-2xl border border-[#525252] p-6 sm:min-h-[320px] sm:p-10 lg:min-h-[520px] xl:min-h-[740px] xl:p-12'>
            <p className='text-sm tracking-wide text-white/90 uppercase'>
              BIM Project Management
            </p>
            <h2 className='mt-5 max-w-[560px] text-[39px] leading-[1.18] font-bold tracking-tight'>
              Start free and bring your whole team, projects and IFC models into
              one workspace.
            </h2>
            <p className='mt-5 text-base text-white/85 sm:text-lg'>
              Yatzar Manage • Projects, models and meetings
            </p>
            <div className='relative mt-6 min-h-[240px] flex-1'>
              <WireframeBuilding className='absolute inset-0 h-full w-full' />
            </div>
          </aside>
        </div>
      </main>
    </>
  )
}
