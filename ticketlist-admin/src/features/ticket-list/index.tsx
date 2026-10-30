import { useState } from 'react'
import { ArrowDownToLine, ArrowUpDown, Filter, Plus, Search } from 'lucide-react'
import {
  CATEGORIES, LEVELS, PRIORITIES, SORTS, STATUSES, TABS, USERS, actBulkAssign, actCreate, canAssign, db, exportCSV, filtered, fmt,
  isActive, memberName, openTicket, slaInfo, targetLevel, touch, ui, useTicketStore, type Priority, type TabKey, type Ticket,
} from '../tickets/store'
import { LvlTag, MemberOptions, Modal, Page, Pager, Pill, TicketModal } from '../tickets/ui'

export default function TicketListAdmin({ createOpen = false, onCreateClose }: { createOpen?: boolean; onCreateClose?: () => void }) {
  useTicketStore()
  const [creating, setCreating] = useState(createOpen)
  const L = ui.list
  const list = filtered()
  const per = L.per, pages = Math.max(1, Math.ceil(list.length / per))
  if (L.page > pages) L.page = pages
  const start = (L.page - 1) * per
  const rows = list.slice(start, start + per)
  const set = (patch: Partial<typeof L>) => touch(() => Object.assign(L, patch))

  const closeCreate = () => { setCreating(false); onCreateClose?.() }

  return (
    <Page
      title="Ticket List"
      sub="Search, filter, assign and escalate tickets through the support hierarchy."
      tools={<>
        <button className="btn" onClick={exportCSV}><ArrowDownToLine className="ic" />Export CSV</button>
        <button className="btn primary" onClick={() => setCreating(true)}><Plus className="ic" />Create Ticket</button>
      </>}
    >
      <section className="card">
        <div className="card-head">
          <div><h2>Ticket List</h2></div>
          <div className="tools">
            <label className="searchbox" style={{ width: 260 }}><Search className="ic" /><input placeholder="Search Ticket ID, Subject, User..." value={L.q} onChange={(e) => set({ q: e.target.value, page: 1 })} /></label>
            <button className="icon-btn" title="Filters" onClick={() => set({ filtersOn: !L.filtersOn })}><Filter className="ic" /></button>
            <button className="icon-btn" title="Change sort order" onClick={() => { const i = SORTS.findIndex((s) => s[0] === L.sort); set({ sort: SORTS[(i + 1) % SORTS.length][0] }) }}><ArrowUpDown className="ic" /></button>
            <button className="icon-btn" title="Export CSV" onClick={exportCSV}><ArrowDownToLine className="ic" /></button>
          </div>
        </div>

        <div className="tabs">
          {TABS.map(([key, label, fn]) => (
            <button key={key} className={'tab ' + (L.tab === key ? 'active' : '')} onClick={() => set({ tab: key as TabKey, page: 1 })}>{label}<span className="n">{db.tickets.filter(fn).length}</span></button>
          ))}
        </div>

        <div className="filters" style={{ display: L.filtersOn ? 'flex' : 'none' }}>
          <div className="fld">Start Date<input type="date" value={L.from} onChange={(e) => set({ from: e.target.value, page: 1 })} /></div>
          <div className="fld">End Date<input type="date" value={L.to} onChange={(e) => set({ to: e.target.value, page: 1 })} /></div>
          <div className="fld">Status<select value={L.status} onChange={(e) => set({ status: e.target.value, page: 1 })}><option value="">All</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
          <div className="fld">Priority<select value={L.pri} onChange={(e) => set({ pri: e.target.value, page: 1 })}><option value="">All</option>{[...PRIORITIES].reverse().map((p) => <option key={p}>{p}</option>)}</select></div>
          <div className="fld">Level<select value={L.level} onChange={(e) => set({ level: e.target.value, page: 1 })}><option value="">All</option><option value="0">Unassigned</option>{LEVELS.map((l) => <option key={l.id} value={l.id}>Level {l.id} - {l.name}</option>)}</select></div>
          <div className="fld">Category<select value={L.cat} onChange={(e) => set({ cat: e.target.value, page: 1 })}><option value="">All</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <button className="btn sm" onClick={() => set({ q: '', from: '', to: '', status: '', pri: '', level: '', cat: '', page: 1 })}>Reset</button>
          <span className="muted small" style={{ marginLeft: 'auto' }}>Sort: {SORTS.find((s) => s[0] === L.sort)![1]}</span>
        </div>

        <BulkBar />

        <div className="tbl-wrap">
          <table>
            <thead><tr>
              <th style={{ width: 32 }}><input type="checkbox" checked={rows.length > 0 && rows.every((t) => L.sel.has(t.id))} onChange={(e) => touch(() => rows.forEach((t) => e.target.checked ? L.sel.add(t.id) : L.sel.delete(t.id)))} /></th>
              <th>S.no</th><th>Ticket ID</th><th>Subject</th><th>User</th><th>Category</th><th>Priority</th>
              <th>Level</th><th>Assigned To</th><th>Status</th><th>SLA</th><th>Created</th><th></th>
            </tr></thead>
            <tbody className="row-click">
              {rows.length ? rows.map((t, i) => <Row key={t.id} t={t} no={start + i + 1} />) : <tr><td colSpan={13}><div className="empty">No tickets match the current filters.</div></td></tr>}
            </tbody>
          </table>
        </div>

        <div className="table-foot">
          <div className="show-n">Show
            <select value={L.per} onChange={(e) => set({ per: Number(e.target.value), page: 1 })}><option value="6">06</option><option value="10">10</option><option value="20">20</option></select>
            Entries <span className="muted small">{list.length ? `(${start + 1}-${Math.min(start + per, list.length)} of ${list.length})` : ''}</span>
          </div>
          <div className="pager"><Pager page={L.page} pages={pages} onChange={(p) => set({ page: p })} /></div>
        </div>
      </section>

      <TicketModal />
      {creating && <CreateModal onClose={closeCreate} />}
    </Page>
  )
}

