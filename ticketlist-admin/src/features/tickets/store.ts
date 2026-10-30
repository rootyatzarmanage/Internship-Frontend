import { useSyncExternalStore } from 'react'

/* ============ TYPES ============ */
export type Status = 'Open' | 'On going' | 'Escalation Pending' | 'Needs Super Admin' | 'Resolved' | 'Closed'
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical'
export type Level = { id: number; name: string; tag: string; sla: number }
export type Member = { id: string; name: string; level: number }
export type HistoryItem = { at: number; type: string; text: string; by: string; lvl: number }
export type Ticket = {
  id: string; subject: string; user: string; email: string; cat: string; pri: Priority; desc: string
  status: Status; level: number; assignee: string | null; createdAt: number; assignedAt: number | null
  dueAt: number | null; resolvedAt: number | null; resolvedLevel: number | null; resolvedBy: string | null
  history: HistoryItem[]; notes: { text: string; at: number }[]
}
export type Result = { ok: boolean; msg?: string }
export type TabKey = 'all' | 'open' | 'esc' | 'going' | 'done'
export type SortKey = 'new' | 'old' | 'pri' | 'sla'

/* ============ DATA MODEL (fully data-driven: any number of levels / members) ============ */
export const H = 36e5
export const D = 24 * H
const NOW = Date.now()

export const LEVELS: Level[] = [
  { id: 1, name: 'Support Team', tag: 'Normal team', sla: 4 },
  { id: 2, name: 'Basic Technical', tag: 'Basic technical knowledge', sla: 8 },
  { id: 3, name: 'Lead Technical', tag: 'Lead technical knowledge', sla: 12 },
]
export const MEMBERS: Member[] = [
  { id: 'm1', name: 'Priya Nair', level: 1 }, { id: 'm2', name: 'Karthik Raj', level: 1 }, { id: 'm3', name: 'Divya S', level: 1 },
  { id: 'm4', name: 'Arun Kumar', level: 2 }, { id: 'm5', name: 'Meena Iyer', level: 2 }, { id: 'm6', name: 'Rahul Dev', level: 2 },
  { id: 'm7', name: 'Suresh Babu', level: 3 }, { id: 'm8', name: 'Anita Verma', level: 3 },
]
export const USERS = [
  { name: 'Alex James', email: 'alexjames@company.com' },
  { name: 'John Parker', email: 'johnparker@company.com' },
  { name: 'Andrew Watt', email: 'andrewwatt@company.com' },
  { name: 'Caroline Parker', email: 'carolineparker@company.com' },
  { name: 'Martin James', email: 'martinjames@company.com' },
  { name: 'Helen Killer', email: 'helenkiller@company.com' },
]
export const CATEGORIES = ['Login & Access', 'Payment & Billing', 'Workspace', 'PIM Project', 'AIM Project', 'Library', 'App Permission', 'Performance']
export const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Critical']
export const STATUSES: Status[] = ['Open', 'On going', 'Escalation Pending', 'Needs Super Admin', 'Resolved', 'Closed']
export const PRI_RANK: Record<Priority, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 }
export const TRIAGE_SLA_H = 2
export const CAPACITY = 5
export const rules = { auto: true, notify: true, override: false }

export const db = { tickets: [] as Ticket[], seq: 1000, mseq: 8 }

export const lvl = (id: number) => LEVELS.find((l) => l.id === id)
export const mem = (id: string | null) => MEMBERS.find((m) => m.id === id)
export const get = (id: string) => db.tickets.find((t) => t.id === id)
export const maxLevel = () => LEVELS[LEVELS.length - 1].id
export const levelExists = (id: number) => LEVELS.some((l) => l.id === id)

/* colour for any level (first three use the blue palette, the rest are generated) */
export function lvlColor(id: number) {
  if (id === 0) return { bg: '#334155', fg: '#fff' }
  const i = LEVELS.findIndex((l) => l.id === id)
  if (i < 3) return { bg: ['#b8e2fa', '#7fd2fb', '#0284d1'][i], fg: i < 2 ? '#05466b' : '#fff' }
  return { bg: `hsl(${(210 + (i - 3) * 47) % 360} 55% 38%)`, fg: '#fff' }
}

