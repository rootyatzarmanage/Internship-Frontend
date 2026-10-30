import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Plus,
  Reply as ReplyIcon,
  Search,
  SlidersHorizontal,
  Ticket,
  Timer,
  X,
} from 'lucide-react'

export type TicketStatus = 'Solved' | 'Pending'
type TicketFilter = 'All' | TicketStatus
export type TicketRow = {
  id: string
  subject: string
  date: string
  status: TicketStatus
}

export const tickets: TicketRow[] = [
  { id: '#323534', subject: 'Issue with Dashboard Login Access', date: '12 Feb, 2027', status: 'Solved' },
  { id: '#323535', subject: 'Billing Information Not Updating Properly', date: '13 Mar, 2027', status: 'Pending' },
  { id: '#323536', subject: 'Bug Found in Dark Mode Layout', date: '19 Mar, 2027', status: 'Pending' },
  { id: '#323537', subject: 'Request to Add New Integration Feature', date: '25 Apr, 2027', status: 'Solved' },
  { id: '#323538', subject: 'Unable to Reset Password', date: '28 Apr, 2027', status: 'Pending' },
  { id: '#323539', subject: 'Feature Request: Dark Mode', date: '30 Apr, 2027', status: 'Solved' },
  { id: '#323540', subject: 'Error 500 on Dashboard', date: '01 May, 2027', status: 'Pending' },
  { id: '#323541', subject: 'Cannot Download Invoice', date: '02 May, 2027', status: 'Solved' },
  { id: '#323542', subject: 'UI Bug in Mobile View', date: '03 May, 2027', status: 'Pending' },
  { id: '#323543', subject: 'Unable to Update Account Details', date: '04 May, 2027', status: 'Solved' },
]

const ticketFilters: TicketFilter[] = ['All', 'Solved', 'Pending']