function Row({ t, no }: { t: Ticket; no: number }) {
  const s = slaInfo(t), name = memberName(t.assignee)
  const who = name ? name : t.status === 'Open' ? <span className="muted">Unassigned</span> : isActive(t) ? <span className="muted">Returned to SA</span> : <span className="muted">-</span>
  return (
    <tr onClick={() => openTicket(t.id)}>
      <td onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" checked={ui.list.sel.has(t.id)} onChange={(e) => touch(() => { if (e.target.checked) ui.list.sel.add(t.id); else ui.list.sel.delete(t.id) })} />
      </td>
      <td>{String(no).padStart(2, '0')}</td><td><b>{t.id}</b></td>
      <td className="subj">{t.subject}</td>
      <td>{t.user}<div className="muted small">{t.email}</div></td>
      <td>{t.cat}</td><td className={'p-' + t.pri.toLowerCase()}>{t.pri}</td>
      <td>{t.level ? <LvlTag id={t.level} /> : <span className="muted">-</span>}</td><td>{who}</td>
      <td><Pill status={t.status} /></td>
      <td className={s.cls}>{s.txt}</td><td className="muted">{fmt(t.createdAt)}</td>
      <td onClick={(e) => e.stopPropagation()}>
        {canAssign(t)
          ? <button className="btn sm primary" onClick={() => openTicket(t.id)}>Assign &rarr; L{targetLevel(t)}</button>
          : <button className="btn sm" onClick={() => openTicket(t.id)}>View</button>}
      </td>
    </tr>
  )
}

function BulkBar() {
  const n = ui.list.sel.size
  return (
    <div className={'bulk' + (n > 0 ? ' show' : '')}>
      <b>{n} selected</b>
      <select id="bulkTo"><MemberOptions /></select>
      <button className="btn sm primary" onClick={() => actBulkAssign((document.getElementById('bulkTo') as HTMLSelectElement).value)}>Assign selected</button>
      <button className="btn sm" onClick={() => touch(() => ui.list.sel.clear())}>Clear</button>
    </div>
  )
}

function CreateModal({ onClose }: { onClose: () => void }) {
  const [subject, setSubject] = useState('')
  const [user, setUser] = useState(0)
  const [cat, setCat] = useState(CATEGORIES[0])
  const [pri, setPri] = useState<Priority>('Medium')
  const [desc, setDesc] = useState('')
  return (
    <Modal onClose={onClose}>
      <h3>Create Ticket</h3>
      <div className="fld">Subject<input placeholder="Short summary of the issue" value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
      <div className="fld">User<select value={user} onChange={(e) => setUser(Number(e.target.value))}>{USERS.map((u, i) => <option key={u.email} value={i}>{u.name}</option>)}</select></div>
      <div className="fld">Category<select value={cat} onChange={(e) => setCat(e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
      <div className="fld">Priority<select value={pri} onChange={(e) => setPri(e.target.value as Priority)}>{PRIORITIES.map((p) => <option key={p}>{p}</option>)}</select></div>
      <div className="fld">Description<textarea placeholder="Describe the problem" value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn primary" onClick={() => { if (actCreate({ subject, userIndex: user, cat, pri, desc })) onClose() }}>Create</button>
      </div>
    </Modal>
  )
}