/* ============ PURE HELPERS ============ */
export const fmt = (ts: number) => {
  const d = new Date(ts)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}
export const statusClass = (s: Status) => ({ 'Open': 's-open', 'On going': 's-going', 'Escalation Pending': 's-esc', 'Needs Super Admin': 's-sa', 'Resolved': 's-res', 'Closed': 's-closed' }[s])
export const isActive = (t: Ticket) => !['Resolved', 'Closed'].includes(t.status)
export const initials = (n: string) => n.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
export const canAssign = (t: Ticket) => ['Open', 'Escalation Pending', 'Needs Super Admin'].includes(t.status)
/* next level in the chain; when the top level has failed the Super Admin may reassign within it */
export const targetLevel = (t: Ticket) => (t.status === 'Needs Super Admin' && !levelExists(t.level + 1) ? t.level : t.level + 1)
export const isBreached = (t: Ticket) => isActive(t) && !!t.dueAt && t.dueAt < Date.now()
export const memberLoad = (id: string) => db.tickets.filter((t) => t.assignee === id && t.status === 'On going').length
export const memberSolved = (id: string) => db.tickets.filter((t) => t.resolvedBy === id).length
export const memberName = (id: string | null) => mem(id)?.name ?? null

export function slaInfo(t: Ticket) {
  if (!t.dueAt || !isActive(t)) return { txt: '-', cls: 'muted' }
  const diff = t.dueAt - Date.now()
  if (diff < 0) return { txt: 'Breached', cls: 'sla-bad' }
  const h = Math.floor(diff / H), m = Math.floor((diff % H) / 60000)
  return { txt: `${h}h ${m}m left`, cls: diff < H ? 'sla-warn' : '' }
}

/* ============ CORE LOGIC (no notifications; wrapped by the actions below) ============ */
function log(t: Ticket, type: string, text: string, by: string, at: number, level?: number) {
  t.history.push({ at, type, text, by, lvl: level || 0 })
}

function createTicketRaw(o: { subject: string; user: string; email: string; cat: string; pri: Priority; desc?: string }, at = Date.now()) {
  const t: Ticket = {
    id: 'TKT-' + (++db.seq), subject: o.subject, user: o.user, email: o.email, cat: o.cat, pri: o.pri, desc: o.desc || '',
    status: 'Open', level: 0, assignee: null, createdAt: at, assignedAt: null, dueAt: at + TRIAGE_SLA_H * H,
    resolvedAt: null, resolvedLevel: null, resolvedBy: null, history: [], notes: [],
  }
  log(t, 'received', 'Ticket received. Waiting for Super Admin to assign to Level 1.', o.user, at)
  db.tickets.push(t)
  return t
}

function assignRaw(id: string, mid: string, at = Date.now(), by = 'Super Admin'): Result {
  const t = get(id), m = mem(mid)
  if (!t || !m) return { ok: false, msg: 'Invalid ticket or member.' }
  if (!canAssign(t)) return { ok: false, msg: t.id + ' cannot be assigned in its current state.' }
  const target = targetLevel(t)
  if (!rules.override && m.level !== target) return { ok: false, msg: `Hierarchy rule: ${t.id} must be assigned to Level ${target} next.` }
  const L = lvl(m.level)!
  t.level = m.level; t.assignee = m.id; t.status = 'On going'; t.assignedAt = at
  t.dueAt = at + L.sla * H
  log(t, 'assigned', `Assigned to ${m.name} (Level ${m.level} - ${L.name}).`, by, at, m.level)
  return { ok: true }
}