export default function TicketList() {
  const ticketData = tickets
  const [ticketInView, setTicketInView] = useState<TicketRow | null>(null)
  const [activeFilter, setActiveFilter] = useState<TicketFilter>('All')
  const [search, setSearch] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      if (!target.closest('[data-ticket-filter]')) setShowFilter(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowFilter(false)
        setTicketInView(null)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const visibleTickets = useMemo(() => ticketData.filter((ticket) => {
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || [ticket.id, ticket.subject, ticket.status].some((value) => value.toLowerCase().includes(query))
    const matchesFilter = activeFilter === 'All' || ticket.status === activeFilter
    return matchesFilter && matchesSearch
  }), [ticketData, activeFilter, search])

  const totalPages = Math.max(1, Math.ceil(visibleTickets.length / pageSize))
  const pageTickets = visibleTickets.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const firstEntry = visibleTickets.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const lastEntry = Math.min(currentPage * pageSize, visibleTickets.length)


  return (
    <main className="min-h-full bg-[#f8fafc] px-5 py-7 text-[#101828] dark:bg-[#080808] dark:text-gray-100 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold">Support Tickets</h1>
          <nav aria-label="Breadcrumb" className="hidden items-center gap-2 text-sm text-[#667085] dark:text-gray-400 sm:flex">
            <a className="text-[#667085] hover:text-[#008cd2] dark:text-gray-400" href="#">Home</a>
            <ChevronRight size={15} className="text-[#667085] dark:text-gray-500" />
            <span>Support Tickets</span>
          </nav>
        </div>

        <section aria-label="Ticket summary" className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard icon={<Ticket size={24} />} tone="blue" value="948" label="Total tickets" />
          <SummaryCard icon={<Timer size={24} />} tone="orange" value="125" label="Pending tickets" />
          <SummaryCard icon={<CircleCheck size={24} />} tone="green" value="356" label="Solved tickets" />
        </section>

        <section className="overflow-hidden rounded-xl border border-[#e1e6ee] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] dark:border-[#303030] dark:bg-[#151515]">
          <div className="flex flex-col gap-4 border-b border-[#e1e6ee] px-5 py-4 dark:border-[#303030] lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Support Tickets</h2>
              <p className="mt-0.5 text-sm text-[#667085] dark:text-gray-400">Your most recent support tickets list</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex h-11 min-w-0 items-center gap-2 rounded-lg border border-[#d0d5dd] px-3 text-[#667085] focus-within:border-[#00a6d4] dark:border-[#3a3a3a] dark:text-gray-400 sm:w-[300px]">
                <Search size={19} aria-hidden="true" />
                <input value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1) }} placeholder="Search..." className="w-full bg-transparent text-sm text-[#101828] outline-none placeholder:text-[#98a2b3] dark:text-gray-100 dark:placeholder:text-gray-500" aria-label="Search tickets" />
                {search && <button type="button" onClick={() => setSearch('')} aria-label="Clear search"><X size={16} /></button>}
              </label>
              <div className="relative" data-ticket-filter>
                <button type="button" onClick={() => setShowFilter((value) => !value)} aria-label="Filter tickets" title="Filter tickets" aria-expanded={showFilter} className="flex h-11 w-full items-center justify-center rounded-lg border border-[#d0d5dd] px-4 text-sm font-medium transition-colors hover:bg-[#f2f4f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cd2] sm:w-11 hover:cursor-pointer dark:hover:bg-white dark:hover:text-black">
                  <SlidersHorizontal size={20} className="h-5 w-5 shrink-0" />
                </button>
                {showFilter && <div className="absolute right-0 z-20 mt-2 w-52 rounded-lg border border-[#e1e6ee] bg-white p-3 text-sm shadow-lg dark:border-[#303030] dark:bg-[#1b1b1b]"><p className="mb-2 font-medium">Status</p>{ticketFilters.map((filter) => <button key={filter} type="button" onClick={() => { setActiveFilter(filter); setCurrentPage(1); setShowFilter(false) }} className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left hover:bg-gray-50 dark:hover:bg-[#292929] hover:cursor-pointer">{filter}{activeFilter === filter && <Check size={15} className="text-[#008cd2]" />}</button>)}</div>}
              </div>
              <Link to="/ticketlist/create" aria-label="Create ticket" title="Create ticket" className="flex h-11 w-full items-center justify-center rounded-lg bg-[#00a6d4] text-white transition-colors hover:bg-[#008bb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cd2] focus-visible:ring-offset-2 sm:w-11">
                <Plus size={20} aria-hidden="true" />
              </Link>
            </div>
          </div>


          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse text-left">
              <thead>
                <tr className="h-[43px] border-b border-[#e1e6ee] text-xs font-medium text-[#344054] dark:border-[#303030] dark:text-gray-300">
                  <th className="w-[100px] pl-4 font-medium">Ticket ID</th>
                  <th className="font-medium">Subject</th>
                  <th className="w-[210px] font-medium">Create Date </th>
                  <th className="w-[155px] font-medium">Status</th>
                  <th className="w-[130px] pr-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageTickets.map((ticket) => <tr key={ticket.id} className="h-[69px] border-b border-[#e1e6ee] last:border-0 hover:bg-[#fafbfc] dark:border-[#303030] dark:hover:bg-[#1c1c1c]">
                  <td className="pl-4 text-xs font-medium">{ticket.id}</td>
                  <td className="pr-4 text-sm">{ticket.subject}</td>
                  <td className="text-sm">{ticket.date}</td>
                  <td><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ticket.status === 'Solved' ? 'bg-[#ecfdf3] text-[#039855]' : 'bg-[#fffaeb] text-[#dc6803]'}`}>{ticket.status}</span></td>
                  <td className="pr-4 text-right"><Link to="/ticketlist/reply" search={{ ticketId: ticket.id.slice(1) }} aria-label={`Reply to ticket ${ticket.id}`} title="Reply to ticket" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d0d5dd] text-[#344054] transition-colors hover:border-[#00a6d4] hover:bg-[#e6f7fc] hover:text-[#007fa3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6d4] dark:border-[#444] dark:text-gray-200 dark:hover:bg-[#12313a]"><ReplyIcon size={17} aria-hidden="true" /></Link></td>
                </tr>)}
                {visibleTickets.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-[#667085] dark:text-gray-400">No tickets match your search.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 border-t border-[#e1e6ee] px-5 py-4 text-sm text-[#667085] dark:border-[#303030] dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="page-size">Show</label>
              <select id="page-size" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setCurrentPage(1) }} className="rounded-lg border border-[#d0d5dd] bg-white px-2 py-1.5 text-sm text-[#344054] outline-none hover:cursor-pointer focus:border-[#008cd2] dark:border-[#444] dark:bg-[#1b1b1b] dark:text-gray-100">
                <option value={5}>5</option><option value={10}>10</option><option value={20}>20</option>
              </select>
              <span>entries</span>
              <span className="ml-2">Showing <strong className="font-medium text-[#344054]">{firstEntry}–{lastEntry}</strong> of <strong className="font-medium text-[#344054]">{visibleTickets.length}</strong> tickets</span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="rounded-lg border border-[#d0d5dd] px-3 py-2 hover:cursor-pointer disabled:cursor-not-allowed disabled:text-[#98a2b3]">Previous</button>
              <span className="px-1 text-[#344054]">{currentPage} / {totalPages}</span>
              <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="rounded-lg border border-[#d0d5dd] px-3 py-2 hover:bg-gray-50 hover:cursor-pointer disabled:cursor-not-allowed disabled:text-[#98a2b3]">Next <ChevronDown size={14} className="ml-1 inline rotate-[-90deg]" /></button>
            </div>
          </div>
        </section>

        {ticketInView && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setTicketInView(null) }}>
          <section role="dialog" aria-modal="true" aria-labelledby="ticket-dialog-title" className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-[#151515]">
            <div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-[#008cd2]">Ticket {ticketInView.id}</p><h2 id="ticket-dialog-title" className="mt-1 text-xl font-semibold">{ticketInView.subject}</h2></div><button type="button" aria-label="Close ticket details" onClick={() => setTicketInView(null)} className="rounded-md p-1 text-[#667085] hover:bg-gray-100 hover:cursor-pointer"><X size={20} /></button></div>
            <div className="mt-5 rounded-lg bg-[#f8fafc] p-4 dark:bg-[#202020]"><h3 className="text-sm font-medium">Ticket content</h3><p className="mt-2 text-sm leading-6 text-[#667085] dark:text-gray-400">{ticketInView.subject}</p></div>
            <div className="mt-6 flex justify-end"><button type="button" onClick={() => setTicketInView(null)} className="rounded-lg border border-[#d0d5dd] px-4 py-2 text-sm font-medium hover:bg-gray-50 hover:cursor-pointer dark:border-[#444] dark:hover:bg-[#252525]">Close</button></div>
          </section>
        </div>}
      </div>
    </main>
  )
}

function SummaryCard({ icon, tone, value, label }: { icon: React.ReactNode; tone: 'blue' | 'orange' | 'green'; value: string; label: string }) {
  const colors = {
    blue: 'bg-[#e6f7ff] text-[#008cd2]',
    orange: 'bg-[#fff4e8] text-[#f79009]',
    green: 'bg-[#e8f8f1] text-[#12b76a]',
  }
  return <article className="flex min-h-[90px] items-center gap-5 rounded-xl border border-[#e1e6ee] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(16,24,40,0.05)] dark:border-[#303030] dark:bg-[#151515] sm:px-5"><div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${colors[tone]}`}>{icon}</div><div><div className="text-2xl font-semibold leading-7">{value}</div><div className="mt-1 text-sm text-[#667085] dark:text-gray-400">{label}</div></div></article>
}

