import { useEffect, useState, type FormEvent } from 'react';
import apiClient from '@/lib/axios';
import DropdownSelect from '../components/dropdown/dropdown-select';
import { RecaptchaV2 } from '../components/recaptcha-v2';

const recaptchaSiteKey: string | undefined = import.meta.env.VITE_RECAPTCHA_SITE_KEY






type DayStatus = 'available' | 'busy' | 'unavailable'
type CalendarDay = { date: string; status: DayStatus; open_slots: number; total_slots: number }
type DemoSlot = { starts_at: string; time: string; booked: number; available: boolean }
type SelectedSlot = { startsAt: string; label: string } | null

const visitorTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'


function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function BookingCalendar({
                           selectedDate,
                           onSelectDate,
                           selectedSlot,
                           onSelectSlot,
                         }: {
  selectedDate: string
  onSelectDate: (date: string) => void
  selectedSlot: SelectedSlot
  onSelectSlot: (slot: SelectedSlot) => void
}) {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [days, setDays] = useState<Record<string, CalendarDay>>({})
  const [slots, setSlots] = useState<DemoSlot[]>([])
  const [loadingCalendar, setLoadingCalendar] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [calendarError, setCalendarError] = useState('')
  const [slotsError, setSlotsError] = useState('')
  const year = visibleMonth.getFullYear()
  const month = visibleMonth.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstWeekday = new Date(year, month, 1).getDay()
  const monthLabel = visibleMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const selectedDay = selectedDate
  const selectedTime = selectedSlot?.startsAt
  const todayKey = dateKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
  const timezone = visitorTimezone()

  useEffect(() => {
    let active = true
    setLoadingCalendar(true)
    setCalendarError('')
    apiClient.get('/book-a-demo/calendar', { params: { year, month: month + 1, timezone } })
      .then(({ data }) => {
        if (!active) return
        const result = data?.data
        const nextDays: Record<string, CalendarDay> = {}
        for (const day of result?.days ?? []) nextDays[String(day.date)] = day
        setDays(nextDays)
      })
      .catch(() => { if (active) setCalendarError('Unable to load available dates. Please refresh and try again.') })
      .finally(() => { if (active) setLoadingCalendar(false) })
    return () => { active = false }
  }, [year, month, timezone])

  useEffect(() => {
    if (!selectedDay) { setSlots([]); return }
    let active = true
    setLoadingSlots(true)
    setSlotsError('')
    setSlots([])
    apiClient.get('/book-a-demo/slots', { params: { date: selectedDay, timezone } })
      .then(({ data }) => {
        if (!active) return
        setSlots((data?.data?.slots ?? []).filter((slot: DemoSlot) => slot.available && !slot.booked))
      })
      .catch(() => { if (active) setSlotsError('Unable to load times for this date. Please choose another date or try again.') })
      .finally(() => { if (active) setLoadingSlots(false) })
    return () => { active = false }
  }, [selectedDay, timezone])

  function moveMonth(offset: number) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1))
  }

  return (
    <section aria-label="Choose a demo date and time" className="rounded-xl border border-white/30 p-[clamp(0.75rem,1.25vw,1.5rem)]">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month" className="rounded p-2 text-xl leading-none text-white/80 transition hover:bg-white/10 hover:text-white sm:text-2xl">‹</button>
        <h2 className="text-[clamp(0.75rem,1.05vw,1.25rem)] font-semibold">{monthLabel}</h2>
        <button type="button" onClick={() => moveMonth(1)} aria-label="Next month" className="rounded p-2 text-xl leading-none text-white/80 transition hover:bg-white/10 hover:text-white sm:text-2xl">›</button>
      </div>

      <div className="mt-[clamp(0.5rem,1vw,1.25rem)] grid grid-cols-7 text-center text-[clamp(0.75rem,0.84vw,1rem)] font-medium text-white/90">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <div key={day} className="py-[clamp(0.25rem,0.42vw,0.5rem)]">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 text-center text-[clamp(0.75rem,0.84vw,1rem)]">
        {Array.from({ length: firstWeekday }, (_, index) => <div key={`empty-${index}`} aria-hidden="true" />)}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1
          const key = dateKey(year, month, day)
          const isPast = key < todayKey
          const dayInfo = days[key]
          const dayStatus = dayInfo?.status ?? 'unavailable'
          const isSelected = key === selectedDay
          const disabled = isPast || !dayInfo || dayStatus !== 'available' || dayInfo.open_slots < 1
          return (
            <button
              key={key}
              type="button"
              disabled={disabled || loadingCalendar}
              aria-label={`${monthLabel} ${day}`}
              aria-pressed={isSelected}
              onClick={() => onSelectDate(key)}
              className={`mx-auto my-[clamp(0.125rem,0.3vw,0.375rem)] flex h-[clamp(1.75rem,2.1vw,2.5rem)] w-[clamp(1.75rem,2.1vw,2.5rem)] items-center justify-center rounded-full transition ${isSelected ? 'bg-[#00aeef] font-semibold text-black' : disabled ? 'cursor-not-allowed text-white/25' : 'text-white hover:bg-white/10'}`}
            >
              {day}
            </button>
          )
        })}
      </div>
      {calendarError && <p role="alert" className="mt-2 text-xs text-red-300">{calendarError}</p>}
      {loadingCalendar && <p className="mt-2 text-xs text-white/60">Checking available dates…</p>}

      <div className="mt-[clamp(0.5rem,0.84vw,1rem)] flex flex-wrap items-center gap-x-[clamp(0.75rem,1.5vw,1.75rem)] gap-y-2 border-b border-white/25 pb-[clamp(0.625rem,0.84vw,1rem)] text-[clamp(0.625rem,0.73vw,0.875rem)] text-white/85">
        <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-sm border border-[#00aeef]" />Available</span>
        <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-sm border border-white/35" />Busy</span>
        <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-sm border border-white/15 bg-white/10" />Unavailable</span>
      </div>

      <div className="pt-[clamp(0.625rem,0.84vw,1rem)]">
        <h3 className="text-[clamp(1rem,1.25vw,1.5rem)] font-semibold">Available Timing</h3>
        <p className="mt-[clamp(0.25rem,0.42vw,0.5rem)] text-[clamp(0.75rem,0.84vw,1rem)] leading-[1.5] text-white/75">Times are shown in {timezone}.</p>
        {!selectedDay && <p className="mt-2 text-xs text-white/50">Select a date to see available times.</p>}
        {loadingSlots && <p className="mt-2 text-xs text-white/60">Loading available times…</p>}
        {slotsError && <p role="alert" className="mt-2 text-xs text-red-300">{slotsError}</p>}
        <div className="mt-[clamp(0.5rem,0.84vw,1rem)] grid grid-cols-2 gap-[clamp(0.375rem,0.63vw,0.75rem)] sm:grid-cols-4">
          {slots.map((slot) => {
            const isSelected = selectedTime === slot.starts_at

            return (
              <button
                key={slot.starts_at}
                type="button"
                onClick={() => onSelectSlot({ startsAt: slot.starts_at, label: `${selectedDay} ${slot.time}` })}
                className={`h-[clamp(1.625rem,2.3vw,2.75rem)] rounded-lg border px-2 text-[clamp(0.75rem,0.84vw,1rem)] transition ${isSelected ? 'border-[#00aeef] bg-[#00aeef] text-black' : 'border-[#00aeef] text-white hover:bg-[#00aeef]/15'}`}

              >
                {slot.time}
              </button>
            )
          })}
        </div>
        {selectedDay && !loadingSlots && !slotsError && slots.length === 0 && <p className="mt-2 text-xs text-white/60">No times are available on this date.</p>}
      </div>
    </section>
  )
}