function cantResolveRaw(id: string, reason: string, at = Date.now(), by?: string): Result {
  const t = get(id)
  if (!t || t.status !== 'On going') return { ok: false, msg: 'Only on-going tickets can be returned.' }
  const m = mem(t.assignee), L = t.level, last = !levelExists(L + 1)
  t.status = last ? 'Needs Super Admin' : 'Escalation Pending'
  t.assignee = null; t.dueAt = at + TRIAGE_SLA_H * H
  log(t, 'failed', `Level ${L} (${m ? m.name : 'team'}) could not resolve: ${reason || 'no reason given'}. ` +
    (last ? 'Returned to Super Admin for final handling.' : `Returned to Super Admin for assignment to Level ${L + 1}.`), by || (m ? m.name : 'System'), at, L)
  return { ok: true }
}

function resolveRaw(id: string, viaTeam: boolean, at = Date.now()): Result {
  const t = get(id)
  if (!t || ['Resolved', 'Closed'].includes(t.status)) return { ok: false, msg: 'Ticket already finished.' }
  const m = mem(t.assignee)
  t.resolvedAt = at; t.dueAt = null; t.status = 'Resolved'
  t.resolvedLevel = viaTeam ? t.level : 0; t.resolvedBy = viaTeam && m ? m.id : null
  log(t, 'resolved', viaTeam && m ? `Resolved by ${m.name} (Level ${t.level}).` : 'Resolved by Super Admin.', viaTeam && m ? m.name : 'Super Admin', at, t.resolvedLevel)
  if (!viaTeam) t.assignee = null
  return { ok: true }
}

function closeRaw(id: string, at = Date.now()): Result {
  const t = get(id)
  if (!t) return { ok: false }
  if (t.status !== 'Resolved') { t.resolvedAt = t.resolvedAt || at; if (t.resolvedLevel == null) t.resolvedLevel = 0 }
  t.status = 'Closed'; t.dueAt = null
  log(t, 'closed', 'Ticket closed by Super Admin.', 'Super Admin', at)
  return { ok: true }
}

function reopenRaw(id: string, at = Date.now()): Result {
  const t = get(id)
  if (!t) return { ok: false }
  t.status = 'Open'; t.level = 0; t.assignee = null; t.resolvedAt = null; t.resolvedLevel = null; t.resolvedBy = null
  t.dueAt = at + TRIAGE_SLA_H * H
  log(t, 'received', 'Ticket reopened. Hierarchy restarted from Level 1.', 'Super Admin', at)
  return { ok: true }
}

/* Auto-flag SLA breaches so the Super Admin can reassign to the next level */
function slaTick() {
  if (!rules.auto) return
  db.tickets.filter((t) => t.status === 'On going' && t.dueAt && t.dueAt < Date.now()).forEach((t) => {
    cantResolveRaw(t.id, 'SLA breached (auto-flagged)', Date.now(), 'System')
  })
}

