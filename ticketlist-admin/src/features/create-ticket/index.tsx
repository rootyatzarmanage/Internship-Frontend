import { useRef, useState, type FormEvent } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, ChevronRight, Plus, Upload, X } from 'lucide-react'

const categories = [
  'Sales',
  'Billing',
  'Support',
  'Trust and Safety',
  'Cancellations',
  'Migrations',
]

const inputClassName = 'w-full rounded-lg border border-[#d0d5dd] bg-white px-3 py-2.5 text-sm text-[#101828] outline-none transition-colors placeholder:text-[#98a2b3] focus:border-[#00a6d4] focus:ring-2 focus:ring-[#00a6d4]/15'

export default function CreateTicket() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [category, setCategory] = useState('Support')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [product, setProduct] = useState('')
  const [showProduct, setShowProduct] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const clearForm = () => {
    setCategory('Support')
    setSubject('')
    setMessage('')
    setProduct('')
    setShowProduct(false)
    setFile(null)
    setSubmitted(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="min-h-full bg-[#f8fafc] px-5 py-7 text-[#101828] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1120px]">
        <div className="mb-6 flex items-center justify-end gap-2 text-sm text-[#667085]">
          <Link to="/ticketlist" className="transition-colors hover:text-[#00a6d4]">Support Tickets</Link>
          <ChevronRight size={15} aria-hidden="true" />
          <span className="text-[#101828]">Create ticket</span>
        </div>

        <section className="rounded-xl border border-[#e1e6ee] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-8">
          <div className="mb-7">
            <h1 className="text-xl font-semibold sm:text-2xl">Submit a support ticket</h1>
            <p className="mt-1 text-sm text-[#667085]">Choose the area that best matches your issue so we can route your ticket to the right team.</p>
          </div>

          <form onSubmit={handleSubmit} onReset={clearForm} className="space-y-6">
            <fieldset>
              <legend className="mb-3 text-sm font-medium text-[#344054]">What problem are you having? <span className="text-[#f04438]">*</span></legend>
              <div className="flex flex-wrap gap-2.5">
                {categories.map((item) => (
                  <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6d4] hover:cursor-pointer ${category === item ? 'border-[#00a6d4] bg-[#00a6d4] text-white' : 'border-[#d0d5dd] bg-white text-[#344054] hover:border-[#00a6d4] hover:bg-[#e6f7fc]'}`}>
                    {item}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="ticket-subject" className="mb-2 block text-sm font-medium text-[#344054]">Subject <span className="text-[#f04438]">*</span></label>
              <input id="ticket-subject" required value={subject} onChange={(event) => setSubject(event.target.value)} className={inputClassName} />
            </div>

            <div>
              <label htmlFor="ticket-message" className="mb-2 block text-sm font-medium text-[#344054]">Message <span className="text-[#f04438]">*</span></label>
              <textarea id="ticket-message" required value={message} onChange={(event) => setMessage(event.target.value)} rows={8} className={`${inputClassName} resize-y`} />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-[#344054]">Related product <span className="font-normal text-[#667085]">(optional but recommended)</span></p>
              {showProduct ? (
                <div className="flex max-w-xl items-center gap-2">
                  <input aria-label="Related product" value={product} onChange={(event) => setProduct(event.target.value)} placeholder="Enter product name" className={inputClassName} />
                  <button type="button" aria-label="Remove related product" onClick={() => { setShowProduct(false); setProduct('') }} className="rounded-lg p-2 text-[#667085] transition-colors hover:bg-[#f2f4f7] hover:text-[#101828]"><X size={18} /></button>
                </div>
              ) : (
                <button type="button" onClick={() => setShowProduct(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#e6f7fc] px-3 py-2 text-sm font-medium text-[#007fa3] transition-colors hover:bg-[#d1f0f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6d4] hover:cursor-pointer"><Plus size={16} />Add product</button>
              )}
            </div>

            <div>
              <label htmlFor="ticket-attachment" className="mb-2 block text-sm font-medium text-[#344054]">Attach file</label>
              <input ref={fileInputRef} id="ticket-attachment" type="file" accept=".pdf,.jpg,.jpeg,.png,.docx" className="sr-only" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
              <button type="button" onClick={() => fileInputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const droppedFile = event.dataTransfer.files[0]; if (droppedFile) setFile(droppedFile) }} className="flex min-h-32 w-full flex-col items-center justify-center rounded-lg border border-dashed border-[#d0d5dd] bg-[#fcfcfd] px-4 py-6 text-center transition-colors hover:border-[#00a6d4] hover:bg-[#f5fcfe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6d4]">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f4f7] text-[#667085]"><Upload size={18} /></span>
                {file ? <span className="text-sm font-medium text-[#344054]">{file.name}</span> : <><span className="text-sm text-[#475467">Drag and drop, or <span className="font-medium text-[#007fa3] underline">Browse files</span></span><span className="mt-1 text-xs text-[#667085]">Supported formats: PDF, JPG, PNG, DOCX</span></>}
              </button>
            </div>

            {submitted && <div role="status" className="rounded-lg border border-[#abefc6] bg-[#ecfdf3] px-4 py-3 text-sm text-[#067647]">Your ticket details are ready to submit.</div>}

            <div className="flex flex-col-reverse gap-3 border-t border-[#e1e6ee] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button type="reset" className="self-start text-sm font-medium text-[#475467] underline underline-offset-2 transition-colors hover:text-[#101828] hover:cursor-pointer">Clear</button>
              <button type="submit" className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-[#00a6d4] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#008bb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cd2] focus-visible:ring-offset-2 sm:self-auto hover:cursor-pointer">Submit ticket <ArrowRight size={16} /></button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}