function DemoRequestForm({ selectedSlot }: { selectedSlot: SelectedSlot }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaVersion, setCaptchaVersion] = useState(0)























  async function submitDemoRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return
    if (!selectedSlot) { setStatus('error'); setFeedback('Choose an available date and time before submitting.'); return }
    if (recaptchaSiteKey && !captchaToken) {
      setStatus('error')
      setFeedback('Please complete the “I’m not a robot” check.')
      return
    }
    const formElement = event.currentTarget
    const data = new FormData(formElement)
    setStatus('sending')
    setFeedback('')
    try {
      await apiClient.post('/book-a-demo', {
        full_name: String(data.get('fullName') ?? '').trim(),
        email: String(data.get('email') ?? '').trim(),
        phone_code: String(data.get('countryCode') ?? '').trim(),
        phone: String(data.get('phone') ?? '').trim(),
        company: String(data.get('company') ?? '').trim(),
        country: String(data.get('country') ?? '').trim(),
        description: String(data.get('notes') ?? '').trim() || null,
        opt: data.get('addToCalendar') ? 1 : 0,
        starts_at: selectedSlot.startsAt,
        timezone: visitorTimezone(),
      })
      setStatus('sent')
      setFeedback('Your demo request has been received. Our team will follow up to confirm.')
      formElement.reset()
      if (recaptchaSiteKey) {
        setCaptchaToken(null)
        setCaptchaVersion((value) => value + 1)
      }
    } catch (error: any) {
      setStatus('error')
      const detail = error.response?.data?.detail
      const message = typeof detail === 'string'
        ? detail
        : Array.isArray(detail)
          ? detail.map((item) => item?.msg).filter(Boolean).join(' ')
          : ''
      setFeedback(message || 'We couldn’t book this demo. Please choose another time or try again.')
      if (recaptchaSiteKey) {
        setCaptchaToken(null)
        setCaptchaVersion((value) => value + 1)
      }
    }


  }

  const labelClass = 'block min-w-0 text-sm leading-[1.4] sm:text-base xl:text-lg'
  const inputClass = 'mt-2 h-[60px] w-full min-w-0 rounded-xl border border-[#525252] bg-black px-6 py-3 text-[clamp(0.875rem,0.94vw,1.125rem)] text-white outline-none placeholder:text-white/35 focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef]'
  const dropdownClass = 'h-[60px] w-full min-w-0 rounded-xl border border-[#525252] bg-black px-6 py-3 text-[clamp(0.875rem,0.94vw,1.125rem)] text-white outline-none focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef]'
  const dateLabel = selectedSlot?.label ?? 'Pick a date and time on the calendar.'



  return (
    <form
      onSubmit={submitDemoRequest}
      className='grid grid-cols-1 gap-x-2 gap-y-3 sm:grid-cols-2 sm:gap-x-3 sm:gap-y-3'
    >
      <label className={`${labelClass} sm:col-span-2`}>
        Full Name <span className='text-white'>*</span>
        <input
          className={inputClass}
          name='fullName'
          autoComplete='name'
          placeholder='Full Name'
          required
        />
      </label>

      <label className={labelClass}>
        Work Email <span className='text-white'>*</span>
        <input
          className={inputClass}
          type='email'
          name='email'
          autoComplete='email'
          placeholder='you@company.com'
          required
        />
      </label>

      <label className={labelClass}>
        Phone Number
        <div className='mt-2 flex min-w-0 gap-[10px]'>
          <DropdownSelect
            name='countryCode'
            aria-label='Country calling code'
            defaultValue='+91'
            containerClassName='h-[60px] w-[119px] shrink-0'
            className='h-full w-full rounded-xl border border-[#525252] bg-black px-4 py-3 text-[clamp(0.875rem,0.94vw,1.125rem)] text-white outline-none focus:border-[#00aeef]'
            iconClassName='right-3 h-4 w-4'
            selectPaddingClassName='pr-8'
          >
            <option value='+91'>+91</option>
            <option value='+1'>+1</option>
            <option value='+44'>+44</option>
            <option value='+61'>+61</option>
          </DropdownSelect>
          <input
            className='h-[60px] min-w-0 flex-1 rounded-xl border border-[#525252] bg-black px-6 py-3 text-[clamp(0.875rem,0.94vw,1.125rem)] text-white outline-none placeholder:text-white/35 focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef]'
            type='tel'
            name='phone'
            autoComplete='tel-national'
            placeholder='00000 00000'
            required
          />
        </div>
      </label>

      <label className={labelClass}>
        Company <span className='text-white'>*</span>
        <input
          className={inputClass}
          name='company'
          autoComplete='organization'
          placeholder='Company Name'
          required
        />
      </label>

      <label className={labelClass}>
        Country
        <DropdownSelect
          containerClassName='mt-2 w-full'
          className={dropdownClass}
          name='country'
          defaultValue='India'
          autoComplete='country-name'
          required
        >
          <option>India</option>
          <option>United States</option>
          <option>United Kingdom</option>
          <option>Australia</option>
          <option>Other</option>
        </DropdownSelect>
      </label>

      <label className={`${labelClass} sm:col-span-2`}>
        Anything We Should Know? <span>(Optional)</span>
        <textarea
          className='mt-2 min-h-[96px] w-full resize-y rounded-xl border border-[#525252] bg-black px-6 py-3 text-[clamp(0.875rem,0.94vw,1.125rem)] text-white outline-none placeholder:text-white/35 focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef]'
          name='notes'
          placeholder='Team size, current tools, goals,...'
        />
      </label>

      <div className='rounded-lg border border-dashed border-white/35 px-3 py-[clamp(0.5rem,0.75vw,0.875rem)] text-[clamp(0.75rem,0.94vw,1.125rem)] text-white/55 sm:col-span-2'>
        {dateLabel}
      </div>

      <div className='sm:col-span-2'>
        <label className='mt-[10px] flex cursor-pointer items-center gap-4 text-white/90'>
          {/* Checkbox */}
          <span className='relative flex h-6 w-6 shrink-0 items-center justify-center'>
            <input
              className='peer h-6 w-6 cursor-pointer appearance-none rounded-[6px] border border-[#00aeef] bg-transparent transition-colors checked:bg-[#00aeef] focus-visible:ring-2 focus-visible:ring-[#00aeef]/50 focus-visible:outline-none'
              type='checkbox'
              name='addToCalendar'
            />
            <svg
              viewBox='0 0 24 24'
              className='pointer-events-none absolute h-4 w-4 text-black opacity-0 peer-checked:opacity-100'
              fill='none'
              stroke='currentColor'
              strokeWidth='3.5'
              strokeLinecap='round'
              strokeLinejoin='round'
              aria-hidden='true'
            >
              <path d='M5 12.5l4.5 4.5L19 7' />
            </svg>
          </span>

          <span className='flex min-w-0 flex-col gap-1.5'>
            <span className='text-sm leading-5 sm:text-base sm:leading-6 lg:text-lg'>
              Add this meeting directly to my Google Calendar
            </span>
            <span className='text-xs leading-5 text-white/60 sm:text-sm lg:text-base'>
              The date and time you picked will be added to your calendar, so
              you won’t miss it.
            </span>
          </span>
        </label>
      </div>

      {recaptchaSiteKey && (
        <div className='sm:col-span-2 flex justify-start pt-1'>
          <RecaptchaV2
            key={captchaVersion}
            siteKey={recaptchaSiteKey}
            onChange={setCaptchaToken}
            theme='dark'
            className='flex justify-start'
          />
        </div>
      )}

      <div className='mt-[10px] sm:col-span-2'>
        {feedback && (
          <p
            role={status === 'error' ? 'alert' : 'status'}
            className={`mb-3 rounded-lg px-4 py-3 text-sm ${status === 'error' ? 'border border-red-400/40 bg-red-400/10 text-red-200' : 'border border-emerald-400/40 bg-emerald-400/10 text-emerald-200'}`}
          >
            {feedback}
          </p>
        )}
        <button
          type='submit'
          disabled={status === 'sending' || status === 'sent'}
          className='inline-flex items-center justify-center rounded-sm bg-[#00A6F4] px-6 py-3 text-sm font-medium text-white transition hover:cursor-pointer hover:bg-[#078fc1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00aeef] disabled:cursor-wait disabled:opacity-60 sm:px-8 sm:py-4 sm:text-base'
        >
          {status === 'sending'
            ? 'Booking…'
            : status === 'sent'
              ? 'Booked'
              : 'Submit'}
        </button>
      </div>
    </form>
  )
}

