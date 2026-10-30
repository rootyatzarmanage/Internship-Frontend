import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import './tickets.css'
import {
  LEVELS, MEMBERS, PRIORITIES, actAddNote, actAssign, actCantResolve, actClose, actReopen, actSaResolve, actSetPriority,
  actTeamResolve, canAssign, closeTicketModal, fmt, get, isActive, lvl, lvlColor, memberLoad, memberName, rules,
  slaInfo, statusClass, targetLevel, ui, useTicketStore, type Status, type Ticket,
} from './store'

/* Wrapper for every outlet screen. Everything is scoped under .tk so sidebar / header are untouched. */
export function Page({ title, sub, tools, children }: { title: string; sub: string; tools?: ReactNode; children: ReactNode }) {
  useTicketStore()
  return (
    <div className="tk">
      <div className="content">
        <div className="page-head">
          <div><h1>{title}</h1><p>{sub}</p></div>
          {tools && <div className="tools">{tools}</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
      </div>
      <ToastHost />
    </div>
  )
}

export function ToastHost() {
  return <div className="toasts">{ui.toasts.map((t) => <div key={t.id} className={'toast' + (t.err ? ' err' : '')}>{t.msg}</div>)}</div>
}

export const LvlTag = ({ id }: { id: number }) => {
  const c = lvlColor(id)
  return <span className="lvl-tag" style={{ background: c.bg, color: c.fg }}>Level {id}</span>
}

export const Pill = ({ status }: { status: Status }) => <span className={'pill ' + statusClass(status)}>{status}</span>

export function Pager({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  const nums = [...new Set([1, pages, page, page - 1, page + 1])].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b)
  const out: ReactNode[] = []
  let last = 0
  nums.forEach((n) => {
    if (n - last > 1) out.push(<span key={'d' + n} className="muted">....</span>)
    out.push(<button key={n} className={n === page ? 'on' : ''} onClick={() => onChange(n)}>{n}</button>)
    last = n
  })
  return (
    <>
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>Previous</button>
      {out}
      <button disabled={page === pages} onClick={() => onChange(page + 1)}>Next</button>
    </>
  )
}

/* <optgroup> list of members per level, with live active counts (same as the HTML) */
export function MemberOptions({ onlyLevel }: { onlyLevel?: number | null }) {
  return (
    <>
      {LEVELS.filter((L) => !onlyLevel || L.id === onlyLevel).map((L) => (
        <optgroup key={L.id} label={`Level ${L.id} - ${L.name}`}>
          {MEMBERS.filter((m) => m.level === L.id).map((m) => <option key={m.id} value={m.id}>{m.name} ({memberLoad(m.id)} active)</option>)}
        </optgroup>
      ))}
    </>
  )
}

/* Backdrop click + Escape close the popup, like the HTML */
export function Modal({ onClose, wide, children }: { onClose: () => void; wide?: boolean; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="modal-wrap" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className={'modal' + (wide ? ' wide' : '')}>{children}</div>
    </div>
  )
}

/* ---- Ticket details popup ---- */
export function TicketModal() {
  const id = ui.open
  const t = id ? get(id) : undefined
  if (!t) return null
  return <TicketModalBody key={t.id} t={t} />
}

function TicketModalBody({ t }: { t: Ticket }) {
  const assignRef = useRef<HTMLSelectElement>(null)
  const reasonRef = useRef<HTMLInputElement>(null)
  const noteRef = useRef<HTMLTextAreaElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight }, [t.history.length])

  const failed = new Set(t.history.filter((h) => h.type === 'failed').map((h) => h.lvl))
  const sla = slaInfo(t)
  const saDone = t.resolvedLevel === 0 && !isActive(t)
  const tl = targetLevel(t), only = rules.override ? null : tl
  const sameLevel = t.status === 'Needs Super Admin' && tl === t.level

  return (
    <Modal wide onClose={closeTicketModal}>
      <div className="m-head">
        <div>
          <div className="muted small">{t.id}</div>
          <h3 style={{ fontSize: 18, margin: '2px 0 6px' }}>{t.subject}</h3>
          <Pill status={t.status} />
        </div>
        <button className="icon-btn" title="Close" onClick={closeTicketModal}><X className="ic" /></button>
      </div>
      <div className="m-body">
        <div className="dgrid">
          <div><label>User</label>{t.user}<div className="muted small">{t.email}</div></div>
          <div><label>Category</label>{t.cat}</div>
          <div><label>Priority</label>
            <select value={t.pri} onChange={(e) => actSetPriority(t.id, e.target.value as Ticket['pri'])}>{PRIORITIES.map((p) => <option key={p}>{p}</option>)}</select>
          </div>
          <div><label>Created</label>{fmt(t.createdAt)}</div>
          <div><label>Current level</label>{t.level ? 'Level ' + t.level + ' - ' + lvl(t.level)?.name : 'Not assigned yet'}</div>
          <div><label>SLA</label><span className={sla.cls}>{sla.txt}</span></div>
        </div>

        <div><div className="sec-t">Description</div><div style={{ fontSize: 13 }}>{t.desc || <span className="muted">No description.</span>}</div></div>

        <div>
          <div className="sec-t">Hierarchy path (bottom to top)</div>
          <div className="path">
            {LEVELS.map((L) => {
              let cls = '', note = 'Pending'
              if (failed.has(L.id)) { cls = 'failed'; note = 'Could not resolve' }
              if (t.level === L.id && t.status === 'On going') { cls = 'current'; note = 'Working: ' + (memberName(t.assignee) || '') }
              if (t.resolvedLevel === L.id && !isActive(t)) { cls = 'done'; note = 'Resolved' }
              return <div key={L.id} className={'step ' + cls}><b>Level {L.id}</b>{L.name}<div className="small">{note}</div></div>
            })}
            <div className={'step ' + (t.status === 'Needs Super Admin' ? 'current' : saDone ? 'done' : '')}>
              <b>Super Admin</b>Final review<div className="small">{t.status === 'Needs Super Admin' ? 'Action needed' : saDone ? 'Resolved' : 'Standby'}</div>
            </div>
          </div>
        </div>

        {canAssign(t) && (
          <div className="panel">
            <div className="sec-t">Assign ticket</div>
            <p>
              {rules.override ? 'Level skipping is ON. You can pick any level.'
                : sameLevel ? 'The top level could not resolve this. Reassign to another member of the same level, or resolve it yourself.'
                : <>Next in hierarchy: <b>Level {tl} - {lvl(tl)?.name}</b>. Levels cannot be skipped.</>}
            </p>
            <div className="row">
              <select ref={assignRef}><MemberOptions onlyLevel={only} /></select>
              <button className="btn primary" onClick={() => actAssign(t.id, assignRef.current?.value ?? '')}>Assign</button>
            </div>
          </div>
        )}

        {t.status === 'On going' && (
          <div className="panel">
            <div className="sec-t">Assigned to {memberName(t.assignee)} (Level {t.level})</div>
            <p>The team works on this ticket. If they cannot solve it, it returns to you for assignment to the next level. The buttons below simulate the assignee's action for testing.</p>
            <input type="text" ref={reasonRef} placeholder="Reason (e.g. needs server access)" style={{ marginBottom: 8 }} />
            <div className="row">
              <button className="btn danger sm" onClick={() => actCantResolve(t.id, reasonRef.current?.value.trim() ?? '')}>Team can't resolve (return to Super Admin)</button>
              <button className="btn sm" onClick={() => actTeamResolve(t.id)}>Team marks resolved</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {isActive(t) ? (
            <>
              <button className="btn sm" onClick={() => actSaResolve(t.id)}>Resolve as Super Admin</button>
              <button className="btn sm danger" onClick={() => actClose(t.id)}>Close ticket</button>
            </>
          ) : (
            <>
              {t.status === 'Resolved' && <button className="btn sm danger" onClick={() => actClose(t.id)}>Close ticket</button>}
              <button className="btn sm" onClick={() => actReopen(t.id)}>Reopen (restart hierarchy)</button>
            </>
          )}
        </div>

        <div className="two-col">
          <div>
            <div className="sec-t">Internal notes</div>
            <textarea ref={noteRef} placeholder="Add a note visible to staff only" style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 6, padding: '7px 9px', background: 'var(--card)' }} />
            <button className="btn sm" style={{ marginTop: 6 }} onClick={() => { if (actAddNote(t.id, noteRef.current?.value.trim() ?? '') && noteRef.current) noteRef.current.value = '' }}>Add note</button>
            {t.notes.map((n, i) => <div key={i} className="note-item">{n.text}<div className="muted small">{fmt(n.at)}</div></div>)}
          </div>
          <div>
            <div className="sec-t">Activity timeline <span className="muted small">({t.history.length})</span></div>
            <div className="log-card" ref={logRef}>
              <div className="timeline">
                {t.history.map((h, i) => <div key={i} className={'tl ' + h.type}><div>{h.text}</div><div className="when">{fmt(h.at)} &middot; {h.by}</div></div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
