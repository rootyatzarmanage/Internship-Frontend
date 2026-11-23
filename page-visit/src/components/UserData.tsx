import type { TableColumns } from './tableConfig'

export type VisitInput = {
  ipAddress: string; pageUrl: string; country: string; region: string; city: string
  viewedAt: string; user: { name: string; role?: string }
}
export type UserRow = {
  sNo: number; ipAddress: string; users: string; roles: string; totalVisits: number
  pagesVisited: string; uniquePages: number; rolePages: string; locations: string
  pageLocations: string; lastSeen: string
}

const CBE = { country: 'India', region: 'Tamil Nadu', city: 'Coimbatore' }
const CHE = { country: 'India', region: 'Tamil Nadu', city: 'Chennai' }
const g = { name: 'Guest', role: 'Guest' }
const sa = { name: 'mthiru90252', role: 'Super Admin' }
export const userVisitsMock: VisitInput[] = [
  { ipAddress: '49.206.115.202', pageUrl: '/super-admin', ...CBE, viewedAt: '2026-11-23T11:02:00+05:30', user: sa },
  { ipAddress: '49.206.115.202', pageUrl: '/pricing', ...CBE, viewedAt: '2026-11-23T10:58:00+05:30', user: g },
  { ipAddress: '49.206.115.202', pageUrl: '/pricing', ...CBE, viewedAt: '2026-11-23T10:50:00+05:30', user: g },
  { ipAddress: '49.206.112.110', pageUrl: '/', ...CBE, viewedAt: '2026-11-23T10:12:00+05:30', user: g },
  { ipAddress: '49.206.112.110', pageUrl: '/', ...CHE, viewedAt: '2026-11-22T06:50:00+05:30', user: g },
  { ipAddress: '161.115.235.25', pageUrl: '/', country: 'United States', region: 'California', city: 'Los Angeles', viewedAt: '2026-11-22T09:01:00+05:30', user: g },
]

// ---- group visits by IP ----
type C = Map<string, number>
const bump = (m: C, k: string) => m.set(k, (m.get(k) ?? 0) + 1)
const fmt = (m: C, sep = ', ') => [...m].map(([k, n]) => `${k} (${n})`).join(sep)
const sub = (m: Map<string, C>, k: string): C => m.get(k) ?? m.set(k, new Map()).get(k)!

export function aggregateUserAnalytics(visits: VisitInput[]): UserRow[] {
  const sorted = [...visits].sort((a, b) => +new Date(b.viewedAt) - +new Date(a.viewedAt))
  const map = new Map<string, any>()
  for (const v of sorted) {
    const role = v.user.role ?? 'Unknown'
    const loc = [v.city, v.region, v.country].filter(Boolean).join(', ')
    const a = map.get(v.ipAddress) ?? { users: new Set(), roles: new Map(), pages: new Map(), locs: new Map(),
      rolePages: new Map(), pageLocs: new Map(), total: 0, last: v.viewedAt }
    map.set(v.ipAddress, a)
    a.total++; a.users.add(v.user.name)
    bump(a.roles, role); bump(a.pages, v.pageUrl); bump(a.locs, loc)
    bump(sub(a.rolePages, role), v.pageUrl); bump(sub(a.pageLocs, v.pageUrl), loc)
  }
  return [...map].map(([ip, a], i) => ({
    sNo: i + 1, ipAddress: ip, users: [...a.users].join(', '), roles: fmt(a.roles),
    totalVisits: a.total, pagesVisited: fmt(a.pages), uniquePages: a.pages.size,
    rolePages: [...a.rolePages].map(([r, p]: any) => `${r}: ${fmt(p)}`).join(' | '),
    locations: fmt(a.locs, '; '),
    pageLocations: [...a.pageLocs].map(([p, l]: any) => `${p}: ${fmt(l, '; ')}`).join(' | '),
    lastSeen: a.last,
  }))
}

// ---- columns (4 visible by default, rest in the Columns menu) ----
export const USER_DEFAULT_COLUMN_IDS = ['ipAddress', 'roles', 'totalVisits', 'pagesVisited']
const text = ({ getValue }: { getValue: () => unknown }) => {
  const v = String(getValue() ?? '')
  return <span title={v}>{v}</span>
}
const date = ({ getValue }: { getValue: () => unknown }) =>
  new Date(String(getValue())).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const col = (id: keyof UserRow, header: string, size: number, cell = text) =>
  ({ id, accessorKey: id, header, size, cell })

export const userColumns = [
  col('sNo', 'S.No', 80), col('ipAddress', 'IP Address', 160), col('users', 'Users', 200),
  col('roles', 'Roles', 240), col('totalVisits', 'Total Visits', 130), col('pagesVisited', 'Pages Visited', 320),
  col('uniquePages', 'Unique Pages', 130), col('rolePages', 'Pages by Role', 380),
  col('locations', 'Locations', 380), col('pageLocations', 'Page Locations', 420),
  col('lastSeen', 'Last Seen', 190, date),
] as TableColumns<UserRow>
