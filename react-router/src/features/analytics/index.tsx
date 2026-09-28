import { useState } from 'react'
import Chart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'
import {
  analyticsSummaryMock,
  paymentDataMock,
  recentPaymentsMock,
  latestMeetingsMock,
} from '../../mock/analyticsMock'
import type {
  PaymentData,
  PaymentItem,
  MeetingItem,
  PaymentSeries,
} from '../../types/analytics'

import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  filterFn_includesString,
  flexRender,
  globalFilteringFeature,
  metaHelper,
  tableFeatures,
  createPaginatedRowModel,
  rowPaginationFeature,
  useTable,
} from '@tanstack/react-table'
import type { PaginationState } from '@tanstack/react-table'

/* =========================================================
   TYPES
   ========================================================= */

type TotalProjectsProps = {
  className?: string
}

type PaymentLegendProps = {
  item: PaymentSeries
}

type MeetingRowProps = {
  meeting: MeetingItem
}

/* =========================================================
   PAGINATION (shared by Recent Payment + Latest Meetings)
   Show [05 v] Entries            Previous  1  2  ......  99  Next
   pageIndex is 0-based.
   ========================================================= */

type PageItem = number | 'ellipsis'

// 1 2 ...... 99   /   1 ...... 4 5 6 ...... 99   /   all pages when few
function getPageItems(current: number, total: number): PageItem[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i)

  const keep = new Set<number>([0, total - 1, current - 1, current, current + 1])
  if (current === 0) keep.add(1)
  if (current === total - 1) keep.add(total - 2)

  const sorted = [...keep]
    .filter((i) => i >= 0 && i < total)
    .sort((x, y) => x - y)

  const items: PageItem[] = []
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) items.push('ellipsis')
    items.push(page)
  })
  return items
}

const pageBtnBase =
  'h-[34px] min-w-[34px] px-3 rounded-[6px] border text-[13px] transition-colors ' +
  'border-[#D4D4D4] bg-[#FAFAFA] text-gray-600 hover:bg-gray-100 ' +
  'dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-300 dark:hover:bg-neutral-800 ' +
  'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#FAFAFA] ' +
  'dark:disabled:hover:bg-neutral-900'

const pageBtnActive =
  'border-sky-500 text-sky-500 bg-white hover:bg-white ' +
  'dark:border-sky-400 dark:text-sky-400 dark:bg-neutral-900 dark:hover:bg-neutral-900'

type PaginationProps = {
  pageIndex: number
  pageSize: number
  pageCount: number
  onPageChange: (index: number) => void
  onPageSizeChange: (size: number) => void
  pageSizes?: number[]
}

function Pagination({
  pageIndex,
  pageSize,
  pageCount,
  onPageChange,
  onPageSizeChange,
  pageSizes = [5, 10, 20],
}: PaginationProps) {
  const items = getPageItems(pageIndex, pageCount)
  const canPrevious = pageIndex > 0
  const canNext = pageIndex < pageCount - 1

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-[#E5E5E5] dark:border-neutral-800">
      {/* Show [05 v] Entries */}
      <div className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-300">
        <span>Show</span>

        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Entries per page"
            className="h-[34px] appearance-none rounded-[6px] border border-[#D4D4D4] bg-[#FAFAFA] pl-3 pr-7 text-[13px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-sky-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-300"
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {String(size).padStart(2, '0')}
              </option>
            ))}
          </select>

          <svg
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>

        <span>Entries</span>
      </div>

      {/* Previous  1  2  ......  99  Next */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={pageBtnBase}
          onClick={() => onPageChange(pageIndex - 1)}
          disabled={!canPrevious}
        >
          Previous
        </button>

        {items.map((item, i) =>
          item === 'ellipsis' ? (
            <span
              key={`ellipsis-${i}`}
              className="px-1 text-[13px] tracking-widest text-gray-500"
              aria-hidden="true"
            >
              ......
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-label={`Page ${item + 1}`}
              aria-current={item === pageIndex ? 'page' : undefined}
              className={`${pageBtnBase} ${
                item === pageIndex ? pageBtnActive : ''
              }`}
            >
              {item + 1}
            </button>
          )
        )}

        <button
          type="button"
          className={pageBtnBase}
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={!canNext}
        >
          Next
        </button>
      </div>
    </div>
  )
}