/* ============ SEED DATA ============ */
;(function seed() {
  const reasons = ['Needs deeper investigation', 'Requires server-side access', 'Outside our knowledge scope', 'Bug in application code']
  const subs = ['Unable to reset password', 'Invoice not generated', 'Workspace invite failing', 'PIM report shows wrong totals', 'AIM export timing out',
    'Library upload stuck', 'Permission toggle not saving', 'Dashboard loads slowly', 'Duplicate payment charged', 'Cannot switch workspace']
  const pris: Priority[] = ['Low', 'Medium', 'High', 'Critical', 'Medium', 'Low']
  const finals = [1, 1, 2, 1, 3, 2, 1, 2, 0, 1, 2, 3, 1, 1, 2]
  for (let i = 0; i < 34; i++) {
    let at = NOW - (6 + i * 4.6) * D
    const u = USERS[i % USERS.length], L = finals[i % finals.length]
    const t = createTicketRaw({ subject: subs[i % subs.length], user: u.name, email: u.email, cat: CATEGORIES[i % CATEGORIES.length], pri: pris[i % pris.length], desc: 'Reported by user via support form.' }, at)
    const top = L === 0 ? 3 : L
    for (let l = 1; l <= top; l++) {
      at += H
      const pool = MEMBERS.filter((m) => m.level === l)
      assignRaw(t.id, pool[(i + l) % pool.length].id, at); at += 2 * H
      if (l < top || L === 0) cantResolveRaw(t.id, reasons[(i + l) % reasons.length], at)
    }
    at += H; resolveRaw(t.id, L !== 0, at)
    if (i % 2 === 0) closeRaw(t.id, at + D)
  }
  const mk = (s: string, u: number, c: string, p: Priority, d: string, hAgo: number) =>
    createTicketRaw({ subject: s, user: USERS[u].name, email: USERS[u].email, cat: c, pri: p, desc: d }, NOW - hAgo * H)
  mk('Unable to login to workspace', 0, 'Login & Access', 'High', 'User gets "invalid session" after entering the correct password.', 0.4)
  mk('Payment deducted but plan not upgraded', 1, 'Payment & Billing', 'Critical', 'UPI payment of 12,500 deducted, plan still shows PIM only.', 1.1)
  mk('Cannot invite team member to workspace', 2, 'Workspace', 'Medium', 'Invite email is never delivered.', 0.8)
  let t = mk('AIM project export fails', 3, 'AIM Project', 'Medium', 'Export to CSV returns an empty file.', 3)
  assignRaw(t.id, 'm1', NOW - 1 * H)
  t = mk('Library files not loading', 4, 'Library', 'High', 'Thumbnails never render in the Library tab.', 6)
  assignRaw(t.id, 'm2', NOW - 4 * H); cantResolveRaw(t.id, 'Needs deeper investigation', NOW - 0.7 * H)
  t = mk('Resource permission error', 5, 'App Permission', 'Medium', 'Resource page shows 403 for admins.', 10)
  assignRaw(t.id, 'm3', NOW - 8 * H); cantResolveRaw(t.id, 'Outside our knowledge scope', NOW - 6 * H); assignRaw(t.id, 'm4', NOW - 2.5 * H)
  t = mk('App permission toggle not saving', 0, 'App Permission', 'High', 'Switch resets after refresh.', 20)
  assignRaw(t.id, 'm1', NOW - 18 * H); cantResolveRaw(t.id, 'Needs deeper investigation', NOW - 15 * H)
  assignRaw(t.id, 'm5', NOW - 14 * H); cantResolveRaw(t.id, 'Requires server-side access', NOW - 0.5 * H)
  t = mk('PIM data sync mismatch', 1, 'PIM Project', 'Critical', 'Totals differ between PIM dashboard and exports.', 30)
  assignRaw(t.id, 'm2', NOW - 28 * H); cantResolveRaw(t.id, 'Needs deeper investigation', NOW - 26 * H)
  assignRaw(t.id, 'm6', NOW - 24 * H); cantResolveRaw(t.id, 'Bug in application code', NOW - 20 * H); assignRaw(t.id, 'm7', NOW - 3 * H)
  t = mk('Report generation times out', 2, 'Performance', 'Critical', 'Monthly report never finishes for large workspaces.', 50)
  assignRaw(t.id, 'm3', NOW - 48 * H); cantResolveRaw(t.id, 'Outside our knowledge scope', NOW - 44 * H)
  assignRaw(t.id, 'm4', NOW - 40 * H); cantResolveRaw(t.id, 'Requires server-side access', NOW - 34 * H)
  assignRaw(t.id, 'm8', NOW - 30 * H); cantResolveRaw(t.id, 'Database level optimisation needed', NOW - 1.4 * H)
  t = mk('Invoice GST details missing', 3, 'Payment & Billing', 'Low', 'GST number not printed on invoice.', 16)
  assignRaw(t.id, 'm1', NOW - 14 * H); resolveRaw(t.id, true, NOW - 9 * H)
  slaTick()
})()

