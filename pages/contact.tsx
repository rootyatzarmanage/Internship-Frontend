import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import DropdownSelect from '../components/dropdown/dropdown-select';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import { RecaptchaV2 } from '../components/recaptcha-v2';
import { contactApi } from '../features/contact-list/api';
import { INTEREST_OPTIONS } from '../features/contact-list/constants';

const recaptchaSiteKey: string | undefined = import.meta.env.VITE_RECAPTCHA_SITE_KEY

function ContactForm() {
  const [submitting, setSubmitting] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaVersion, setCaptchaVersion] = useState(0)

  async function submitContactForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (recaptchaSiteKey && !captchaToken) {
      toast.error('Please complete the “I’m not a robot” check.')
      return
    }
    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      setSubmitting(true)
      await contactApi.create({
        first_name: String(formData.get('firstName') || '').trim(),
        last_name: String(formData.get('lastName') || '').trim() || undefined,
        email: String(formData.get('email') || '').trim(),
        phone_country_code: String(formData.get('countryCode') || '').trim() || undefined,
        phone: String(formData.get('phone') || '').trim() || undefined,
        interested_in: String(formData.get('interest') || '').trim() || undefined,
        message: String(formData.get('message') || '').trim(),
      })
      toast.success('Thanks for reaching out! Our team will get back to you soon.')
      form.reset()
      if (recaptchaSiteKey) {
        setCaptchaToken(null)
        setCaptchaVersion((value) => value + 1)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit contact enquiry')
      if (recaptchaSiteKey) {
        setCaptchaToken(null)
        setCaptchaVersion((value) => value + 1)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const fieldClass = 'mt-2 h-[60px] w-full rounded-xl border border-[#525252] bg-black px-6 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] hover:cursor-pointer sm:text-base lg:text-lg'
  const dropdownClass = 'h-[60px] w-full rounded-xl border border-[#525252] bg-black px-6 py-3 text-sm text-white outline-none focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] hover:cursor-pointer sm:text-base lg:text-lg'
  const labelClass = 'text-sm text-white/90 sm:text-base lg:text-lg'

  return (
    <form onSubmit={submitContactForm} className='mt-8 space-y-5 sm:mt-10'>
      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
        <label className={labelClass}>
          First Name{' '}
          <span className='text-white' aria-hidden='true'>
            *
          </span>
          <input
            className={fieldClass}
            name='firstName'
            autoComplete='given-name'
            placeholder='First name'
            required
          />
        </label>
        <label className={labelClass}>
          Last Name
          <input
            className={fieldClass}
            name='lastName'
            autoComplete='family-name'
            placeholder='Last name'
          />
        </label>
      </div>

      <label className={`block ${labelClass}`}>
        Work Email{' '}
        <span className='text-white' aria-hidden='true'>
          *
        </span>
        <input
          className={fieldClass}
          type='email'
          name='email'
          autoComplete='email'
          placeholder='you@company.com'
          required
        />
      </label>

      <label className={`block ${labelClass}`}>
        Phone Number
        <div className='mt-2 flex gap-[10px]'>
          <DropdownSelect
            name='countryCode'
            aria-label='Country calling code'
            defaultValue='+91'
            containerClassName='h-[60px] w-[96px] shrink-0'
            className='h-full w-full rounded-xl border border-[#525252] bg-black px-4 py-3 text-sm text-white outline-none focus:border-[#00aeef] sm:text-base lg:text-lg'
            iconClassName='right-3 h-4 w-4'
            selectPaddingClassName='pr-8'
          >
            <option value='+91'>+91</option>
            <option value='+1'>+1</option>
            <option value='+44'>+44</option>
            <option value='+61'>+61</option>
          </DropdownSelect>
          <input
            className='h-[60px] min-w-0 flex-1 rounded-xl border border-[#525252] bg-black px-6 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] sm:text-base lg:text-lg'
            type='tel'
            name='phone'
            autoComplete='tel-national'
            placeholder='00000 00000'
          />
        </div>
      </label>

      <label className={`block ${labelClass}`}>
        Interested In <span className="text-white/45">(Optional)</span>
        <DropdownSelect name="interest" defaultValue="" containerClassName="mt-2 w-full" className={dropdownClass}>
          <option value="">Select an option</option>
          {INTEREST_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </DropdownSelect>
      </label>

      <label className={`block ${labelClass}`}>
        Message{' '}
        <span className='text-white' aria-hidden='true'>
          *
        </span>
        <textarea
          className='mt-2 min-h-32 w-full resize-y rounded-xl border border-[#525252] bg-black px-6 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] sm:text-base lg:text-lg'
          name='message'
          placeholder='Tell us how we can help...'
          required
        />
      </label>

      {recaptchaSiteKey && (
        <div className='flex justify-start pt-1'>
          <RecaptchaV2
            key={captchaVersion}
            siteKey={recaptchaSiteKey}
            onChange={setCaptchaToken}
            theme='dark'
            className='flex justify-start'
          />
        </div>
      )}

      <button
        type='submit'
        className='inline-flex h-12 items-center justify-center rounded-lg bg-[#00A6F4] px-6 py-3 text-sm font-medium text-white transition hover:cursor-pointer hover:bg-[#078fc1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00aeef] sm:px-8 sm:text-base lg:text-lg'
      >
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}

export default function Contact() {
  return (
    <div className='tpl-site min-h-screen bg-black text-white'>
      <main className='px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-[60px] 2xl:px-0'>
        <div className='mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-8 xl:gap-12'>
          <section className='min-w-0'>
            <p className='text-base font-normal tracking-wide text-[#00aeef] uppercase'>
              Contact Us
            </p>
            <h1 className='mt-5 text-3xl leading-[1.08] font-bold tracking-[-0.02em] sm:text-4xl lg:mt-8 lg:text-[76px]'>
              How Can We Help?
            </h1>
            <p className='mt-5 max-w-[760px] text-sm leading-6 text-white/90 sm:mt-6 sm:text-base sm:leading-7 lg:text-lg lg:leading-[34px]'>
              Questions about Yatzar Manage, pricing or your projects? Send us a
              message and our team will get back to you.
            </p>

            <div className='mt-7 sm:mt-8'>
              <h2 className='text-base font-semibold text-white/65 sm:text-lg'>
                Address
              </h2>
              <address className='mt-3 text-sm leading-6 text-white/90 not-italic sm:text-base sm:leading-7 lg:text-lg lg:leading-[34px]'>
                <strong className='font-semibold text-white'>PSG-STEP</strong>{' '}
                <br />
                PSG College of Technology,
                <br />
                Peelamedu, Coimbatore - 641 004
                <br />
                Tamil Nadu, India
              </address>
            </div>

            <div className='mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-8'>
              <div>
                <h2 className='text-base font-semibold text-white/65 sm:text-lg'>
                  E-mail
                </h2>
                <a
                  href='mailto:reachus@yatzarmanage.com'
                  className='mt-2 inline-block text-sm break-all text-[#00aeef] transition hover:text-white sm:mt-3 sm:text-base lg:text-lg'
                >
                  reachus@yatzarmanage.com
                </a>
              </div>
              <div>
                <h2 className='text-base font-semibold text-white/65 sm:text-lg'>
                  Phone
                </h2>
                <a
                  href='tel:+918870676664'
                  className='mt-2 inline-block text-sm text-[#00aeef] transition hover:text-white sm:mt-3 sm:text-base lg:text-lg'
                >
                  +91 8870676664
                </a>
              </div>
            </div>

            <ContactForm />
          </section>

          <div className='min-h-[420px] overflow-hidden rounded-xl border border-white/10 sm:min-h-[560px] lg:min-h-[900px]'>
            <iframe
              title='Map to PSG College of Technology, Coimbatore'
              src='https://maps.google.com/maps?q=PSG%20College%20of%20Technology%2C%20Peelamedu%2C%20Coimbatore&t=&z=16&ie=UTF8&iwloc=&output=embed'
              className='h-full min-h-[420px] w-full sm:min-h-[560px] lg:min-h-[900px]'
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
            />
          </div>
        </div>
      </main>
    </div>
  )
}