/* =========================================================
   TOTAL PROJECTS
   ========================================================= */

function TotalProjects({
  className = '',
}: TotalProjectsProps) {
  const summary = analyticsSummaryMock

  const projects = [
    { label: 'No.of Workspace', number: summary.workspaceCount },
    { label: 'No.of Projects', number: summary.projectCount },
    { label: 'No.of PIM Projects', number: summary.pimProjectCount },
    { label: 'No.of AIM Projects', number: summary.aimProjectCount },
  ]
  return (
    <div
      className={`grid md:grid-cols-2 grid-cols-1 gap-3 w-full ${className}`}
    >
      {projects.map((item, index) => (
        <div
          key={index}
          className="
            bg-white
            border border-[#D4D4D4]
            rounded-[8px]
            px-5 py-8
            min-h-[170px]
            w-full
            flex flex-col justify-between
            dark:bg-neutral-900
            dark:border-neutral-800
          "
        >
          <p className="text-[18px] font-medium text-gray-900 dark:text-gray-100">
            {item.label}
          </p>

          <div className="text-[48px] font-bold text-gray-900 leading-none dark:text-white">
            {item.number ?? 0}
          </div>
        </div>
      ))}
    </div>
  )
}

/* =========================================================
   OVERVIEW
   ========================================================= */

function OverviewChart() {
  const summary = analyticsSummaryMock

  const colors = [
    '#00a3f5',
    '#032b49',
    '#67c8ff',
    '#bde8ff',
  ]

  const data = [
    { label: 'Workspace', value: summary?.workspaceCount ?? 0 },
    { label: 'Projects', value: summary?.projectCount ?? 0 },
    { label: 'PIM Projects', value: summary?.pimProjectCount ?? 0 },
    { label: 'AIM Projects', value: summary?.aimProjectCount ?? 0 },
  ].map((item, index) => ({
    ...item,
    color: colors[index % colors.length],
  }))

  const series = data.map((item) => item.value)
  const labels = data.map((item) => item.label)

  const chartOptions: ApexOptions = {
    chart: {
      type: 'donut',
      foreColor: '#9ca3af',
      redrawOnWindowResize: true,
    },

    labels,

    colors,

    stroke: {
      show: true,
      width: 4,
      colors: [
        'var(--chart-stroke-color, #ffffff)',
      ],
    },

    plotOptions: {
      pie: {
        expandOnClick: false,

        donut: {
          size: '58%',

          labels: {
            show: false,
          },
        },

        borderRadius: 12,
      },
    },

    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },

    tooltip: {
      enabled: true,
      theme: 'dark',

      style: {
        fontSize: '12px',
        fontFamily: 'inherit',
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

  return (
    <div className="bg-white border border-[#d4d4d4] rounded-[8px] p-7 w-full min-w-0 h-[352px] flex flex-col justify-between dark:bg-neutral-900 dark:border-neutral-800 transition-colors duration-200">
      <h3 className="text-[20px] font-semibold text-gray-900 dark:text-gray-100">
        Overview
      </h3>

      <div className="flex items-center justify-center gap-6 sm:gap-12 md:gap-16 my-auto w-full">
        <div className="w-full max-w-[210px] aspect-square [--chart-stroke-color:#ffffff] dark:[--chart-stroke-color:#171717]">
          <Chart
            options={chartOptions}
            series={series}
            type="donut"
            width="100%"
            height="100%"
          />
        </div>

        <div className="flex flex-col gap-4 pr-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3.5"
            >
              <span
                className="w-4 h-4 rounded-[4px] shrink-0"
                style={{
                  backgroundColor: item.color,
                }}
              />

              <span className="text-[15px] font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   PAYMENT LEGEND
   ========================================================= */

function PaymentLegend({
  item,
}: PaymentLegendProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-3.5 h-3.5 rounded-[3px] shrink-0"
        style={{
          backgroundColor: item.color,
        }}
      />

      <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">
        {item.name}
      </span>
    </div>
  )
}

/* =========================================================
   PAYMENT CHART
   ========================================================= */

function PaymentChart() {
  const [selectedYear, setSelectedYear] = useState<number>(
    paymentDataMock.selectedYear
  )
  const [data, setData] = useState<PaymentData>(paymentDataMock)

  const handleYearChange = (year: number) => {
    setSelectedYear(year)
    setData({
      ...paymentDataMock,
      selectedYear: year,
    })
  }

  const chartData = data

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: true,

      toolbar: {
        show: false,
      },

      fontFamily: 'inherit',
      foreColor: 'var(--chart-text, #374151)',
    },

    colors: chartData.series.map(
      (series: PaymentSeries) => series.color
    ),

    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 6,
        borderRadiusApplication: 'end',
      },
    },

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: chartData.categories,

      axisBorder: {
        show: false,
      },

      axisTicks: {
        show: false,
      },

      labels: {
        style: {
          fontSize: '13px',
        },
      },
    },

    yaxis: {
      min: 0,
      max: 15000,
      tickAmount: 5,

      labels: {
        style: {
          fontSize: '12px',
        },

        formatter: (value: number) => {
          if (value === 0) {
            return '0'
          }

          return `${value / 1000}k`
        },
      },
    },

    grid: {
      borderColor: 'var(--chart-grid, #e5e7eb)',
      strokeDashArray: 0,

      xaxis: {
        lines: {
          show: false,
        },
      },
    },

    legend: {
      show: false,
    },

    tooltip: {
      theme: 'dark',

      y: {
        formatter: (value: number) =>
          `₹${value.toLocaleString('en-IN')}`,
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

  return (
    <div className="w-full min-w-0 h-[447px] bg-white border border-[#d4d4d4] rounded-[8px] p-6 flex flex-col justify-between dark:bg-neutral-900 dark:border-neutral-800 transition-colors duration-200">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-[22px] font-bold text-gray-900 dark:text-gray-100">
            {chartData.title}
          </h3>

          <p className="text-[13px] text-gray-500 mt-0.5 dark:text-gray-400">
            {chartData.subtitle}
          </p>

          <p className="text-[28px] font-extrabold text-gray-900 mt-1 dark:text-white">
            ₹{chartData.totalAmount.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="flex flex-col items-end gap-4 shrink-0">
          <select
            value={selectedYear}
            onChange={(event) =>
              setSelectedYear(
                Number(event.target.value)
              )
            }
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm font-medium text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-gray-200"
          >
            {chartData.availableYears.map(
              (year: number) => (
                <option
                  key={year}
                  value={year}
                >
                  {year}
                </option>
              )
            )}
          </select>

          <div className="flex items-center gap-3 sm:gap-5 flex-wrap justify-end">
            {chartData.series.map(
              (
                item: PaymentSeries,
                index: number
              ) => (
                <PaymentLegend
                  key={index}
                  item={item}
                />
              )
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 min-w-0 w-full mt-4 [--chart-text:#374151] [--chart-grid:#e5e7eb] dark:[--chart-text:#9ca3af] dark:[--chart-grid:#262626]">
        <Chart
          options={options}
          series={chartData.series}
          type="bar"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  )
}

/* =========================================================
   TABLE SETUP (v9)
   - every feature, row model and filter fn is declared up-front
   - globalFilteringFeature depends on columnFilteringFeature
   - the core row model is automatic
   - row model factories live inside tableFeatures()
   ========================================================= */

type PaymentColumnMeta = {
  tdClass?: string
}

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  columnMeta: metaHelper<PaymentColumnMeta>(),
})

const columnHelper = createColumnHelper<typeof features, PaymentItem>()

const columns = columnHelper.columns([
  columnHelper.accessor('id', {
    header: 'S.no',
    cell: (info) => String(info.row.index + 1).padStart(2, '0'),
    meta: {
      tdClass: 'text-center text-gray-500',
    },
  }),

  columnHelper.accessor('plan', {
    header: 'Plan',
    cell: (info) => (
      <div className="flex justify-center">
        <span className="text-left w-full max-w-[140px]">
          {info.getValue()}
        </span>
      </div>
    ),
    meta: {
      tdClass: 'text-gray-600 dark:text-gray-300',
    },
  }),

  columnHelper.accessor('transactionMethod', {
    header: 'Transaction method',
    meta: {
      tdClass: 'text-center text-gray-500',
    },
  }),

  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: (info) => `₹${info.getValue().toLocaleString('en-IN')}`,
    meta: {
      tdClass: 'text-center text-gray-600 dark:text-gray-300',
    },
  }),
])

/* =========================================================
   RECENT PAYMENT TABLE
   ========================================================= */

function RecentPayment() {
  const [payments] = useState<PaymentItem[]>(recentPaymentsMock)
  const [globalFilter, setGlobalFilter] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  // Pagination is kept in React state (same pattern as globalFilter),
  // so the footer always re-renders when the page changes.
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  const table = useTable({
    features,
    data: payments,
    columns,
    globalFilterFn: 'includesString',

    state: {
      globalFilter,
      pagination,
    },

    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
  })

  const rows = table.getRowModel().rows

  return (
    <div className="recent-payment w-full min-w-0 bg-white border border-[#D4D4D4] rounded-[8px] overflow-hidden dark:bg-neutral-900 dark:border-neutral-800">
      <div className="flex flex-col border-b border-[#E5E5E5] dark:border-neutral-800">
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <h3 className="text-[16px] font-semibold text-gray-700 dark:text-gray-200">
            Recent Payment List
          </h3>

          <div className="flex items-center gap-3 text-gray-400">
            <button
              type="button"
              onClick={() => setShowSearch(!showSearch)}
              className={`transition-colors ${
                showSearch
                  ? 'text-blue-500'
                  : 'hover:text-gray-700 dark:hover:text-gray-200'
              }`}
              aria-label="Filter payments"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
              </svg>
            </button>

            <button
              type="button"
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              aria-label="Open payment list"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 3h7v7" />
                <path d="M10 14L21 3" />
                <path d="M21 14v7H3V3h7" />
              </svg>
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="px-4 pb-3">
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Filter payments..."
              className="w-full px-3 py-1.5 text-[13px] border border-[#D4D4D4] dark:border-neutral-700 rounded-[6px] bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-[#E5E5E5] dark:border-neutral-800"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2 text-center text-[12px] font-medium text-gray-500"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[#EEEEEE] last:border-b-0 dark:border-neutral-800"
              >
                {row.getAllCells().map((cell) => {
                  const tdClass = cell.column.columnDef.meta?.tdClass

                  return (
                    <td
                      key={cell.id}
                      className={`px-3 py-[7px] text-[14px] ${tdClass ?? ''}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-4 text-center text-[13px] text-gray-400"
                >
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        pageCount={table.getPageCount()}
        onPageChange={(index) => table.setPageIndex(index)}
        onPageSizeChange={(size) => table.setPageSize(size)}
      />
    </div>
  )
}

/* =========================================================
   MEETING STATUS COLOR
   ========================================================= */

const getStatusTextColor = (
  status: MeetingItem['status']
) => {
  switch (status) {
    case 'Open':
      return 'text-[#00A3FF]'

    case 'On going':
      return 'text-[#FF9900]'

    case 'Closed':
      return 'text-[#FF4D4D]'

    default:
      return 'text-gray-500'
  }
}

/* =========================================================
   MEETING ROW
   ========================================================= */

function formatMeetingDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function MeetingRow({
  meeting,
}: MeetingRowProps) {
  return (
    <tr className="border-b border-[#EEEEEE] last:border-b-0 dark:border-neutral-800">
      <td className="px-4 py-[10px] text-center text-[13px] font-medium text-gray-700 dark:text-gray-300">
        {meeting.title}
      </td>

      <td className="px-4 py-[10px] text-center text-[13px] text-gray-500 dark:text-gray-400 max-w-[180px] truncate">
        <span className="inline-block max-w-[150px] truncate align-bottom">
          {meeting.description}
        </span>
      </td>

      <td className="px-4 py-[10px] text-center text-[13px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {formatMeetingDate(meeting.date)}
      </td>

      <td className="px-4 py-[10px]">
        <div className="flex items-center justify-center -space-x-1.5 overflow-hidden">
          {meeting.members.map(
            (member) => (
              <img
                key={member.id}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-neutral-900 object-cover"
                src={member.avatarUrl}
                alt={member.name}
              />
            )
          )}
        </div>
      </td>

      <td className="px-4 py-[10px] text-center text-[13px] text-gray-500 dark:text-gray-400">
        {meeting.groupsCount}
      </td>

      <td
        className={`px-4 py-[10px] text-center text-[13px] font-medium ${getStatusTextColor(
          meeting.status
        )}`}
      >
        {meeting.status}
      </td>
    </tr>
  )
}

/* =========================================================
   LATEST MEETINGS
   ========================================================= */

function LatestMeetings() {
  const [meetings] = useState<MeetingItem[]>(latestMeetingsMock)
  const [query, setQuery] = useState('')
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(5)

  const normalizedQuery = query.trim().toLowerCase()

  // 1) filter
  const filteredMeetings = meetings.filter((meeting) =>
    meeting.title.toLowerCase().includes(normalizedQuery)
  )

  // 2) paginate the filtered list
  const pageCount = Math.max(Math.ceil(filteredMeetings.length / pageSize), 1)
  const currentPage = Math.min(pageIndex, pageCount - 1)

  const visibleMeetings = filteredMeetings.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  )

  return (
    <div className="latest-meetings w-full min-w-0 bg-white border border-[#D4D4D4] rounded-[8px] overflow-hidden dark:bg-neutral-900 dark:border-neutral-800">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] dark:border-neutral-800">
        <h3 className="text-[18px] font-semibold text-gray-800 dark:text-gray-100">
          Latest Meetings
        </h3>

        <div className="relative flex items-center">
          <svg
            className="absolute left-3 w-3.5 h-3.5 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPageIndex(0) // back to page 1 when the search changes
            }}
            placeholder="Search Meetings title"
            className="w-[200px] sm:w-[220px] pl-8 pr-3 py-1 text-[12px] bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200 border border-[#D4D4D4] dark:border-neutral-700 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-400"
          />
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="border-b border-[#E5E5E5] dark:border-neutral-800">
              <th className="px-4 py-3 text-center text-[13px] font-medium text-gray-500">
                Meeting Title
              </th>

              <th className="px-4 py-3 text-center text-[13px] font-medium text-gray-500">
                Description
              </th>

              <th className="px-4 py-3 text-center text-[13px] font-medium text-gray-500">
                Date
              </th>

              <th className="px-4 py-3 text-center text-[13px] font-medium text-gray-500">
                Members
              </th>

              <th className="px-4 py-3 text-center text-[13px] font-medium text-gray-500">
                Groups
              </th>

              <th className="px-4 py-3 text-center text-[13px] font-medium text-gray-500">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {visibleMeetings.map(
              (meeting) => (
                <MeetingRow
                  key={meeting.id}
                  meeting={meeting}
                />
              )
            )}

            {visibleMeetings.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-[13px] text-gray-400"
                >
                  No meetings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        pageIndex={currentPage}
        pageSize={pageSize}
        pageCount={pageCount}
        onPageChange={setPageIndex}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPageIndex(0)
        }}
      />
    </div>
  )
}

/* =========================================================
   PAGE — PARENT COMPONENT
   ========================================================= */

export default function Analytics() {
  return (
    <div className="min-h-screen bg-[#F8F8F8] text-gray-500 dark:bg-black dark:text-gray-300">
      {/* Top section */}

      <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] gap-5 items-stretch">
        <TotalProjects />

        <OverviewChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] gap-5 mt-5 items-stretch">
        <PaymentChart />

        <RecentPayment />
      </div>

      <div className="mt-5">
        <LatestMeetings />
      </div>
    </div>
  )
}