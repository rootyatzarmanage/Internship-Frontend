import { useState, type FormEvent } from 'react'
import Footer from '../components/footer/footer'
import DropdownSelect from '../components/dropdown/dropdown-select'

const timeSlots = [
  { label: '10:00 AM', value: '10:00', status: 'available' },
  { label: '11:00 AM', value: '11:00', status: 'available' },
  { label: '12:00 PM', value: '12:00', status: 'available' },
  { label: '1:00 PM', value: '13:00', status: 'busy' },
  { label: '2:00 PM', value: '14:00', status: 'busy' },
  { label: '3:00 PM', value: '15:00', status: 'available' },
  { label: '4:00 PM', value: '16:00', status: 'available' },
  { label: '5:00 PM', value: '17:00', status: 'available' },
] as const

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function BookingCalendar({
  selectedDateTime,
  onSelect,
}: {
  selectedDateTime: string
  onSelect: (dateTime: string) => void
}) {
  const initialMonth = () => {
    const month = new Date()
    month.setDate(1)
    month.setMonth(month.getMonth() + 1)
    return month
  }
  const [visibleMonth, setVisibleMonth] = useState(initialMonth)
  const year = visibleMonth.getFullYear()
  const month = visibleMonth.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstWeekday = new Date(year, month, 1).getDay()
  const monthLabel = visibleMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const selectedDay = selectedDateTime.split('T')[0]
  const selectedTime = selectedDateTime.split('T')[1]
  const todayKey = dateKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())

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
          const isSelected = key === selectedDay
          return (
            <button
              key={key}
              type="button"
              disabled={isPast}
              aria-label={`${monthLabel} ${day}`}
              aria-pressed={isSelected}
              onClick={() => onSelect(key)}
              className={`mx-auto my-[clamp(0.125rem,0.3vw,0.375rem)] flex h-[clamp(1.75rem,2.1vw,2.5rem)] w-[clamp(1.75rem,2.1vw,2.5rem)] items-center justify-center rounded-full transition ${isSelected ? 'bg-[#00aeef] font-semibold text-black' : isPast ? 'cursor-not-allowed text-white/25' : 'text-white hover:bg-white/10'}`}
            >
              {day}
            </button>
          )
        })}
      </div>

      <div className="mt-[clamp(0.5rem,0.84vw,1rem)] flex flex-wrap items-center gap-x-[clamp(0.75rem,1.5vw,1.75rem)] gap-y-2 border-b border-white/25 pb-[clamp(0.625rem,0.84vw,1rem)] text-[clamp(0.625rem,0.73vw,0.875rem)] text-white/85">
        <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-sm border border-[#00aeef]" />Available</span>
        <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-sm border border-white/35" />Busy</span>
        <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-sm border border-white/15 bg-white/10" />Unavailable</span>
      </div>

      <div className="pt-[clamp(0.625rem,0.84vw,1rem)]">
        <h3 className="text-[clamp(1rem,1.25vw,1.5rem)] font-semibold">Available Timing</h3>
        <p className="mt-[clamp(0.25rem,0.42vw,0.5rem)] text-[clamp(0.75rem,0.84vw,1rem)] leading-[1.5] text-white/75">Times shown in Asia/Kolkata (GMT+5:30). We’re available 10 AM – 6 PM IST.</p>
        {!selectedDay && <p className="mt-2 text-xs text-white/50">Select a date to see available times.</p>}
        <div className="mt-[clamp(0.5rem,0.84vw,1rem)] grid grid-cols-2 gap-[clamp(0.375rem,0.63vw,0.75rem)] sm:grid-cols-4">
          {timeSlots.map((slot) => {
            const isSelected = selectedDay && selectedTime === slot.value
            const disabled = slot.status === 'busy' || !selectedDay
            return (
              <button
                key={slot.value}
                type="button"
                disabled={disabled}
                onClick={() => selectedDay && onSelect(`${selectedDay}T${slot.value}`)}
                className={`h-[clamp(1.625rem,2.3vw,2.75rem)] rounded-lg border px-2 text-[clamp(0.75rem,0.84vw,1rem)] transition ${isSelected ? 'border-[#00aeef] bg-[#00aeef] text-black' : slot.status === 'busy' ? 'cursor-not-allowed border-[#525252] text-white/35 line-through' : !selectedDay ? 'cursor-not-allowed border-white/15 text-white/45' : 'border-[#00aeef] text-white hover:bg-[#00aeef]/15'}`}
              >
                {slot.label}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function DemoRequestForm({ selectedDateTime }: { selectedDateTime: string }) {
  function submitDemoRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const fullName = data.get('fullName')
    const email = data.get('email')
    const countryCode = data.get('countryCode')
    const phone = data.get('phone')
    const company = data.get('company')
    const country = data.get('country')
    const notes = data.get('notes') || 'None provided'
    const preferredDate = selectedDateTime
      ? new Date(selectedDateTime).toLocaleString(undefined, selectedDateTime.includes('T') ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' })
      : 'Not selected'
    const message = [
      `Full name: ${fullName}`,
      `Work email: ${email}`,
      `Phone: ${phone ? `${countryCode} ${phone}` : 'Not provided'}`,
      `Company: ${company}`,
      `Country: ${country}`,
      `Preferred date and time: ${preferredDate}`,
      `Add to Google Calendar: ${data.get('addToCalendar') ? 'Yes' : 'No'}`,
      '',
      `Additional information: ${notes}`,
    ].join('\n')

    if (data.get('addToCalendar') && selectedDateTime.includes('T')) {
      const start = new Date(selectedDateTime)
      const end = new Date(start.getTime() + 30 * 60 * 1000)
      const calendarDate = (date: Date) => date.toISOString().replaceAll('-', '').replaceAll(':', '').replace(/\.\d{3}Z$/, 'Z')
      const calendarUrl = new URL('https://calendar.google.com/calendar/render')
      calendarUrl.searchParams.set('action', 'TEMPLATE')
      calendarUrl.searchParams.set('text', 'Yatzar Manage Demo')
      calendarUrl.searchParams.set('details', 'Yatzar Manage product demo')
      calendarUrl.searchParams.set('dates', `${calendarDate(start)}/${calendarDate(end)}`)
      window.open(calendarUrl.toString(), '_blank', 'noopener,noreferrer')
    }

    window.location.href = `mailto:reachus@yatzarmanage.com?subject=${encodeURIComponent('Yatzar Manage demo request')}&body=${encodeURIComponent(message)}`
  }

  const labelClass = 'block min-w-0 text-sm leading-[1.4] sm:text-base xl:text-lg'
  const inputClass = 'mt-2 h-[60px] w-full min-w-0 rounded-xl border border-[#525252] bg-black px-6 py-3 text-[clamp(0.875rem,0.94vw,1.125rem)] text-white outline-none placeholder:text-white/35 focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef]'
  const dropdownClass = 'h-[60px] w-full min-w-0 rounded-xl border border-[#525252] bg-black px-6 py-3 text-[clamp(0.875rem,0.94vw,1.125rem)] text-white outline-none focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef]'
  const dateLabel = selectedDateTime
    ? new Date(selectedDateTime).toLocaleString(undefined, selectedDateTime.includes('T') ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' })
    : 'Pick a date and time on the calendar.'

  return (
    <form onSubmit={submitDemoRequest} className="grid grid-cols-1 gap-x-2 gap-y-3 sm:grid-cols-2 sm:gap-x-3 sm:gap-y-3">
      <label className={`${labelClass} sm:col-span-2`}>
        Full Name <span className="text-white">*</span>
        <input className={inputClass} name="fullName" autoComplete="name" placeholder="Full Name" required />
      </label>

      <label className={labelClass}>
        Work Email <span className="text-white">*</span>
        <input className={inputClass} type="email" name="email" autoComplete="email" placeholder="you@company.com" required />
      </label>

      <label className={labelClass}>
        Phone Number
        <div className="mt-2 flex min-w-0 gap-[10px]">
          <DropdownSelect name="countryCode" aria-label="Country calling code" defaultValue="+91" containerClassName="h-[60px] w-[119px] shrink-0" className="h-full w-full rounded-xl border border-[#525252] bg-black px-4 py-3 text-[clamp(0.875rem,0.94vw,1.125rem)] text-white outline-none focus:border-[#00aeef]" iconClassName="right-3 h-4 w-4" selectPaddingClassName="pr-8">
            <option value="+91">+91</option>
            <option value="+1">+1</option>
            <option value="+44">+44</option>
            <option value="+61">+61</option>
          </DropdownSelect>
          <input className="h-[60px] min-w-0 flex-1 rounded-xl border border-[#525252] bg-black px-6 py-3 text-[clamp(0.875rem,0.94vw,1.125rem)] text-white outline-none placeholder:text-white/35 focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef]" type="tel" name="phone" autoComplete="tel-national" placeholder="00000 00000" />
        </div>
      </label>

      <label className={labelClass}>
        Company <span className="text-white">*</span>
        <input className={inputClass} name="company" autoComplete="organization" placeholder="Company Name" required />
      </label>

      <label className={labelClass}>
        Country
        <DropdownSelect containerClassName="mt-2 w-full" className={dropdownClass} name="country" defaultValue="India" autoComplete="country-name">
          <option>India</option>
          <option>United States</option>
          <option>United Kingdom</option>
          <option>Australia</option>
          <option>Other</option>
        </DropdownSelect>
      </label>

      <label className={`${labelClass} sm:col-span-2`}>
        Anything We Should Know? <span>(Optional)</span>
        <textarea className="mt-2 min-h-[96px] w-full resize-y rounded-xl border border-[#525252] bg-black px-6 py-3 text-[clamp(0.875rem,0.94vw,1.125rem)] text-white outline-none placeholder:text-white/35 focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef]" name="notes" placeholder="Team size, current tools, goals,..." />
      </label>

      <div className="sm:col-span-2 rounded-lg border border-dashed border-white/35 px-3 py-[clamp(0.5rem,0.75vw,0.875rem)] text-[clamp(0.75rem,0.94vw,1.125rem)] text-white/55">
        {dateLabel}
      </div>

      <div className="sm:col-span-2">
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
                Add this meeting directly to my Google Calendar
            </span>
            <span className="text-xs leading-5 text-white/60 sm:text-sm lg:text-base">
                The date and time you picked will be added to your calendar, so you won’t miss it.
            </span>
            </span>
        </label>
        </div>

      <div className="sm:col-span-2 mt-[10px]">
        <button type="submit" className="inline-flex items-center justify-center rounded-sm bg-[#00A6F4] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#078fc1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00aeef] hover:cursor-pointer sm:px-8 sm:py-4 sm:text-base">
          Submit
        </button>
      </div>
    </form>
  )
}

export default function Demo() {
  const [selectedDateTime, setSelectedDateTime] = useState('')

  return (
    <>
    <div className="min-h-screen bg-black text-white">
      <main className="px-5 py-10 sm:px-8 sm:py-14 min-[900px]:px-[clamp(5rem,8.333vw,10rem)] min-[900px]:py-[clamp(2.5rem,3.333vw,4rem)]">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-10 min-[1000px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] min-[1000px]:items-start min-[1000px]:gap-[clamp(4.375rem,7.7vw,9.25rem)]">
          <section className="min-w-0">
            <p className="text-sm uppercase tracking-wide text-[#00aeef] sm:text-base">Contact Us</p>
            <h1 className="mt-4 text-[clamp(2rem,4vw,4.75rem)] font-bold leading-tight tracking-tight">Book A Demo</h1>
            <p className="mt-3 max-w-[577px] text-[clamp(0.875rem,1.04vw,1.25rem)] leading-[1.6]">
              See how Yatzar Manage brings your BIM projects, models and teams into one workspace. Tell us a little about you, pick a time that suits you, and we’ll walk you through the platform.
            </p>
            <div className="mt-[clamp(1rem,2.5vw,3rem)]">
              <DemoRequestForm selectedDateTime={selectedDateTime} />
            </div>
          </section>

          <div className="min-w-0 min-[1000px]:mt-[clamp(7rem,11.2vw,13.75rem)]">
            <BookingCalendar selectedDateTime={selectedDateTime} onSelect={setSelectedDateTime} />
          </div>
        </div>
      </main>
      <Footer backgroundClass="bg-[#171717]"/>
    </div>
    </>
  )
}
