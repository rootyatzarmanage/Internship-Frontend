import { Link, useNavigate } from '@tanstack/react-router'
import { LEVELS, PRI_RANK, STATUSES, db, isBreached, lvlColor, openTicket, slaInfo, touch, ui, useTicketStore } from '../tickets/store'
import { Page, Pill } from '../tickets/ui'

const STATUS_COLORS: Record<string, string> = {
  'Open': '#b8e2fa', 'On going': '#0fb4ff', 'Escalation Pending': '#0284d1', 'Needs Super Admin': '#00577f', 'Resolved': '#6cc59a', 'Closed': '#c3c9d1',
}

function Donut({ data }: { data: { label: string; color: string; v: number }[] }) {
  const sum = data.reduce((a, d) => a + d.v, 0), total = sum || 1, r = 62, c = 2 * Math.PI * r
  let off = 0
  return (
    <svg viewBox="0 0 180 180" width="190" height="190">
      {data.filter((d) => d.v > 0).map((d) => {
        const len = Math.max(0, d.v / total * c - 4)
        const el = <circle key={d.label} r={r} cx="90" cy="90" fill="none" stroke={d.color} strokeWidth="30" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-off} transform="rotate(-90 90 90)"><title>{d.label}: {d.v}</title></circle>
        off += d.v / total * c
        return el
      })}
      <text x="90" y="88" textAnchor="middle" fontSize="26" fontWeight="600" fill="currentColor">{sum}</text>
      <text x="90" y="106" textAnchor="middle" fontSize="11" fill="#9aa1ab">tickets</text>
    </svg>
  )
}

export default function TicketOverview() {
  useTicketStore()
  const navigate = useNavigate()
  const tickets = db.tickets
  const total = tickets.length
  const open = tickets.filter((t) => t.status === 'Open').length
  const esc = tickets.filter((t) => ['Escalation Pending', 'Needs Super Admin'].includes(t.status)).length
  const res = tickets.filter((t) => ['Resolved', 'Closed'].includes(t.status)).length
  const today = tickets.filter((t) => t.createdAt > Date.now() - 24 * 36e5).length
  const rate = total ? Math.round(res / total * 100) : 0
  const cards: [string, number, string, string][] = [
    ['Total Tickets', total, `+ ${today} today`, 'badge-g'],
    ['Awaiting Assignment', open, 'Needs triage', 'badge-b'],
    ['Escalation Queue', esc, 'Needs next level', 'badge-o'],
    ['Resolved / Closed', res, `${rate} % resolution`, 'badge-g'],
  ]

  const statusData = STATUSES.map((label) => ({ label, color: STATUS_COLORS[label], v: tickets.filter((t) => t.status === label).length }))

  /* resolved tickets by level, last 6 months */
  const series: [string, string, number][] = [...LEVELS.map((L): [string, string, number] => ['Level ' + L.id, lvlColor(L.id).bg, L.id]), ['Super Admin', lvlColor(0).bg, 0]]
  const base = new Date(); base.setDate(1); base.setHours(0, 0, 0, 0)
  const months: { y: number; m: number; label: string }[] = []
  for (let i = 5; i >= 0; i--) { const d = new Date(base); d.setMonth(d.getMonth() - i); months.push({ y: d.getFullYear(), m: d.getMonth(), label: d.toLocaleDateString('en-US', { month: 'short' }) }) }
  const counts = months.map((mo) => series.map((s) => tickets.filter((t) => t.resolvedAt && t.resolvedLevel === s[2] && new Date(t.resolvedAt).getFullYear() === mo.y && new Date(t.resolvedAt).getMonth() === mo.m).length))
  const totals = counts.map((c) => c.reduce((a, b) => a + b, 0))
  const top = Math.max(4, Math.ceil(Math.max(...totals) / 4) * 4)

  /* needs attention */
  const br = tickets.filter(isBreached).length
  const rank = (t: (typeof tickets)[number]) => isBreached(t) ? 0 : t.status === 'Needs Super Admin' ? 1 : t.status === 'Escalation Pending' ? 2 : 3
  const attn = tickets.filter((t) => ['Open', 'Escalation Pending', 'Needs Super Admin'].includes(t.status) || isBreached(t))
    .sort((a, b) => rank(a) - rank(b) || (PRI_RANK[b.pri] - PRI_RANK[a.pri]) || (b.createdAt - a.createdAt)).slice(0, 6)

  return (
    <Page title="Ticket Overview" sub="Key numbers and trends for all support tickets at a glance.">
      <section className="ov-top">
        <div className="kpi-grid">
          {cards.map((c) => (
            <div key={c[0]} className="card stat">
              <div className="lbl">{c[0]}</div>
              <div className="row"><div className="val">{c[1]}</div><span className={`badge-g ${c[3]}`}>{c[2]}</span></div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-head"><div><h2>Tickets by Status</h2></div></div>
          <div className="donut-row">
            <Donut data={statusData} />
            <div className="legend v">{statusData.map((d) => <span key={d.label}><i style={{ background: d.color }} />{d.label} ({d.v})</span>)}</div>
          </div>
        </div>
      </section>

      <section className="ov-bottom">
        <div className="card">
          <div className="card-head"><div><h2>Resolved Tickets by Level</h2><div className="sub">Where tickets finally got resolved (last 6 months)</div></div></div>
          <div className="legend">{series.map((s) => <span key={s[0]}><i style={{ background: s[1] }} />{s[0]}</span>)}</div>
          <div className="bar-chart">
            <div className="ch">
              <div className="ch-plot">
                {[0, 1, 2, 3, 4].map((i) => <div key={i} className="ch-grid" style={{ bottom: `${i * 25}%` }}><span>{top / 4 * i}</span></div>)}
                <div className="ch-bars">
                  {months.map((mo, i) => (
                    <div key={mo.label + mo.y} className="ch-col">
                      <div className="ch-stack" style={{ height: `${totals[i] / top * 100}%` }}>
                        {counts[i].map((v, k) => v ? <div key={k} style={{ height: `${v / totals[i] * 100}%`, background: series[k][1] }} title={`${series[k][0]}: ${v}`} /> : null)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="ch-x">{months.map((mo) => <span key={mo.label + mo.y}>{mo.label}</span>)}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div><h2>Needs Attention</h2></div>
            <div>{br ? <span className="badge-g badge-r">{br} SLA breached</span> : <span className="badge-g">All within SLA</span>}</div>
          </div>
          <div className="tbl-wrap">
            <table style={{ minWidth: 0 }}>
              <thead><tr><th>Ticket</th><th>Status</th><th>SLA</th></tr></thead>
              <tbody className="attn-body">
                {attn.length ? attn.map((t) => {
                  const sl = slaInfo(t)
                  return (
                    <tr key={t.id} onClick={() => { openTicket(t.id); navigate({ to: '/ticket-list' }) }}>
                      <td><b>{t.id}</b><div className="muted small attn-subj">{t.subject}</div></td>
                      <td><Pill status={t.status} /></td>
                      <td className={sl.cls}>{sl.txt}</td>
                    </tr>
                  )
                }) : <tr><td colSpan={3}><div className="empty">Nothing needs attention.</div></td></tr>}
              </tbody>
            </table>
          </div>
          <div className="table-foot" style={{ justifyContent: 'flex-end' }}>
            <Link to="/ticket-list" className="btn sm" onClick={() => touch(() => { ui.list.tab = 'esc'; ui.list.page = 1 })}>View escalation queue</Link>
          </div>
        </div>
      </section>
    </Page>
  )
}