/* ============ UI STATE (kept in the store so it survives route changes, like the HTML's single page) ============ */
export const TABS: [TabKey, string, (t: Ticket) => boolean][] = [
  ['all', 'All', () => true],
  ['open', 'Unassigned', (t) => t.status === 'Open'],
  ['esc', 'Escalation Queue', (t) => ['Escalation Pending', 'Needs Super Admin'].includes(t.status)],
  ['going', 'In Progress', (t) => t.status === 'On going'],
  ['done', 'Resolved / Closed', (t) => !isActive(t)],
]
export const SORTS: [SortKey, string][] = [['new', 'Newest first'], ['old', 'Oldest first'], ['pri', 'Highest priority'], ['sla', 'SLA urgency']]

export const ui = {
  list: {
    tab: 'all' as TabKey, q: '', from: '', to: '', status: '', pri: '', level: '', cat: '',
    sort: 'new' as SortKey, page: 1, per: 6, sel: new Set<string>(), filtersOn: true,
  },
  team: { lvl: 'all', q: '', sort: 'name', page: 1, per: 8 },
  open: null as string | null,
  toasts: [] as { id: number; msg: string; err: boolean }[],
}

export function filtered() {
  const L = ui.list
  const tab = TABS.find((x) => x[0] === L.tab)![2]
  const q = L.q.trim().toLowerCase()
  const from = L.from ? new Date(L.from + 'T00:00:00').getTime() : null
  const to = L.to ? new Date(L.to + 'T23:59:59').getTime() : null
  const list = db.tickets.filter((t) => tab(t)
    && (!q || [t.id, t.subject, t.user, t.email, t.cat, memberName(t.assignee) || ''].join(' ').toLowerCase().includes(q))
    && (!from || t.createdAt >= from) && (!to || t.createdAt <= to)
    && (!L.status || t.status === L.status) && (!L.pri || t.pri === L.pri)
    && (L.level === '' || String(t.level) === L.level) && (!L.cat || t.cat === L.cat))
  const s = L.sort
  list.sort((a, b) => s === 'old' ? a.createdAt - b.createdAt
    : s === 'pri' ? (PRI_RANK[b.pri] - PRI_RANK[a.pri]) || (b.createdAt - a.createdAt)
    : s === 'sla' ? ((a.dueAt && isActive(a) ? a.dueAt : Infinity) - (b.dueAt && isActive(b) ? b.dueAt : Infinity))
    : b.createdAt - a.createdAt)
  return list
}

/* ============ SUBSCRIPTION ============ */
let version = 0
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | undefined
function emit() { version++; listeners.forEach((l) => l()) }
function subscribe(l: () => void) {
  listeners.add(l)
  if (!timer) timer = setInterval(() => { slaTick(); emit() }, 60000)
  return () => {
    listeners.delete(l)
    if (!listeners.size && timer) { clearInterval(timer); timer = undefined }
  }
}
/** Call once in every screen: re-renders it whenever tickets / settings / UI state change. */
export function useTicketStore() { useSyncExternalStore(subscribe, () => version) }

/** Patch state and re-render (for filters, tabs, paging, selection...). */
export function touch(fn?: () => void) { fn?.(); emit() }

/* ============ ACTIONS (same messages / behaviour as the HTML) ============ */
export function toast(msg: string, err = false) {
  const id = Date.now() + Math.random()
  ui.toasts.push({ id, msg, err })
  emit()
  setTimeout(() => { ui.toasts = ui.toasts.filter((x) => x.id !== id); emit() }, 3200)
}
function afterAction(res: Result, okMsg: string) {
  if (res.ok) toast(okMsg); else toast(res.msg || 'Action failed', true)
  slaTick(); emit()
}

export const openTicket = (id: string) => touch(() => { ui.open = id })
export const closeTicketModal = () => touch(() => { ui.open = null })

