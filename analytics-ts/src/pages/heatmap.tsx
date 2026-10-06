import { useEffect, useMemo, useRef, useState } from 'react'
import Chart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { useIsDark } from '../features/analytics/dark'
import { buildDailyActivity } from '../features/analytics/dailyActivity'
import type { ActivityFilter } from '../features/analytics/activityTab'
import { ActivityTabs } from '../features/analytics/activityTab'

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

const activityDailyMock = buildDailyActivity()

const MIN_CELL = 22
const MAX_CELL_HEIGHT = 36
const Y_AXIS_WIDTH = 36
const X_AXIS_HEIGHT = 30

export default function ActivitySection({
  className = '',
}: {
  className?: string
}) {
  const isDark = useIsDark()
  const [filter, setFilter] = useState<ActivityFilter>('All')

  const wrapRef = useRef<HTMLDivElement>(null)
  const [wrapWidth, setWrapWidth] = useState(0)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    setWrapWidth(el.clientWidth)

    const observer = new ResizeObserver(([entry]) => {
      setWrapWidth(entry.contentRect.width)
    })

    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  const days = useMemo(
    () =>
      activityDailyMock.map((d) => ({
        date: d.date,
        count:
          filter === 'All'
            ? d.counts.Projects +
              d.counts.Meetings +
              d.counts.Workspaces
            : d.counts[filter],
      })),
    [filter],
  )

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

  const weekCount = Math.ceil(days.length / 7)

  const series = useMemo(() => {
    const rows = DAY_SHORT.map((name, dow) => ({
      name,
      data: Array.from({ length: weekCount }, (_, week) => {
        const date = days[week * 7]?.date

        if (!date) {
          return {
            x: '',
            y: null,
          }
        }

        return {
          x: `${date.getFullYear()}-${String(
            date.getMonth() + 1,
          ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
          y: (days[week * 7 + dow]?.count ?? null) as number | null,
        }
      }),
    }))

    return rows.reverse()
  }, [days, weekCount])

  const firstWeek = (() => {
    const date = days[0]?.date

    if (!date) return ''

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(date.getDate()).padStart(2, '0')}`
  })()

  const palette = isDark
    ? {
        empty: '#262626',
        levels: ['#0c4a6e', '#0369a1', '#0ea5e9', '#7dd3fc'],
        gap: '#171717',
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
            {
              from: 0,
              to: 0,
              color: palette.empty,
              name: 'None',
            },
            {
              from: 1,
              to: t1,
              color: palette.levels[0],
              name: 'Low',
            },
            {
              from: t1 + 1,
              to: t2,
              color: palette.levels[1],
              name: 'Medium',
            },
            {
              from: t2 + 1,
              to: t3,
              color: palette.levels[2],
              name: 'High',
            },
            {
              from: t3 + 1,
              to: max,
              color: palette.levels[3],
              name: 'Max',
            },
          ],
        },
      },
    },
    stroke: {
      show: true,
      width: 3,
      colors: [palette.gap],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
    xaxis: {
      type: 'category',
      position: 'top',
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
      labels: {
        rotate: 0,
        rotateAlways: false,
        hideOverlappingLabels: false,
        trim: false,
        style: {
          fontSize: '12px',
        },
        formatter: (value: string) => {
          const date = new Date(`${value}T00:00:00`)

          if (Number.isNaN(date.getTime())) return ''

          if (value === firstWeek || date.getDate() <= 7) {
            return date.toLocaleString('en-US', {
              month: 'short',
            })
          }

          return ''
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
        },
        formatter: (value: number) => {
          const name = String(value)

          return ['Mon', 'Wed', 'Fri'].includes(name) ? name : ''
        },
      },
    },
    tooltip: {
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const point =
          w.config.series?.[seriesIndex]?.data?.[dataPointIndex]

        if (!point || point.y === null || point.y === undefined) {
          return ''
        }

        const date = new Date(`${point.x}T00:00:00`)
        date.setDate(date.getDate() + (6 - seriesIndex))

        const label = date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })

        return `<div style="padding:6px 10px;font-size:12px;border-radius:6px;background:${palette.tooltipBg};color:${palette.tooltipText}">
          <strong>${point.y}</strong> ${
            point.y === 1 ? 'activity' : 'activities'
          } · ${label}
        </div>`
      },
    },
    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },
    },
  }

  const fitCell = Math.floor(
    (wrapWidth - Y_AXIS_WIDTH) / weekCount,
  )

  const cellWidth = Math.max(
    MIN_CELL,
    fitCell || MIN_CELL,
  )

  const cellHeight = Math.min(
    cellWidth,
    MAX_CELL_HEIGHT,
  )

  const chartWidth =
    weekCount * cellWidth + Y_AXIS_WIDTH

  const chartHeight =
    7 * cellHeight + X_AXIS_HEIGHT

  const statCards = [
    {
      label: 'Total activities',
      value: stats.total.toLocaleString('en-IN'),
    },
    {
      label: 'Busiest day',
      value: stats.busiest,
    },
    {
      label: 'Longest streak',
      value: `${stats.longest} ${
        stats.longest === 1 ? 'day' : 'days'
      }`,
    },
  ]

  const legendColors = [
    palette.empty,
    ...palette.levels,
  ]

  return (
    <div
      className={`grid grid-cols-1 xl:grid-cols-[1.65fr_1fr] gap-5 items-stretch ${className}`}
    >
      <div className="flex w-full min-w-0 flex-col gap-5 rounded-[8px] border border-[#d4d4d4] bg-white p-6 transition-colors duration-200 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[20px] font-semibold text-gray-900 dark:text-gray-100">
                Activity heat map
              </h3>

              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-600 dark:bg-sky-500/15 dark:text-sky-400">
                New
              </span>
            </div>

            <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
              How active your team has been each day
            </p>
          </div>

          <div className="flex max-w-full items-center gap-1">
            <ActivityTabs
              value={filter}
              onChange={setFilter}
            />
          </div>
        </div>

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

        <div
          ref={wrapRef}
          className="w-full overflow-x-auto overflow-y-hidden [scrollbar-width:thin]"
        >
          <div
            style={{
              width: chartWidth,
              height: chartHeight,
            }}
          >
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

        <div className="flex items-center justify-between text-[12px] text-gray-500 dark:text-gray-400">
          <span>Last 6 months</span>

          <div className="flex items-center gap-1.5">
            <span>Less</span>

            {legendColors.map((color) => (
              <span
                key={color}
                className="h-3.5 w-3.5 rounded-[4px]"
                style={{
                  backgroundColor: color,
                }}
              />
            ))}

            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  )
}