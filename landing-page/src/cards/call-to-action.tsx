export default function Cta() {
  const handleBookDemo = () => {
    document.getElementById('book-demo')?.scrollIntoView({ behavior: 'smooth' })
  }
  
  return (
    <section
      id="cta"
      className="w-full bg-[linear-gradient(90deg,#00BCFF_0%,#00A6F4_25%,#0084D1_50%,#00598A_75%,#052F4A_100%)] px-5 py-20 text-center text-white sm:px-8 lg:px-12"
    >
      <div className="mx-auto flex w-full max-w-[900px] flex-col items-center gap-8">
        <p className="text-base font-normal uppercase tracking-[0.02em] text-white/90">
          Ready to explore ?
        </p>

        <h2 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[76px]">
          See Yatzar Manage
          <br />
          On Your Own Project.
        </h2>

        <p className="max-w-[740px] text-lg leading-relaxed text-white/95 sm:text-xl">
          Book a demo. We will look at your current workflow and show where project
          information can become a connected asset record.
        </p>

        <button
        type="button"
        onClick={handleBookDemo}
        className="group inline-flex cursor-pointer items-center justify-center gap-0 rounded-[4px] bg-[#fafafa] px-8 py-[18px] text-xl font-normal text-[#00a6f4] shadow-[0_0_0_rgba(0,0,0,0)] transition-all duration-300 ease-out hover:gap-3 hover:bg-white hover:text-[#00a6f4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.97] active:shadow-none motion-safe:hover:-translate-y-0.5"
      >
        <span>Book a Demo</span>
        <svg
          viewBox="0 0 24 24"
          className="h-0 w-0 -translate-x-2 opacity-0 transition-all duration-300 ease-out group-hover:h-5 group-hover:w-5 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:h-5 group-focus-visible:w-5 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      </button>
      </div>
    </section>
  )
}