export const actAssign = (id: string, mid: string) => afterAction(assignRaw(id, mid), 'Ticket assigned.')
export function actBulkAssign(mid: string) {
  let ok = 0, skipped = 0
  ;[...ui.list.sel].forEach((id) => { const r = assignRaw(id, mid); if (r.ok) ok++; else skipped++ })
  ui.list.sel.clear()
  toast(`${ok} assigned` + (skipped ? `, ${skipped} skipped (wrong hierarchy level or state)` : '.'), !ok)
  slaTick(); emit()
}
export function actCantResolve(id: string, reason: string) {
  const res = cantResolveRaw(id, reason || 'Needs deeper investigation')
  afterAction(res, 'Returned to Super Admin. Assign it to the next level.')
  if (res.ok && rules.notify) toast('Escalation alert: ' + id + ' needs reassignment.')
}
export const actTeamResolve = (id: string) => afterAction(resolveRaw(id, true), 'Ticket resolved by the team.')
export const actSaResolve = (id: string) => afterAction(resolveRaw(id, false), 'Resolved as Super Admin.')
export const actClose = (id: string) => afterAction(closeRaw(id), 'Ticket closed.')
export const actReopen = (id: string) => afterAction(reopenRaw(id), 'Ticket reopened.')
export function actAddNote(id: string, text: string) {
  const t = get(id)
  if (!t) return false
  if (!text) { toast('Write a note first.', true); return false }
  t.notes.push({ text, at: Date.now() })
  log(t, 'note', 'Internal note added.', 'Super Admin', Date.now())
  toast('Note added.')
  return true
}
export function actSetPriority(id: string, pri: Priority) {
  const t = get(id)
  if (!t) return
  log(t, 'priority', `Priority changed ${t.pri} to ${pri}.`, 'Super Admin', Date.now())
  t.pri = pri
  toast('Priority updated.'); slaTick(); emit()
}
export function actCreate(o: { subject: string; userIndex: number; cat: string; pri: Priority; desc: string }) {
  const s = o.subject.trim()
  if (!s) { toast('Subject is required.', true); return false }
  const u = USERS[o.userIndex]
  const t = createTicketRaw({ subject: s, user: u.name, email: u.email, cat: o.cat, pri: o.pri, desc: o.desc.trim() })
  ui.list.tab = 'open'; ui.list.page = 1
  toast(t.id + ' received. Assign it to Level 1.')
  slaTick(); emit()
  return true
}
export function actAddLevel(name: string, tag: string, sla: number) {
  const n = name.trim()
  if (!n) { toast('Level name is required.', true); return false }
  const id = maxLevel() + 1
  LEVELS.push({ id, name: n, tag: tag.trim() || n, sla: Math.max(1, sla || 12) })
  ui.team.lvl = String(id); ui.team.page = 1
  toast(`Level ${id} added. Add members to it so tickets can be assigned.`)
  slaTick(); emit()
  return true
}
export function actAddMember(name: string, level: number) {
  const n = name.trim()
  if (!n) { toast('Name is required.', true); return false }
  MEMBERS.push({ id: 'm' + (++db.mseq), name: n, level })
  ui.team.page = 1
  toast(n + ' added.')
  slaTick(); emit()
  return true
}
export function actSetSla(levelId: number, hours: number) {
  const L = lvl(levelId)
  if (L) L.sla = Math.max(1, hours || 1)
  toast('SLA updated for new assignments.'); emit()
}
export function actSetRule(key: keyof typeof rules, on: boolean) {
  rules[key] = on
  toast('Rule updated.')
  if (key === 'auto') slaTick()
  emit()
}
export function exportCSV() {
  const rows = filtered()
  const head = ['Ticket ID', 'Subject', 'User', 'Email', 'Category', 'Priority', 'Level', 'Assigned To', 'Status', 'Created']
  const q = (v: unknown) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'
  const csv = [head, ...rows.map((t) => [t.id, t.subject, t.user, t.email, t.cat, t.pri, t.level || '', memberName(t.assignee) || '', t.status, new Date(t.createdAt).toISOString()])]
    .map((r) => r.map(q).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  const a = document.createElement('a'); a.href = url; a.download = 'tickets.csv'; a.click()
  URL.revokeObjectURL(url)
  toast(rows.length + ' tickets exported.')
}
