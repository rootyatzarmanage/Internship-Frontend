import { useEffect, useMemo, useRef, useState } from 'react'
import Chart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'

/* =========================================================
   ACTIVITY SECTION — heat map + activity log
   Usage: <ActivitySection />  (e.g. at the end of Analytics)
   ========================================================= */

type ActivityType = 'Projects' | 'Meetings' | 'Workspaces'
type ActivityFilter = 'All' | ActivityType

const ACTIVITY_TABS: ActivityFilter[] = [
  'All',
  'Projects',
  'Meetings',
  'Workspaces',
]

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_FULL = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

/* ---------- theme hook (follows the `dark` class on <html>) ---------- */

function useIsDark() {
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    const el = document.documentElement
    const observer = new MutationObserver(() =>
      setIsDark(el.classList.contains('dark'))
    )
    observer.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return isDark
}

/* ---------- mock data (move to ../../mock/analyticsMock when ready) ---------- */

type DailyActivity = {
  date: Date
  counts: Record<ActivityType, number>
}

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// 26 weeks, starting on a Sunday, ending today
function buildDailyActivity(weeks = 26): DailyActivity[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const start = new Date(today)
  start.setDate(today.getDate() - today.getDay() - (weeks - 1) * 7)

  const rand = mulberry32(42)
  const days: DailyActivity[] = []

  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const isWeekday = d.getDay() !== 0 && d.getDay() !== 6
    const max = isWeekday ? 4 : 2

    days.push({
      date: new Date(d),
      counts: {
        Projects: Math.floor(rand() * max),
        Meetings: Math.floor(rand() * max),
        Workspaces: Math.floor(rand() * max),
      },
    })
  }

  return days
}

const activityDailyMock = buildDailyActivity()

type ActivityLogItem = {
  id: number
  group: 'Today' | 'Yesterday'
  user: string
  initials: string
  avatarClass: string
  action: string
  target: string
  time: string
  type: ActivityType
}

const activityLogMock: ActivityLogItem[] = [
  { id: 1, group: 'Today', user: 'Thiru', initials: 'TH', avatarClass: 'bg-blue-500', action: 'created project', target: 'Metro Block A', time: '10 min ago', type: 'Projects' },
  { id: 2, group: 'Today', user: 'Arun K', initials: 'AK', avatarClass: 'bg-red-500', action: 'closed meeting', target: 'Meeting 02', time: '1 hr ago', type: 'Meetings' },
  { id: 3, group: 'Today', user: 'Priya S', initials: 'PS', avatarClass: 'bg-neutral-800 dark:bg-neutral-700', action: 'added 3 members to', target: 'Workspace Alpha', time: '3 hrs ago', type: 'Workspaces' },
  { id: 4, group: 'Yesterday', user: 'Thiru', initials: 'TH', avatarClass: 'bg-blue-500', action: 'uploaded model to', target: 'PSG-Y-Block', time: '4:12 pm', type: 'Projects' },
  { id: 5, group: 'Yesterday', user: 'Meera R', initials: 'MR', avatarClass: 'bg-emerald-500', action: 'scheduled meeting', target: 'm2', time: '11:20 am', type: 'Meetings' },
  { id: 6, group: 'Yesterday', user: 'Arun K', initials: 'AK', avatarClass: 'bg-red-500', action: 'renamed workspace to', target: 'Workspace Beta', time: '9:05 am', type: 'Workspaces' },
]

const activityBadgeClass: Record<ActivityType, string> = {
  Projects: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
  Meetings: 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400',
  Workspaces:
    'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
}

/* ---------- small shared pieces ---------- */

