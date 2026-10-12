import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";

const INPUT =
  "w-full rounded-lg border border-white/30 bg-transparent px-3 py-2.5 text-[13px] text-white outline-none transition placeholder:text-white/35 focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/60";
const LABEL = "mb-2 block text-[12px] text-white/90";

const roles = [
  "Architect",
  "BIM Manager/Coordinator",
  "Engineer",
  "Project Manager",
  "Contractor",
  "Developer/Asset Owner",
  "Student/Trainee",
  "Other",
];

const availableTimes = ["9:00 AM", "10:30 AM", "12:00 PM", "2:00 PM", "3:30 PM", "5:00 PM"];
const popularTimes = new Set(["10:30 AM", "2:00 PM", "3:30 PM"]);
const bookedDays = new Set([5, 21]);
const almostBookedDays = new Set([7, 21, 31]);
const monthNames = Array.from({ length: 12 }, (_, index) =>
  new Date(2000, index, 1).toLocaleDateString("en-US", { month: "long" })
);

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  role: "",
  consent: false,
};

type Status = "idle" | "submitted";

function getCalendarDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0
  ).getDate();

  return [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
}

type Availability = "booked" | "almost-booked" | "free";

function getAvailability(day: number | null): Availability {
  if (!day) return "free";
  if (bookedDays.has(day)) return "booked";
  if (almostBookedDays.has(day)) return "almost-booked";
  return "free";
}