export default function Demo() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot>(null)



  return (
    <>
      <div className='min-h-screen bg-black text-white tpl-site'>
        <main className='px-5 py-10 min-[900px]:px-[clamp(5rem,8.333vw,10rem)] min-[900px]:py-[clamp(2.5rem,3.333vw,4rem)] sm:px-8 sm:py-14'>
          <div className='mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-10 min-[1000px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] min-[1000px]:items-start min-[1000px]:gap-[clamp(4.375rem,7.7vw,9.25rem)]'>
            <section className='min-w-0'>
              <p className='text-sm tracking-wide text-[#00aeef] uppercase sm:text-base'>
                Contact Us
              </p>
              <h1 className='mt-4 text-[clamp(2rem,4vw,4.75rem)] leading-tight font-bold tracking-tight'>
                Book A Demo
              </h1>
              <p className='mt-3 max-w-[577px] text-[clamp(0.875rem,1.04vw,1.25rem)] leading-[1.6]'>
                See how Yatzar Manage brings your BIM projects, models and teams
                into one workspace. Tell us a little about you, pick a time that
                suits you, and we’ll walk you through the platform.
              </p>
              <div className='mt-[clamp(1rem,2.5vw,3rem)]'>
                <DemoRequestForm selectedSlot={selectedSlot} />
              </div>
            </section>

            <div className='min-w-0 min-[1000px]:mt-[clamp(7rem,11.2vw,13.75rem)]'>
              <BookingCalendar
                selectedDate={selectedDate}
                onSelectDate={(date) => { setSelectedDate(date); setSelectedSlot(null) }}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}