const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`

function NewBadge() {
  return (
    <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-600 dark:bg-sky-500/15 dark:text-sky-400">
      New
    </span>
  )
}


type ActivityTabsProps = {
  value: ActivityFilter
  onChange: (value: ActivityFilter) => void
}

function ActivityTabs({ value, onChange }: ActivityTabsProps) {
  return (
    <div
      role="tablist"
      className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-[8px] border border-[#E5E5E5] bg-gray-100 p-1 dark:border-neutral-800 dark:bg-neutral-800/60"
    >
      {ACTIVITY_TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={tab === value}
          onClick={() => onChange(tab)}
          className={`whitespace-nowrap cursor-pointer rounded-[6px] px-3 py-1 text-[13px] font-medium transition-colors ${
            tab === value
              ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-950 dark:text-white'
              : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

/* =========================================================
   ACTIVITY HEAT MAP
   ========================================================= */

const MIN_CELL = 22 // below this the heat map scrolls sideways instead of shrinking
const MAX_CELL_HEIGHT = 36 // keeps rows from getting too tall on wide screens
const Y_AXIS_WIDTH = 36 // room for the Mon / Wed / Fri labels
const X_AXIS_HEIGHT = 30 // room for the month labels

function ActivityHeatmap() {
  const isDark = useIsDark()
  const [filter, setFilter] = useState<ActivityFilter>('All')

  // measure the available width so the chart can fill it
  const wrapRef = useRef<HTMLDivElement>(null)
  const [wrapWidth, setWrapWidth] = useState(0)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    setWrapWidth(el.clientWidth)
    const observer = new ResizeObserver(([entry]) =>
      setWrapWidth(entry.contentRect.width)
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // 1) daily totals for the selected tab
  const days = useMemo(
    () =>
      activityDailyMock.map((d) => ({
        date: d.date,
        count:
          filter === 'All'
            ? d.counts.Projects + d.counts.Meetings + d.counts.Workspaces
            : d.counts[filter],
      })),
    [filter]
  )

  // 2) stat cards
  const stats = useMemo(() => {
    const total = days.reduce((sum, d) => sum + d.count, 0)

    const byWeekday = Array<number>(7).fill(0)
    days.forEach((d) => {
      byWeekday[d.date.getDay()] += d.count
    })
    const busiestIndex = byWeekday.indexOf(Math.max(...byWeekday))

    let streak = 0
    let longest = 0
    days.forEach((d) => {
      if (d.count > 0) {
        streak += 1
        longest = Math.max(longest, streak)
      } else {
        streak = 0
      }
    })

    return {
      total,
      busiest: total > 0 ? DAY_FULL[busiestIndex] : '—',
      longest,
    }
  }, [days])

  // 3) chart series: one series per weekday, one point per week
  const weekCount = Math.ceil(days.length / 7)

  const series = useMemo(() => {
    const rows = DAY_SHORT.map((name, dow) => ({
      name,
      data: Array.from({ length: weekCount }, (_, week) => ({
        x: toISO(days[week * 7].date), // week start (Sunday)
        y: (days[week * 7 + dow]?.count ?? null) as number | null,
      })),
    }))

    // Apex draws the first series at the bottom -> reverse so Sun is on top
    return rows.reverse()
  }, [days, weekCount])

  const firstWeek = toISO(days[0].date)

  // 4) theme colours (Apex needs real colour strings, not CSS vars)
  const palette = isDark
    ? {
        empty: '#262626',
        levels: ['#0c4a6e', '#0369a1', '#0ea5e9', '#7dd3fc'],
        gap: '#171717', // neutral-900 card background
        tooltipBg: '#262626',
        tooltipText: '#f3f4f6',
      }
    : {
        empty: '#EDEDED',
        levels: ['#bde8ff', '#67c8ff', '#00a3f5', '#032b49'],
        gap: '#ffffff',
        tooltipBg: '#111827',
        tooltipText: '#ffffff',
      }

  const max = Math.max(4, ...days.map((d) => d.count))
  const t1 = Math.ceil(max * 0.25)
  const t2 = Math.ceil(max * 0.5)
  const t3 = Math.ceil(max * 0.75)

  const options: ApexOptions = {
    chart: {
      type: 'heatmap',
      toolbar: { show: false },
      fontFamily: 'inherit',
      foreColor: isDark ? '#9ca3af' : '#6b7280',
      parentHeightOffset: 0,
      animations: { enabled: false },
    },

    plotOptions: {
      heatmap: {
        radius: 5,
        enableShades: false,
        useFillColorAsStroke: false,
        colorScale: {
          ranges: [
            { from: 0, to: 0, color: palette.empty, name: 'None' },
            { from: 1, to: t1, color: palette.levels[0], name: 'Low' },
            { from: t1 + 1, to: t2, color: palette.levels[1], name: 'Medium' },
            { from: t2 + 1, to: t3, color: palette.levels[2], name: 'High' },
            { from: t3 + 1, to: max, color: palette.levels[3], name: 'Max' },
          ],
        },
      },
    },

    // the stroke acts as the gap between cells
    stroke: { show: true, width: 3, colors: [palette.gap] },

    dataLabels: { enabled: false },
    legend: { show: false },

    grid: { padding: { left: 0, right: 0, top: 0, bottom: 0 } },

    xaxis: {
      type: 'category',
      position: 'top',
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
      labels: {
        rotate: 0,
        rotateAlways: false,
        hideOverlappingLabels: false,
        trim: false,
        style: { fontSize: '12px' },
        // only label the first week of each month
        formatter: (value: string) => {
          const date = new Date(`${value}T00:00:00`)
          if (Number.isNaN(date.getTime())) return ''
          if (value === firstWeek || date.getDate() <= 7) {
            return date.toLocaleString('en-US', { month: 'short' })
          }
          return ''
        },
      },
    },

    yaxis: {
      labels: {
        style: { fontSize: '12px' },
        // only label Mon / Wed / Fri
        formatter: (value: number) => {
          const name = String(value)
          return ['Mon', 'Wed', 'Fri'].includes(name) ? name : ''
        },
      },
    },

    tooltip: {
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const point = w.config.series?.[seriesIndex]?.data?.[dataPointIndex]
        if (!point || point.y === null || point.y === undefined) return ''

        // series are reversed, so weekday = 6 - seriesIndex
        const date = new Date(`${point.x}T00:00:00`)
        date.setDate(date.getDate() + (6 - seriesIndex))

        const label = date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })

        return `<div style="padding:6px 10px;font-size:12px;border-radius:6px;background:${palette.tooltipBg};color:${palette.tooltipText}">
          <strong>${point.y}</strong> ${point.y === 1 ? 'activity' : 'activities'} · ${label}
        </div>`
      },
    },

    states: { hover: { filter: { type: 'none' } } },
  }

  // cell width that makes the chart exactly fill the container
  const fitCell = Math.floor((wrapWidth - Y_AXIS_WIDTH) / weekCount)
  const cellWidth = Math.max(MIN_CELL, fitCell || MIN_CELL)
  const cellHeight = Math.min(cellWidth, MAX_CELL_HEIGHT)

  const chartWidth = weekCount * cellWidth + Y_AXIS_WIDTH
  const chartHeight = 7 * cellHeight + X_AXIS_HEIGHT

  const statCards = [
    { label: 'Total activities', value: stats.total.toLocaleString('en-IN') },
    { label: 'Busiest day', value: stats.busiest },
    {
      label: 'Longest streak',
      value: `${stats.longest} ${stats.longest === 1 ? 'day' : 'days'}`,
    },
  ]

  const legendColors = [palette.empty, ...palette.levels]

  return (
    <div className="flex w-full min-w-0 flex-col gap-5 rounded-[8px] border border-[#d4d4d4] bg-white p-6 transition-colors duration-200 dark:border-neutral-800 dark:bg-neutral-900">
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[20px] font-semibold text-gray-900 dark:text-gray-100">
              Activity heat map
            </h3>
            <NewBadge />
          </div>

          <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
            How active your team has been each day
          </p>
        </div>

        <div className="flex max-w-full items-center gap-1">
          <ActivityTabs value={filter} onChange={setFilter} />
        </div>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {statCards.map((item) => (
          <div
            key={item.label}
            className="rounded-[8px] bg-[#F5F5F5] px-4 py-3 dark:bg-neutral-800"
          >
            <p className="text-[12px] text-gray-500 dark:text-gray-400">
              {item.label}
            </p>
            <p className="mt-1 text-[20px] font-bold leading-tight text-gray-900 dark:text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* heat map (fills the card, scrolls sideways only when too narrow) */}
      <div
        ref={wrapRef}
        className="w-full overflow-x-auto overflow-y-hidden [scrollbar-width:thin]"
      >
        <div style={{ width: chartWidth, height: chartHeight }}>
          <Chart
            key={isDark ? 'dark' : 'light'}
            options={options}
            series={series}
            type="heatmap"
            width={chartWidth}
            height={chartHeight}
          />
        </div>
      </div>

      {/* footer */}
      <div className="flex items-center justify-between text-[12px] text-gray-500 dark:text-gray-400">
        <span>Last 6 months</span>

        <div className="flex items-center gap-1.5">
          <span>Less</span>
          {legendColors.map((color) => (
            <span
              key={color}
              className="h-3.5 w-3.5 rounded-[4px]"
              style={{ backgroundColor: color }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   ACTIVITY LOG
   ========================================================= */

function ActivityLog() {
  const [filter, setFilter] = useState<ActivityFilter>('All')

  const items = activityLogMock.filter(
    (item) => filter === 'All' || item.type === filter
  )

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 rounded-[8px] border border-[#d4d4d4] bg-white p-6 transition-colors duration-200 dark:border-neutral-800 dark:bg-neutral-900">
      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[20px] font-semibold text-gray-900 dark:text-gray-100">
              Activity log
            </h3>
            <NewBadge />
          </div>

          <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
            Latest changes across your workspaces
          </p>
        </div>
      </div>

      <div>
        <ActivityTabs value={filter} onChange={setFilter} />
      </div>

      {/* list */}
      <div className="max-h-[360px] min-h-[240px] flex-1 basis-0 overflow-y-auto pr-1 [scrollbar-width:thin] lg:max-h-none">
        {items.map((item, index) => {
          const showGroup = index === 0 || items[index - 1].group !== item.group

          return (
            <div key={item.id}>
              {showGroup && (
                <p className="pb-1 pt-2 text-[12px] text-gray-500 dark:text-gray-400">
                  {item.group}
                </p>
              )}

              <div className="flex items-center gap-3 border-b border-[#EEEEEE] py-3 last:border-b-0 dark:border-neutral-800">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white ${item.avatarClass}`}
                >
                  {item.initials}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-[14px] text-gray-600 dark:text-gray-300">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {item.user}
                    </span>{' '}
                    {item.action}{' '}
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {item.target}
                    </span>
                  </p>

                  <p className="mt-0.5 text-[12px] text-gray-500 dark:text-gray-400">
                    {item.time}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-medium ${activityBadgeClass[item.type]}`}
                >
                  {item.type}
                </span>
              </div>
            </div>
          )
        })}

        {items.length === 0 && (
          <p className="py-6 text-center text-[13px] text-gray-400">
            No activity found.
          </p>
        )}
      </div>

      <button
        type="button"
        className="w-full rounded-[8px] cursor-pointer border border-[#D4D4D4] py-2.5 text-[13px] font-semibold text-gray-800 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-gray-100 dark:hover:bg-neutral-800"
      >
        See all activity
      </button>
    </div>
  )
}


/* =========================================================
   EXPORT
   ========================================================= */

export default function ActivitySection({
  className = '',
}: {
  className?: string
}) {
  return (
    <div
      className={`grid grid-cols-1 xl:grid-cols-[1.65fr_1fr] gap-5 items-stretch ${className}`}
    >
      <ActivityHeatmap />
      <ActivityLog />
    </div>
  )
}