import { useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Paperclip, Send, X } from 'lucide-react'
import { tickets } from '../ticketlist'

type ReplyStatus = 'In Progress' | 'Solved' | 'On Hold'

export default function TicketReply({ ticketId }: { ticketId: string }) {
  const ticketIndex = Math.max(0, tickets.findIndex((item) => item.id.slice(1) === ticketId))
  const ticket = tickets[ticketIndex]
  const previousTicket = tickets[ticketIndex - 1]
  const nextTicket = tickets[ticketIndex + 1]
  const attachmentRef = useRef<HTMLInputElement>(null)
  const [reply, setReply] = useState('')
  const [sentReply, setSentReply] = useState('')
  const [attachment, setAttachment] = useState<File | null>(null)
  const [status, setStatus] = useState<ReplyStatus>(ticket.status === 'Solved' ? 'Solved' : 'In Progress')

  const sendReply = () => {
    const message = reply.trim()
    if (!message) return
    setSentReply(message)
    setReply('')
    setAttachment(null)
    if (attachmentRef.current) attachmentRef.current.value = ''
  }

  return (
    <main className="min-h-full bg-[#f8fafc] px-5 py-7 text-[#101828] dark:bg-[#080808] dark:text-gray-100 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">Ticket Reply</h1>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#667085] dark:text-gray-400">
            <Link to="/ticketlist" className="text-[#667085] transition-colors hover:text-[#00a6d4] dark:text-gray-400">Home</Link>
            <ChevronRight size={15} className="text-[#667085]" />
            <span>Ticket Reply</span>
          </nav>
        </div>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="overflow-hidden rounded-xl border border-[#e1e6ee] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] dark:border-[#303030] dark:bg-[#151515]">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e1e6ee] px-5 py-4 dark:border-[#303030] sm:px-6">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold">Ticket {ticket.id} - {ticket.subject}</h2>
                <p className="mt-1 text-sm text-[#667085] dark:text-gray-400">Created {ticket.date}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2 text-sm text-[#667085] dark:text-gray-400">
                <span>{ticketIndex + 1} of {tickets.length}</span>
                {previousTicket ? <Link aria-label="Previous ticket" title="Previous ticket" to="/ticketlist/reply" search={{ ticketId: previousTicket.id.slice(1) }} className="rounded-lg border border-[#d0d5dd] p-2 transition-colors hover:bg-[#f2f4f7] dark:border-[#444] dark:hover:bg-[#252525]"><ChevronLeft size={18} /></Link> : <button aria-label="Previous ticket" disabled className="rounded-lg border border-[#e1e6ee] p-2 text-[#c0c5ce] dark:border-[#303030]"><ChevronLeft size={18} /></button>}
                {nextTicket ? <Link aria-label="Next ticket" title="Next ticket" to="/ticketlist/reply" search={{ ticketId: nextTicket.id.slice(1) }} className="rounded-lg border border-[#d0d5dd] p-2 transition-colors hover:bg-[#f2f4f7] dark:border-[#444] dark:hover:bg-[#252525]"><ChevronRight size={18} /></Link> : <button aria-label="Next ticket" disabled className="rounded-lg border border-[#e1e6ee] p-2 text-[#c0c5ce] dark:border-[#303030]"><ChevronRight size={18} /></button>}
              </div>
            </header>

            <div className="space-y-6 px-5 py-6 sm:px-6">
              <MessageCard name="John Doe" subtitle="johndoe@gmail.com" time={ticket.date} initials="JD">
                <p>Hello Support Team,</p>
                <p>I’m reaching out about “{ticket.subject}”. Could you please help me look into this issue? Let me know if you need any additional details from me.</p>
                <p>Thank you,<br />John</p>
              </MessageCard>

              <MessageCard name="Support Agent" subtitle="From - support team" time="Today" initials="SA" agent>
                <p>Hi John,</p>
                <p>Thanks for reaching out. We’ve received your ticket and are reviewing the details. We’ll follow up as soon as we have an update.</p>
                <p>Best,<br />Support Team</p>
              </MessageCard>

              {sentReply && <MessageCard name="Support Agent" subtitle="From - support team" time="Just now" initials="SA" agent><p className="whitespace-pre-wrap">{sentReply}</p></MessageCard>}

              <div className="overflow-hidden rounded-xl border border-[#d0d5dd] shadow-[0_1px_2px_rgba(16,24,40,0.06)] focus-within:border-[#00a6d4] dark:border-[#3a3a3a]">
                <textarea value={reply} onChange={(event) => setReply(event.target.value)} aria-label="Type your reply" placeholder="Type your reply here..." rows={5} className="w-full resize-y bg-white px-4 py-4 text-sm text-[#101828] outline-none placeholder:text-[#98a2b3] dark:bg-[#1b1b1b] dark:text-gray-100 dark:placeholder:text-gray-500" />
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-3">
                  <div className="flex items-center gap-3">
                    <input ref={attachmentRef} type="file" className="sr-only" onChange={(event) => setAttachment(event.target.files?.[0] ?? null)} aria-label="Attach a file" />
                    <button type="button" onClick={() => attachmentRef.current?.click()} className="inline-flex items-center gap-2 text-sm text-[#667085] transition-colors hover:text-[#007fa3] dark:text-gray-400"><Paperclip size={17} />Attach</button>
                    {attachment && <span className="inline-flex max-w-52 items-center gap-1 truncate text-xs text-[#667085]">{attachment.name}<button type="button" aria-label="Remove attachment" onClick={() => { setAttachment(null); if (attachmentRef.current) attachmentRef.current.value = '' }}><X size={14} /></button></span>}
                  </div>
                  <button type="button" onClick={sendReply} disabled={!reply.trim()} className="inline-flex items-center gap-2 rounded-lg bg-[#00a6d4] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#008bb5] disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer"><Send size={15} />Reply</button>
                </div>
              </div>

              <fieldset className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[#344054] dark:text-gray-200">
                <legend className="sr-only">Ticket status</legend>
                <span className="font-medium text-[#667085] dark:text-gray-400">Status:</span>
                {(['In Progress', 'Solved', 'On Hold'] as const).map((option) => <label key={option} className="inline-flex cursor-pointer items-center gap-2 text-[#344054] dark:text-white"><input type="radio" name="ticket-status" value={option} checked={status === option} onChange={() => setStatus(option)} className="h-4 w-4 accent-[#00a6d4]" />{option}</label>)}
              </fieldset>
            </div>
          </section>

          <aside className="overflow-hidden rounded-xl border border-[#e1e6ee] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] dark:border-[#303030] dark:bg-[#151515]">
            <h2 className="border-b border-[#e1e6ee] px-5 py-4 text-lg font-semibold dark:border-[#303030]">Ticket Details</h2>
            <dl className="divide-y divide-[#eaecf0] px-5 py-2 dark:divide-[#303030]">
              <Detail label="Customer" value="John Doe" />
              <Detail label="Email" value="johndoe@gmail.com" />
              <Detail label="Ticket ID" value={ticket.id} />
              <Detail label="Category" value="General Support" />
              <Detail label="Created" value={ticket.date} />
              <div className="flex items-center justify-between gap-4 py-3"><dt className="text-sm text-[#667085] dark:text-gray-400">Status</dt><dd><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${status === 'Solved' ? 'bg-[#ecfdf3] text-[#039855]' : status === 'On Hold' ? 'bg-[#fffaeb] text-[#b54708]' : 'bg-[#eff8ff] text-[#0086c9]'}`}>{status}</span></dd></div>
            </dl>
          </aside>
        </div>
      </div>
    </main>
  )
}

function MessageCard({ name, subtitle, time, initials, agent = false, children }: { name: string; subtitle: string; time: string; initials: string; agent?: boolean; children: React.ReactNode }) {
  return (
    <article className="border-b border-[#e1e6ee] pb-6 last:border-0 dark:border-[#303030]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${agent ? 'bg-[#eaf0ff] text-[#5267d8]' : 'bg-[#e6f7fc] text-[#007fa3]'}`}>{initials}</div>
          <div><p className="text-sm font-semibold">{name}</p><p className="text-xs text-[#667085] dark:text-gray-400">{subtitle}</p></div>
        </div>
        <time className="text-xs text-[#667085] dark:text-gray-400">{time}</time>
      </div>
      <div className="space-y-3 text-sm leading-6 text-[#475467] dark:text-gray-300">{children}</div>
    </article>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 border-b border-[#eaecf0] py-3 last:border-0 dark:border-[#303030]"><dt className="shrink-0 text-sm text-[#667085] dark:text-gray-400">{label}</dt><dd className="break-all text-right text-sm font-medium text-[#344054] dark:text-gray-200">{value}</dd></div>
}