export default function BookDemo() {
  const today = new Date();
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(
    getAvailability(today.getDate()) === "booked" ? null : today.getDate()
  );
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<Status>("idle");
  const years = Array.from({ length: 6 }, (_, index) => today.getFullYear() + index);

  const calendarDays = useMemo(() => getCalendarDays(month), [month]);
  const monthLabel = month.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const update =
    (field: keyof typeof initialForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const target = event.target;
      const value =
        target instanceof HTMLInputElement && target.type === "checkbox"
          ? target.checked
          : target.value;
      setForm((current) => ({ ...current, [field]: value }));
    };

  const moveMonth = (offset: number) => {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
    setSelectedDay(null);
    setSelectedTime("");
  };

  const chooseMonth = (event: ChangeEvent<HTMLSelectElement>) => {
    setMonth((current) => new Date(current.getFullYear(), Number(event.target.value), 1));
    setSelectedDay(null);
    setSelectedTime("");
  };

  const chooseYear = (event: ChangeEvent<HTMLSelectElement>) => {
    setMonth((current) => new Date(Number(event.target.value), current.getMonth(), 1));
    setSelectedDay(null);
    setSelectedTime("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitted");
    setForm(initialForm);
    setSelectedDay(null);
    setSelectedTime("");
  };

  return (
    <section className="relative overflow-hidden bg-[#171717] px-5 py-10 text-white sm:px-8 sm:py-14 lg:px-12 xl:px-20 xl:py-20">
      <div className="mx-auto w-full max-w-[1900px]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 xl:gap-[7vw]">
          <div>
            <h1 className="mt-3 text-[clamp(40px,9vw,60px)] font-semibold leading-[0.92] tracking-[-0.045em] xl:text-[clamp(52px,4.6vw,84px)]">
              Book Your
              <br />
              <span className="text-[#0EA5E9]">Demo.</span>
            </h1>
            <p className="mt-5 max-w-[26rem] text-[13px] leading-5 text-white/85 sm:text-[14px] sm:leading-6">
              Choose a date and time that works for you. We&apos;ll show you how
              Yatzar Manage can simplify your project workflows.
            </p>

            <div className="mt-10 border-t border-white/15 pt-5 sm:mt-14">
              <p className="text-[12px] uppercase tracking-[0.16em] text-white/60">
                Your demo includes
              </p>
              <ul className="mt-4 space-y-3 text-[13px] text-white/80">
                <li>01 &nbsp; A walkthrough of the Yatzar Manage platform</li>
                <li>02 &nbsp; Recommendations for your team&apos;s workflow</li>
                <li>03 &nbsp; Time for your questions and next steps</li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-[17px] font-medium">Select a date</h2>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month" className="rounded border border-white/20 px-2 py-1 text-white/70 transition hover:border-[#0EA5E9] hover:text-white">←</button>
                    <button type="button" onClick={() => moveMonth(1)} aria-label="Next month" className="rounded border border-white/20 px-2 py-1 text-white/70 transition hover:border-[#0EA5E9] hover:text-white">→</button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <label className="sr-only" htmlFor="demo-month">
                    Select month
                  </label>
                  <select
                    id="demo-month"
                    value={month.getMonth()}
                    onChange={chooseMonth}
                    className="rounded-md border border-white/20 bg-[#171717] px-2.5 py-2 text-[12px] text-white outline-none transition focus:border-[#0EA5E9]"
                  >
                    {monthNames.map((name, index) => (
                      <option key={name} value={index} className="bg-[#171717]">
                        {name}
                      </option>
                    ))}
                  </select>
                  <label className="sr-only" htmlFor="demo-year">
                    Select year
                  </label>
                  <select
                    id="demo-year"
                    value={month.getFullYear()}
                    onChange={chooseYear}
                    className="rounded-md border border-white/20 bg-[#171717] px-2.5 py-2 text-[12px] text-white outline-none transition focus:border-[#0EA5E9]"
                  >
                    {years.map((year) => (
                      <option key={year} value={year} className="bg-[#171717]">
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-2 text-[12px] text-white/45">{monthLabel}</p>
                <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] text-white/45">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <span key={day} className="py-2">{day}</span>)}
                  {calendarDays.map((day, index) => (
                    <button
                      key={`${day}-${index}`}
                      type="button"
                      disabled={!day || getAvailability(day) === "booked"}
                      onClick={() => {
                        setSelectedDay((current) => (current === day ? null : day));
                        setSelectedTime("");
                      }}
                      aria-label={
                          day
                            ? `${day} ${getAvailability(day).replace("-", " ")}`
                            : undefined
                      }
                      className={`relative aspect-square rounded-md text-[12px] transition ${
                          !day
                            ? "cursor-default"
                          : selectedDay === day &&
                            getAvailability(day) === "almost-booked"
                            ? "bg-amber-300 text-[#171717]"
                          : selectedDay === day
                            ? "bg-[#0284C7] text-white"
                            : getAvailability(day) === "booked"
                              ? "cursor-not-allowed bg-white/[0.03] text-white/25 line-through"
                            : getAvailability(day) === "almost-booked"
                              ? "border border-amber-300/80 text-amber-200 hover:bg-amber-300/10"
                            : "text-white/80 hover:bg-white/10"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-white/60">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#0284C7]" />
                    Free
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                    Almost booked
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
                    Booked
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-[17px] font-medium">Available time</h2>
                <p className="mt-4 text-[13px] text-white/55">
                  {selectedDay ? "Choose a time for your demo" : "Select a date first"}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      disabled={!selectedDay}
                      onClick={() => setSelectedTime(time)}
                      className={`relative rounded-md border px-3 py-2.5 text-[12px] transition ${
                        selectedTime === time
                          ? "border-[#0284C7] bg-[#0284C7] text-white"
                          : "border-white/20 text-white/75 hover:border-[#0EA5E9] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                      }`}
                    >
                      {time}
                      {popularTimes.has(time) && (
                        <span
                          className="absolute -right-1.5 -top-2 flex h-4 min-w-4 items-center justify-center px-0.5 text-[13px] leading-none text-amber-300"
                          title="Popular time"
                          aria-label="Popular time"
                        >
                          ★
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-[11px] text-white/45">
                  All times shown in your local timezone.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 border-t border-white/10 pt-8">
              <h2 className="text-[17px] font-medium">Additional details</h2>
              <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="demo-first-name" className={LABEL}>First name</label>
                  <input id="demo-first-name" required value={form.firstName} onChange={update("firstName")} className={INPUT} placeholder="First name" />
                </div>
                <div>
                  <label htmlFor="demo-last-name" className={LABEL}>Last name</label>
                  <input id="demo-last-name" required value={form.lastName} onChange={update("lastName")} className={INPUT} placeholder="Last name" />
                </div>
                <div>
                  <label htmlFor="demo-email" className={LABEL}>Work email</label>
                  <input id="demo-email" type="email" required value={form.email} onChange={update("email")} className={INPUT} placeholder="you@company.com" />
                </div>
                <div>
                  <label htmlFor="demo-phone" className={LABEL}>Phone number</label>
                  <input id="demo-phone" type="tel" required pattern="^\+?[0-9\s().\-]{7,}$" value={form.phone} onChange={update("phone")} className={INPUT} placeholder="+1 555 123 4567" />
                </div>
                <div>
                  <label htmlFor="demo-company" className={LABEL}>Company / organization</label>
                  <input id="demo-company" required value={form.company} onChange={update("company")} className={INPUT} placeholder="Your company" />
                </div>
                <div>
                  <label htmlFor="demo-role" className={LABEL}>Job role</label>
                  <select id="demo-role" required value={form.role} onChange={update("role")} className={`${INPUT} appearance-none`}>
                    <option value="" disabled>Select your role</option>
                    {roles.map((role) => <option key={role} value={role} className="bg-[#171717]">{role}</option>)}
                  </select>
                </div>
              </div>

              <label className="mt-5 flex cursor-pointer items-start gap-3 text-[12px] leading-5 text-white/75 sm:text-[13px]">
                <input type="checkbox" required checked={form.consent} onChange={update("consent")} className="mt-1 h-4 w-4 accent-[#0284C7]" />
                <span>I agree to be contacted about my demo request.</span>
              </label>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <button type="submit" disabled={!selectedDay || !selectedTime} className="flex cursor-pointer items-center gap-2 rounded-md bg-[#0284C7] px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-[#0369A1] disabled:cursor-not-allowed disabled:opacity-40 sm:text-[14px]">
                  Book My Demo <span aria-hidden="true">→</span>
                </button>
                {status === "submitted" && <p role="status" className="text-[12px] text-emerald-400 sm:text-[13px]">Thanks! We&apos;ll be in touch soon.</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
