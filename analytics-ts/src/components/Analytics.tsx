import { useState } from 'react'
import Chart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { menuItems } from './config/project-content'
import { paymentData } from './config/payment-data'

import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  filterFn_includesString,
  flexRender,
  globalFilteringFeature,
  metaHelper,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'

/* =========================================================
   TYPES
   ========================================================= */

type MenuItem = {
  label: string
  number: string
}

type PaymentSeries = {
  name: string
  color: string
  data: number[]
}

type PaymentItem = {
  no: string
  plan: string
  method: string
  amount: string
}

type TotalProjectsProps = {
  className?: string
}

type PaymentLegendProps = {
  item: PaymentSeries
}

type MeetingMember = {
  id: string
  name: string
  avatarUrl: string
}

type MeetingItem = {
  id: string
  title: string
  description: string
  date: string
  members: MeetingMember[]
  groupsCount: number
  status: 'Open' | 'On going' | 'Closed'
}

type MeetingRowProps = {
  meeting: MeetingItem
}

/* =========================================================
   TOTAL PROJECTS
   ========================================================= */

function TotalProjects({
  className = '',
}: TotalProjectsProps) {
  const projects = menuItems as MenuItem[]

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
            {item.number}
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
  const projects = menuItems as MenuItem[]

  const colors = [
    '#00a3f5',
    '#032b49',
    '#67c8ff',
    '#bde8ff',
  ]

  const getShortLabel = (label: string) =>
    label.replace(/^No\.\s*of\s*/i, '')

  const series = projects.map(
    (item: MenuItem) =>
      parseInt(item.number, 10) || 0
  )

  const data = projects.map(
    (item: MenuItem, index: number) => ({
      label: getShortLabel(item.label),
      color: colors[index % colors.length],
    })
  )

  const labels = projects.map(
    (item: MenuItem) => getShortLabel(item.label)
  )

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
  const data = paymentData as {
    title: string
    subtitle: string
    totalAmount: string
    selectedYear: number
    availableYears: number[]
    series: PaymentSeries[]
    categories: string[]
  }

  const [selectedYear, setSelectedYear] =
    useState<number>(data.selectedYear)

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

    colors: data.series.map(
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
      categories: data.categories,

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
            {data.title}
          </h3>

          <p className="text-[13px] text-gray-500 mt-0.5 dark:text-gray-400">
            {data.subtitle}
          </p>

          <p className="text-[28px] font-extrabold text-gray-900 mt-1 dark:text-white">
            {data.totalAmount}
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
            {data.availableYears.map(
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
            {data.series.map(
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
          series={data.series}
          type="bar"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  )
}

/* =========================================================
   RECENT PAYMENT DATA
   ========================================================= */

const payments: PaymentItem[] = [
  {
    no: '01',
    plan: 'PIM Project',
    method: 'Card',
    amount: '5,000',
  },
  {
    no: '02',
    plan: 'AIM Project',
    method: 'UPI',
    amount: '10,000',
  },
  {
    no: '03',
    plan: 'AIM Project',
    method: 'Card',
    amount: '10,000',
  },
  {
    no: '04',
    plan: 'PIM + AIM Project',
    method: 'UPI',
    amount: '12,500',
  },
  {
    no: '05',
    plan: 'PIM Project',
    method: 'UPI',
    amount: '5,000',
  },
  {
    no: '06',
    plan: 'PIM Project',
    method: 'UPI',
    amount: '5,000',
  },
  {
    no: '07',
    plan: 'PIM + AIM Project',
    method: 'Card',
    amount: '12,500',
  },
]

/* v9: every feature, row model and filter fn is declared up-front.
   - globalFilteringFeature depends on columnFilteringFeature, so both are listed
   - the core row model is automatic (no createCoreRowModel / getCoreRowModel)
   - row model factories live inside tableFeatures(), not as table options */
type PaymentColumnMeta = {
  tdClass?: string
}

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
  columnMeta: metaHelper<PaymentColumnMeta>(),
})

const columnHelper = createColumnHelper<
  typeof features,
  PaymentItem
>()

const columns = columnHelper.columns([
  columnHelper.accessor('no', {
    header: 'S.no',

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

  columnHelper.accessor('method', {
    header: 'Transaction method',

    meta: {
      tdClass: 'text-center text-gray-500',
    },
  }),

  columnHelper.accessor('amount', {
    header: 'Amount',

    meta: {
      tdClass:
        'text-center text-gray-600 dark:text-gray-300',
    },
  }),
])

/* =========================================================
   RECENT PAYMENT TABLE
   ========================================================= */

function RecentPayment() {
  const [globalFilter, setGlobalFilter] =
    useState('')

  const [showSearch, setShowSearch] =
    useState(false)

  const table = useTable({
    features,
    data: payments,
    columns,
    globalFilterFn: 'includesString',

    state: {
      globalFilter,
    },

    onGlobalFilterChange:
      setGlobalFilter,
  })

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
              onClick={() =>
                setShowSearch(!showSearch)
              }
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
              onChange={(e) =>
                setGlobalFilter(e.target.value)
              }
              placeholder="Filter payments..."
              className="w-full px-3 py-1.5 text-[13px] border border-[#D4D4D4] dark:border-neutral-700 rounded-[6px] bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse">
          <thead>
            {table.getHeaderGroups().map(
              (headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-[#E5E5E5] dark:border-neutral-800"
                >
                  {headerGroup.headers.map(
                    (header) => (
                      <th
                        key={header.id}
                        className="px-3 py-2 text-center text-[12px] font-medium text-gray-500"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column
                                .columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    )
                  )}
                </tr>
              )
            )}
          </thead>

          <tbody>
            {table.getRowModel().rows.map(
              (row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#EEEEEE] last:border-b-0 dark:border-neutral-800"
                >
                  {row
                    .getAllCells()
                    .map((cell) => {
                      const tdClass =
                        cell.column.columnDef
                          .meta?.tdClass

                      return (
                        <td
                          key={cell.id}
                          className={`px-3 py-[7px] text-[14px] ${
                            tdClass ?? ''
                          }`}
                        >
                          {flexRender(
                            cell.column
                              .columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      )
                    })}
                </tr>
              )
            )}

            {table.getRowModel().rows
              .length === 0 && (
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
    </div>
  )
}

/* =========================================================
   LATEST MEETINGS DATA
   ========================================================= */

const meetings: MeetingItem[] = [
  {
    id: '1',
    title: 'M4',
    description:
      'M4 discuss about the process of containing co...',
    date: '28/05/2026, 03:51 PM',

    members: [
      {
        id: '1',
        name: 'User 1',
        avatarUrl:
          'https://i.pravatar.cc/150?img=1',
      },
      {
        id: '2',
        name: 'User 2',
        avatarUrl:
          'https://i.pravatar.cc/150?img=2',
      },
      {
        id: '3',
        name: 'User 3',
        avatarUrl:
          'https://i.pravatar.cc/150?img=3',
      },
    ],

    groupsCount: 2,
    status: 'Open',
  },

  {
    id: '2',
    title: 'M3',
    description:
      'M3 codes about the process of containing co...',
    date: '23/05/2026, 06:51 PM',

    members: [
      {
        id: '1',
        name: 'User 1',
        avatarUrl:
          'https://i.pravatar.cc/150?img=1',
      },
      {
        id: '2',
        name: 'User 2',
        avatarUrl:
          'https://i.pravatar.cc/150?img=2',
      },
    ],

    groupsCount: 3,
    status: 'On going',
  },

  {
    id: '3',
    title: 'M2',
    description:
      'M2 discuss about the process of containing co...',
    date: '17/05/2026, 02:51 PM',

    members: [
      {
        id: '1',
        name: 'User 1',
        avatarUrl:
          'https://i.pravatar.cc/150?img=1',
      },
      {
        id: '2',
        name: 'User 2',
        avatarUrl:
          'https://i.pravatar.cc/150?img=2',
      },
      {
        id: '3',
        name: 'User 3',
        avatarUrl:
          'https://i.pravatar.cc/150?img=3',
      },
      {
        id: '4',
        name: 'User 4',
        avatarUrl:
          'https://i.pravatar.cc/150?img=4',
      },
    ],

    groupsCount: 6,
    status: 'Closed',
  },

  {
    id: '4',
    title: 'M1',
    description:
      'M1 discuss about the process of containing co...',
    date: '05/05/2026, 03:51 PM',

    members: [
      {
        id: '1',
        name: 'User 1',
        avatarUrl:
          'https://i.pravatar.cc/150?img=1',
      },
      {
        id: '2',
        name: 'User 2',
        avatarUrl:
          'https://i.pravatar.cc/150?img=2',
      },
    ],

    groupsCount: 1,
    status: 'Closed',
  },

  {
    id: '5',
    title: 'M0',
    description:
      'M0 discuss about the process of containing co...',
    date: '28/04/2026, 10:51 AM',

    members: [
      {
        id: '1',
        name: 'User 1',
        avatarUrl:
          'https://i.pravatar.cc/150?img=1',
      },
      {
        id: '2',
        name: 'User 2',
        avatarUrl:
          'https://i.pravatar.cc/150?img=2',
      },
      {
        id: '3',
        name: 'User 3',
        avatarUrl:
          'https://i.pravatar.cc/150?img=3',
      },
      {
        id: '4',
        name: 'User 4',
        avatarUrl:
          'https://i.pravatar.cc/150?img=4',
      },
    ],

    groupsCount: 9,
    status: 'Closed',
  },
]

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
        {meeting.date}
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
  const [query, setQuery] = useState('')

  const normalizedQuery = query.trim().toLowerCase()

  const visibleMeetings = meetings.filter((meeting) =>
    meeting.title.toLowerCase().includes(normalizedQuery)
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
            onChange={(event) =>
              setQuery(event.target.value)
            }
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
    </div>
  )
}

/* =========================================================
   PAGE — PARENT COMPONENT
   ========================================================= */

export default function Page() {
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