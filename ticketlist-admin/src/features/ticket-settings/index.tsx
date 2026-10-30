import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import {
  CAPACITY, LEVELS, MEMBERS, actAddLevel, actAddMember, actSetRule, actSetSla, canAssign, db, initials, lvl, lvlColor, maxLevel,
  memberLoad, memberSolved, rules, targetLevel, touch, ui, useTicketStore,
} from '../tickets/store'
import { LvlTag, Modal, Page, Pager } from '../tickets/ui'

export default function TicketSettings() {
  useTicketStore()
  const [modal, setModal] = useState<'level' | 'member' | null>(null)
  const T = ui.team
  const set = (patch: Partial<typeof T>) => touch(() => Object.assign(T, patch))

  const inScope = MEMBERS.filter((m) => T.lvl === 'all' || String(m.level) === T.lvl)
  const lv = T.lvl === 'all' ? null : lvl(Number(T.lvl))
  const active = inScope.reduce((a, m) => a + memberLoad(m.id), 0)
  const waiting = db.tickets.filter((t) => canAssign(t) && (!lv || targetLevel(t) === lv.id)).length
  const sum: [string | number, string][] = [
    [T.lvl === 'all' ? LEVELS.length : '1', T.lvl === 'all' ? 'Levels' : 'Level'], [inScope.length, 'Members'], [active, 'Active tickets'], [waiting, 'Waiting for assignment'],
  ]
  if (lv) sum.push([lv.sla + 'h', 'SLA'])

  const q = T.q.trim().toLowerCase()
  const list = inScope.filter((m) => !q || m.name.toLowerCase().includes(q)).map((m) => ({ ...m, active: memberLoad(m.id), solved: memberSolved(m.id) }))
  list.sort((a, b) => T.sort === 'active' ? b.active - a.active : T.sort === 'free' ? a.active - b.active : T.sort === 'solved' ? b.solved - a.solved : a.name.localeCompare(b.name))
  const pages = Math.max(1, Math.ceil(list.length / T.per))
  if (T.page > pages) T.page = pages
  const start = (T.page - 1) * T.per
  const rows = list.slice(start, start + T.per)

  const ruleDefs: [keyof typeof rules, string, string][] = [
    ['auto', 'Auto-return on SLA breach', 'Flags the ticket for reassignment to the next level'],
    ['notify', 'Notify Super Admin on escalation', 'Show an alert when a level returns a ticket'],
    ['override', 'Allow skipping levels', 'Off = strict bottom-to-top order (recommended)'],
  ]

  return (
    <Page title="Ticket Settings" sub="Manage the support team levels and members, and set the escalation rules.">
      <section className="card">
        <div className="card-head">
          <div><h2>Support Team</h2><div className="sub">Pick a level, search a member, and see who has capacity</div></div>
          <div className="tools">
            <button className="btn sm" onClick={() => setModal('level')}><Plus className="ic" />Add level</button>
            <button className="btn sm primary" onClick={() => setModal('member')}><Plus className="ic" />Add member</button>
          </div>
        </div>

        <div className="chips">
          <button className={'chip ' + (T.lvl === 'all' ? 'on' : '')} onClick={() => set({ lvl: 'all', page: 1 })}>All levels <span>{MEMBERS.length}</span></button>
          {LEVELS.map((L) => (
            <button key={L.id} className={'chip ' + (T.lvl === String(L.id) ? 'on' : '')} onClick={() => set({ lvl: String(L.id), page: 1 })}>
              <i style={{ background: lvlColor(L.id).bg }} />L{L.id} {L.name} <span>{MEMBERS.filter((m) => m.level === L.id).length}</span>
            </button>
          ))}
        </div>

        <div className="team-sum">{sum.map((s) => <div key={s[1]}><b>{s[0]}</b>{s[1]}</div>)}</div>

        <div className="tools" style={{ marginBottom: 12 }}>
          <label className="searchbox" style={{ width: 260 }}><Search className="ic" /><input placeholder="Search member..." value={T.q} onChange={(e) => set({ q: e.target.value, page: 1 })} /></label>
          <div className="fld" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>Sort by
            <select style={{ minWidth: 150 }} value={T.sort} onChange={(e) => set({ sort: e.target.value })}>
              <option value="name">Name (A-Z)</option><option value="active">Most active tickets</option><option value="free">Most available</option><option value="solved">Most solved</option>
            </select>
          </div>
        </div>

        <div className="tbl-wrap">
          <table className="compact">
            <thead><tr><th>Member</th><th>Level</th><th>Active</th><th>Solved</th><th style={{ width: 200 }}>Workload</th></tr></thead>
            <tbody>
              {rows.length ? rows.map((m) => {
                const pct = Math.min(100, m.active / CAPACITY * 100)
                return (
                  <tr key={m.id}>
                    <td><div className="person"><div className="avatar sm">{initials(m.name)}</div>{m.name}</div></td>
                    <td><LvlTag id={m.level} /></td><td>{m.active}</td><td>{m.solved}</td>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div className="meter" style={{ flex: 1 }}><i className={m.active >= CAPACITY ? 'hot' : ''} style={{ width: pct + '%' }} /></div><span className="muted small">{m.active}/{CAPACITY}</span></div></td>
                  </tr>
                )
              }) : <tr><td colSpan={5}><div className="empty">No members found.</div></td></tr>}
            </tbody>
          </table>
        </div>

        <div className="table-foot">
          <span className="muted small">{list.length ? `Showing ${start + 1}-${Math.min(start + T.per, list.length)} of ${list.length} members` : ''}</span>
          <div className="pager">{pages > 1 && <Pager page={T.page} pages={pages} onChange={(p) => set({ page: p })} />}</div>
        </div>
      </section>

      <section className="card">
        <div className="card-head"><div><h2>Escalation Rules</h2><div className="sub">Applies to every level</div></div></div>
        <div>
          <div className="rule-scroll">
            {LEVELS.map((L) => (
              <div key={L.id} className="rule">
                <div>Level {L.id} SLA (hours)<small>{L.name}: time to resolve before auto-return</small></div>
                <input type="number" min={1} max={72} defaultValue={L.sla} key={L.id}
                  onBlur={(e) => { if (Number(e.target.value) !== L.sla) actSetSla(L.id, Number(e.target.value)) }}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }} />
              </div>
            ))}
          </div>
          {ruleDefs.map(([key, title, hint]) => (
            <div key={key} className="rule">
              <div>{title}<small>{hint}</small></div>
              <label className="sw"><input type="checkbox" checked={rules[key]} onChange={(e) => actSetRule(key, e.target.checked)} /><span></span></label>
            </div>
          ))}
        </div>
      </section>

      {modal === 'level' && <LevelModal onClose={() => setModal(null)} />}
      {modal === 'member' && <MemberModal onClose={() => setModal(null)} />}
    </Page>
  )
}

function LevelModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [tag, setTag] = useState('')
  const [sla, setSla] = useState('12')
  return (
    <Modal onClose={onClose}>
      <h3>Add Level</h3>
      <p className="muted small">This becomes Level {maxLevel() + 1}: tickets that Level {maxLevel()} cannot resolve will be assigned here next.</p>
      <div className="fld">Level name<input placeholder="e.g. Senior Engineers" value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div className="fld">Description<input placeholder="e.g. Advanced technical knowledge" value={tag} onChange={(e) => setTag(e.target.value)} /></div>
      <div className="fld">SLA (hours)<input type="number" min={1} max={72} value={sla} onChange={(e) => setSla(e.target.value)} /></div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn primary" onClick={() => { if (actAddLevel(name, tag, Number(sla))) onClose() }}>Add level</button>
      </div>
    </Modal>
  )
}

function MemberModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [level, setLevel] = useState(LEVELS[0].id)
  return (
    <Modal onClose={onClose}>
      <h3>Add Member</h3>
      <div className="fld">Full name<input placeholder="e.g. Vikram Rao" value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div className="fld">Level<select value={level} onChange={(e) => setLevel(Number(e.target.value))}>{LEVELS.map((L) => <option key={L.id} value={L.id}>Level {L.id} - {L.name}</option>)}</select></div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn primary" onClick={() => { if (actAddMember(name, level)) onClose() }}>Add member</button>
      </div>
    </Modal>
  )
}
