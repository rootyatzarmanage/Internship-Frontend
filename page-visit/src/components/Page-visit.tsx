import { useEffect, useMemo, useRef, useState } from 'react'
import Chart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { menuItems } from './config/Visitors'
import { analyticsData } from './config/LiveUpdate'
import type { AnalyticsRecord } from './config/LiveUpdate'
import type { ReactNode } from 'react'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import {
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  flexRender,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import type {
  Column,
  ReactTable,
  Row,
  RowData,
  TableOptions,
} from '@tanstack/react-table'

/* =========================================================
   DARK MODE HOOK
   ApexCharts writes many colors as SVG attributes, where CSS
   variables (var(--x)) often don't resolve. So charts get real
   hex values based on this flag instead.

   Assumes Tailwind's class strategy (<html class="dark">).
   If you use the media strategy, swap this for a
   matchMedia('(prefers-color-scheme: dark)') listener.
   ========================================================= */

function useIsDark() {
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    const el = document.documentElement
    const update = () => setIsDark(el.classList.contains('dark'))

    update()
    const observer = new MutationObserver(update)
    observer.observe(el, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  return isDark
}

const chartTheme = {
  light: { text: '#374151', grid: '#e5e7eb', stroke: '#ffffff' },
  dark: { text: '#9ca3af', grid: '#262626', stroke: '#171717' },
}

/* =========================================================
   VISITORS
   ========================================================= */

type VisitProp = {
  className?: string
}

type MenuItem = {
  label: string
  number: string
  percent: string
}

function Visit({ className = '' }: VisitProp) {
  const projects = menuItems as MenuItem[]

  return (
    <div
      className={`grid sm:grid-cols-3 grid-cols-1 gap-3 w-full ${className}`}
    >
      {projects.map((item) => (
        <div
          key={item.label}
          className="relative
            bg-[#FAFAFA]
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
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {item.label}
          </p>

          <div className="relative text-[32px] font-bold text-gray-900 leading-none dark:text-white mb-2">
            {item.number}
          </div>

          <div className="absolute bottom-4 right-4 flex items-center text-[12px] font-normal leading-none">
            <span className="bg-[#99CC99] text-[#008000] px-1.5 py-0.5 rounded-sm font-medium">
              {item.percent}
            </span>
            <span className="text-gray-600 font-medium dark:text-white">
              vs Last Month
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

/* =========================================================
   LIVE UPDATE
   ========================================================= */

// Everything the tables need: sizing, filtering, column visibility,
// sorting and pagination, plus the row models that power them.
const features = tableFeatures({
  columnSizingFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  // Registered so the default ("auto") sort can pick a function per column.
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
    basic: sortFn_basic,
  },
})

type Features = typeof features
type TableInstance<TData extends RowData> = ReactTable<Features, TData>
type TableColumn<TData extends RowData> = Column<Features, TData, unknown>
type TableRow<TData extends RowData> = Row<Features, TData>
type TableColumns<TData extends RowData> = TableOptions<Features, TData>['columns']

/* ---------- filter + sort helpers ---------- */

type DateRange = { start?: string; end?: string }

// Turns a "viewedAt" value into a timestamp. Handles Date objects, ISO strings,
// "18 Sep 2026, 10:30 AM" style strings, and dd/mm/yyyy or dd-mm-yyyy
// (optionally followed by a time). Returns null when it can't be read.
// If your data uses another format, adjust this one function.
function toTimestamp(value: unknown): number | null {
  if (value instanceof Date) {
    const time = value.getTime()
    return Number.isNaN(time) ? null : time
  }
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value !== 'string') return null

  const text = value.trim()
  if (!text) return null

  const dmy = text.match(
    /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:[ ,T]+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?)?$/i
  )
  if (dmy) {
    const [, day, month, year, hh, mm, ss, meridiem] = dmy
    let hours = Number(hh ?? 0)
    if (meridiem) hours = (hours % 12) + (meridiem.toUpperCase() === 'PM' ? 12 : 0)
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      hours,
      Number(mm ?? 0),
      Number(ss ?? 0)
    ).getTime()
  }

  const parsed = Date.parse(text)
  return Number.isNaN(parsed) ? null : parsed
}

// "2026-09-18" (from <input type="date">) -> local start / end of that day.
function dayBoundary(isoDate: string, edge: 'start' | 'end'): number {
  const [year, month, day] = isoDate.split('-').map(Number)
  return edge === 'start'
    ? new Date(year, month - 1, day, 0, 0, 0, 0).getTime()
    : new Date(year, month - 1, day, 23, 59, 59, 999).getTime()
}

// Keeps rows whose date falls inside the (inclusive) range.
function dateRangeFilterFn<TData extends RowData>(
  row: TableRow<TData>,
  columnId: string,
  filterValue: DateRange | undefined
): boolean {
  if (!filterValue?.start && !filterValue?.end) return true

  const time = toTimestamp(row.getValue(columnId))
  if (time === null) return false

  if (filterValue.start && time < dayBoundary(filterValue.start, 'start')) return false
  if (filterValue.end && time > dayBoundary(filterValue.end, 'end')) return false
  return true
}

// Sorts by real date, so any date format sorts chronologically.
function dateSortFn<TData extends RowData>(
  rowA: TableRow<TData>,
  rowB: TableRow<TData>,
  columnId: string
): number {
  const a = toTimestamp(rowA.getValue(columnId)) ?? Number.NEGATIVE_INFINITY
  const b = toTimestamp(rowB.getValue(columnId)) ?? Number.NEGATIVE_INFINITY
  return a === b ? 0 : a < b ? -1 : 1
}

// "India, Canada" -> keeps rows whose country contains any of the terms.
function countryFilterFn<TData extends RowData>(
  row: TableRow<TData>,
  columnId: string,
  filterValue: unknown
): boolean {
  const terms = String(filterValue ?? '')
    .split(',')
    .map((term) => term.trim().toLowerCase())
    .filter(Boolean)
  if (terms.length === 0) return true

  const country = String(row.getValue(columnId) ?? '').toLowerCase()
  return terms.some((term) => country.includes(term))
}

// Hides rows that come from the selected IP address.
function ignoreIpFilterFn<TData extends RowData>(
  row: TableRow<TData>,
  columnId: string,
  filterValue: unknown
): boolean {
  if (!filterValue) return true
  return String(row.getValue(columnId)) !== String(filterValue)
}

function findColumn<TData extends RowData>(
  table: TableInstance<TData>,
  id: string
): TableColumn<TData> | undefined {
  // getColumn() logs a warning for unknown ids, and the Country table has no
  // date / IP columns, so look the column up safely instead.
  return table.getAllLeafColumns().find((column) => column.id === id)
}

function getColumnLabel<TData extends RowData>(column: TableColumn<TData>): string {
  const header = column.columnDef.header
  return typeof header === 'string' ? header : column.id
}

/* ---------- OVERVIEW TABLE: columns ---------- */

const columnHelper = createColumnHelper<Features, AnalyticsRecord>()

const columns = columnHelper.columns([
  columnHelper.accessor('sNo', { header: 'S.No', size: 70 }),
  columnHelper.accessor('pageName', { header: 'Page Name', size: 120 }),
  columnHelper.accessor('pageUrl', { header: 'Page URL', size: 120 }),
  columnHelper.accessor('previousPage', { header: 'Previous Page', size: 120 }),

  // The accessor returns "name id" (a string) so global search and sorting can
  // match both. The cell shows the name and the ID on separate lines.
  columnHelper.accessor((row) => `${row.user.name} ${row.user.id}`, {
    id: 'user',
    header: 'User',
    size: 150,
    cell: (info) => (
      <div>
        <div className="truncate">{info.row.original.user.name}</div>
        <div className="truncate text-[11px] font-bold text-gray-600 dark:text-gray-400">
          ID: {info.row.original.user.id}
        </div>
      </div>
    ),
  }),

  columnHelper.accessor('ipAddress', {
    header: 'IP Address',
    size: 140,
    filterFn: ignoreIpFilterFn,
  }),
  columnHelper.accessor('country', {
    header: 'Country',
    size: 100,
    filterFn: countryFilterFn,
  }),
  columnHelper.accessor('region', { header: 'Region', size: 120 }),
  columnHelper.accessor('city', { header: 'City', size: 120 }),
  columnHelper.accessor('pinCode', { header: 'Pin code', size: 100 }),
  columnHelper.accessor('device', { header: 'Device', size: 100 }),
  columnHelper.accessor('operatingSystem', { header: 'Operating System', size: 150 }),
  columnHelper.accessor('browser', { header: 'Browser', size: 110 }),
  columnHelper.accessor('timeZone', { header: 'Time Zone', size: 110 }),
  columnHelper.accessor('durationInSec', { header: 'Duration (in sec)', size: 140 }),
  columnHelper.accessor('viewedAt', {
    header: 'Viewed at',
    size: 180,
    filterFn: dateRangeFilterFn,
    sortFn: dateSortFn,
  }),
])

// The user column shows "Name / ID: 123" on screen; export it as one cell.
function getOverviewExportValue(
  row: TableRow<AnalyticsRecord>,
  columnId: string
): unknown {
  if (columnId === 'user') {
    return `${row.original.user.name} (ID: ${row.original.user.id})`
  }
  return row.getValue(columnId)
}

/* ---------- COUNTRY TABLE: data + columns ---------- */

type CountryRecord = {
  sNo: number
  country: string
  totalView: number
  loginView: number
  withoutLoginView: number
  totalVisits: number
  newVisitors: number
  avgDuration: number // seconds
}

// Move this into ./config if you prefer to keep data files separate.
const countryData: CountryRecord[] = [
  { sNo: 1, country: 'United States', totalView: 604, loginView: 52, withoutLoginView: 542, totalVisits: 34, newVisitors: 23, avgDuration: 112 },
  { sNo: 2, country: 'India', totalView: 462, loginView: 152, withoutLoginView: 245, totalVisits: 32, newVisitors: 3, avgDuration: 324234 },
  { sNo: 3, country: 'Singapore', totalView: 67, loginView: 78, withoutLoginView: 9, totalVisits: 341, newVisitors: 32, avgDuration: 324 },
  { sNo: 4, country: 'Egypt', totalView: 36, loginView: 0, withoutLoginView: 36, totalVisits: 23, newVisitors: 3, avgDuration: 234 },
  { sNo: 5, country: 'Singapore', totalView: 26, loginView: 0, withoutLoginView: 26, totalVisits: 234, newVisitors: 34, avgDuration: 123 },
  { sNo: 6, country: 'Mexico', totalView: 20, loginView: 0, withoutLoginView: 20, totalVisits: 12, newVisitors: 23, avgDuration: 334 },
]

const countryColumnHelper = createColumnHelper<Features, CountryRecord>()

const countryColumns = countryColumnHelper.columns([
  countryColumnHelper.accessor('sNo', { header: 'S.no', size: 80 }),
  countryColumnHelper.accessor('country', {
    header: 'Country',
    size: 160,
    filterFn: countryFilterFn,
  }),
  countryColumnHelper.accessor('totalView', { header: 'Total View', size: 130 }),
  countryColumnHelper.accessor('loginView', { header: 'Login View', size: 130 }),
  countryColumnHelper.accessor('withoutLoginView', { header: 'Without Login View', size: 190 }),
  countryColumnHelper.accessor('totalVisits', { header: 'Total Visits', size: 130 }),
  countryColumnHelper.accessor('newVisitors', { header: 'New Visitors', size: 140 }),
  countryColumnHelper.accessor('avgDuration', {
    header: 'Avg Duration',
    size: 150,
    cell: (info) => `${info.getValue()} sec`,
  }),
])

/* ---------- icons + icon button ---------- */

const iconPaths = {
  chevron: 'm19.5 8.25-7.5 7.5-7.5-7.5',
  search:
    'm21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z',
  filter:
    'M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z',
  columns:
    'M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75',
  sort: 'M3 6h10M3 12h7M3 18h4M17 5v14m0 0-3-3m3 3 3-3',
  export:
    'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M14 3l5 5v3M14 3v5h5M14 17h7m0 0-3-3m3 3-3 3',
  arrowUp: 'M12 19.5v-15m0 0-6.75 6.75M12 4.5l6.75 6.75',
  arrowDown: 'M12 4.5v15m0 0 6.75-6.75M12 19.5l-6.75-6.75',
}

function Icon({
  d,
  className = 'h-[18px] w-[18px]',
}: {
  d: string
  className?: string
}) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.6"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}

// cursor-pointer lives here (and is actually applied below), so every icon
// button shows the pointer on hover and a "not-allowed" cursor when disabled.
const iconButtonClass =
  'relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-[8px] text-gray-600 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-[#00B2FF]/60 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:text-gray-300 dark:hover:bg-neutral-800 dark:disabled:hover:bg-transparent'

type IconButtonProps = {
  label: string
  d: string
  onClick?: () => void
  /** Toggle buttons (Filter): highlighted while on. */
  pressed?: boolean
  /** Buttons that open a menu (Columns, Sort): highlighted while open. */
  expanded?: boolean
  /** Small blue dot showing that something is active (filters, sort...). */
  badge?: boolean
  disabled?: boolean
  showTooltip?: boolean
  className?: string
}

// Icon-only button with a hover / keyboard-focus tooltip.
function IconButton({
  label,
  d,
  onClick,
  pressed,
  expanded,
  badge = false,
  disabled = false,
  showTooltip = true,
  className = '',
}: IconButtonProps) {
  const active = Boolean(pressed || expanded)

  return (
    <div className="group relative">
      <button
        type="button"
        aria-label={badge ? `${label} (active)` : label}
        aria-pressed={pressed}
        aria-expanded={expanded}
        aria-haspopup={expanded === undefined ? undefined : true}
        disabled={disabled}
        onClick={onClick}
        className={`peer ${iconButtonClass} ${
          active ? 'bg-gray-100 dark:bg-neutral-800' : ''
        } ${className}`}
      >
        <Icon d={d} />
        {badge && (
          <span
            aria-hidden="true"
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#00B2FF]"
          />
        )}
      </button>

      {showTooltip && (
        <span
          role="tooltip"
          className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded-[4px] border border-gray-700 bg-white px-1.5 py-0.5 text-[12px] text-gray-900 group-hover:block peer-focus-visible:block dark:border-neutral-500 dark:bg-neutral-900 dark:text-gray-100"
        >
          {label}
        </span>
      )}
    </div>
  )
}

/* ---------- dropdown menu (Columns, Sort) ---------- */

const menuPanelClass =
  'absolute right-0 top-full z-20 mt-2 w-64 rounded-[8px] border border-[#d4d4d4] bg-white p-1.5 shadow-md dark:border-neutral-700 dark:bg-neutral-900'
const menuTitleClass =
  'text-[13px] font-semibold text-gray-900 dark:text-gray-100'
const menuActionClass =
  'cursor-pointer rounded-[4px] px-1 text-[12px] font-medium text-[#0082D1] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#00B2FF]/60 disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline dark:text-[#00B2FF]'
const menuItemClass =
  'flex w-full items-center justify-between gap-2 rounded-[6px] px-2 py-1.5 text-left text-[13px] text-gray-700 outline-none hover:bg-gray-100 focus-visible:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800'

// An icon button that opens a small panel. Closes on outside click and Escape.
function ToolbarMenu({
  label,
  d,
  badge,
  children,
}: {
  label: string
  d: string
  badge?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative [scrollbar-width:none] [scrollbar-color:#d4d4d4_transparent]">
      <IconButton
        label={label}
        d={d}
        badge={badge}
        expanded={open}
        showTooltip={!open}
        onClick={() => setOpen((current) => !current)}
      />
      {open && (
        <div role="group" aria-label={label} className={menuPanelClass}>
          {children}
        </div>
      )}
    </div>
  )
}

/* ---------- Columns menu: show / hide columns ---------- */

function ColumnsMenu<TData extends RowData>({
  table,
}: {
  table: TableInstance<TData>
}) {
  const allColumns = table.getAllLeafColumns()
  const visibleCount = table.getVisibleLeafColumns().length

  return (
    <ToolbarMenu
      label="Columns"
      d={iconPaths.columns}
      badge={!table.getIsAllColumnsVisible()}
    >
      <div className="flex items-center justify-between px-2 pb-1.5 pt-1">
        <span className={menuTitleClass}>Columns</span>
        <button
          type="button"
          onClick={() => table.toggleAllColumnsVisible(true)}
          disabled={table.getIsAllColumnsVisible()}
          className={menuActionClass}
        >
          Show all
        </button>
      </div>

      <div className="max-h-72 overflow-y-auto">
        {allColumns.map((column) => {
          const isVisible = column.getIsVisible()
          // Always keep at least one column on screen.
          const isLastVisible = isVisible && visibleCount === 1
          const isLocked = isLastVisible || !column.getCanHide()

          return (
            <label
              key={column.id}
              className={`flex items-center gap-2.5 rounded-[6px] px-2 py-1.5 text-[13px] text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-800 ${
                isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              }`}
            >
              <input
                type="checkbox"
                checked={isVisible}
                disabled={isLocked}
                onChange={(event) => column.toggleVisibility(event.target.checked)}
                className="h-4 w-4 cursor-pointer accent-[#00B2FF] disabled:cursor-not-allowed"
              />
              <span className="truncate">{getColumnLabel(column)}</span>
            </label>
          )
        })}
      </div>
    </ToolbarMenu>
  )
}

/* ---------- Sort menu ---------- */

function SortMenu<TData extends RowData>({
  table,
}: {
  table: TableInstance<TData>
}) {
  const sortableColumns = table.getAllLeafColumns().filter((column) => column.getCanSort())
  const hasSorting = table.state.sorting.length > 0

  // none -> ascending -> descending -> none
  function cycleSort(column: TableColumn<TData>) {
    const current = column.getIsSorted()
    if (current === false) table.setSorting([{ id: column.id, desc: false }])
    else if (current === 'asc') table.setSorting([{ id: column.id, desc: true }])
    else table.setSorting([])
  }

  return (
    <ToolbarMenu label="Sort" d={iconPaths.sort} badge={hasSorting}>
      <div className="flex items-center justify-between px-2 pb-0.5 pt-1">
        <span className={menuTitleClass}>Sort by</span>
        <button
          type="button"
          onClick={() => table.setSorting([])}
          disabled={!hasSorting}
          className={menuActionClass}
        >
          Clear
        </button>
      </div>
      <p className="px-2 pb-1.5 text-[12px] text-gray-500 dark:text-gray-400">
        Click again to reverse the order.
      </p>

      <div className="max-h-72 overflow-y-auto">
        {sortableColumns.map((column) => {
          const sorted = column.getIsSorted()

          return (
            <button
              key={column.id}
              type="button"
              onClick={() => cycleSort(column)}
              className={`${menuItemClass} cursor-pointer ${
                sorted ? 'font-semibold text-gray-900 dark:text-gray-100' : ''
              }`}
            >
              <span className="truncate">{getColumnLabel(column)}</span>
              {sorted && (
                <>
                  <Icon
                    d={sorted === 'asc' ? iconPaths.arrowUp : iconPaths.arrowDown}
                    className="h-4 w-4 shrink-0 text-[#0082D1] dark:text-[#00B2FF]"
                  />
                  <span className="sr-only">
                    {sorted === 'asc' ? '(ascending)' : '(descending)'}
                  </span>
                </>
              )}
            </button>
          )
        })}
      </div>
    </ToolbarMenu>
  )
}

/* ---------- Export: download the current view as CSV ---------- */

// Quotes cells that need it, and defuses spreadsheet formulas (=, +, -, @)
// because visitor-controlled text such as page URLs ends up in this file.
function toCsvCell(value: unknown): string {
  let text = value === null || value === undefined ? '' : String(value)
  if (typeof value === 'string' && /^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function getExportData<TData extends RowData>(
  table: TableInstance<TData>,
  getExportValue?: (row: TableRow<TData>, columnId: string) => unknown
) {
  const exportColumns = table.getVisibleLeafColumns()

  const headers = exportColumns.map((column) =>
    getColumnLabel(column)
  )

  const rows = table.getPrePaginatedRowModel().rows.map((row) =>
    exportColumns.map((column) => {
      const value = getExportValue
        ? getExportValue(row, column.id)
        : row.getValue(column.id)

      return value ?? ''
    })
  )

  return { headers, rows }
}

function exportTableAsExcel<TData extends RowData>(
  table: TableInstance<TData>,
  fileName: string,
  getExportValue?: (row: TableRow<TData>, columnId: string) => unknown
) {
  const { headers, rows } = getExportData(
    table,
    getExportValue
  )

  const worksheet = XLSX.utils.aoa_to_sheet([
    headers,
    ...rows,
  ])

  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Data'
  )

  const date = new Date().toISOString().slice(0, 10)

  XLSX.writeFile(
    workbook,
    `${fileName}-${date}.xlsx`
  )
}

/* ---------- filter panel (opens from the Filter icon) ---------- */

const ipOptions = Array.from(
  new Set(analyticsData.map((r) => String(r.ipAddress)))
).sort()

const filterInputClass =
  'w-full rounded-[8px] border border-[#d4d4d4] bg-white px-3 py-1.5 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100 dark:placeholder:text-gray-500'
// Date pickers and dropdowns are clickable, so they get the pointer cursor.
const filterClickableClass = `${filterInputClass} cursor-pointer`

function FilterField({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: ReactNode
}) {
  return (
    <div className="flex w-full flex-col gap-1.5 sm:w-[200px]">
      <label
        htmlFor={htmlFor}
        className="text-[14px] text-gray-700 dark:text-gray-200"
      >
        {label}
      </label>
      {children}
    </div>
  )
}

// Each field writes straight into the table's column filters, so the table
// updates as you type. Fields only appear for columns the current view has
// (the Country view only gets the Country field).
function FilterPanel<TData extends RowData>({
  table,
}: {
  table: TableInstance<TData>
}) {
  const dateColumn = findColumn(table, 'viewedAt')
  const countryColumn = findColumn(table, 'country')
  const ipColumn = findColumn(table, 'ipAddress')

  const range = (dateColumn?.getFilterValue() as DateRange | undefined) ?? {}
  const hasFilters = table.state.columnFilters.length > 0

  function updateRange(next: DateRange) {
    // An empty range removes the filter entirely.
    dateColumn?.setFilterValue(next.start || next.end ? next : undefined)
  }

  return (
    <div className="flex flex-wrap items-end gap-4">
      {dateColumn && (
        <>
          <FilterField label="Start Date" htmlFor="filter-start-date">
            <input
              id="filter-start-date"
              type="date"
              value={range.start ?? ''}
              max={range.end || undefined}
              onChange={(event) => updateRange({ ...range, start: event.target.value })}
              className={`${filterClickableClass} dark:[color-scheme:dark]`}
            />
          </FilterField>

          <FilterField label="End Date" htmlFor="filter-end-date">
            <input
              id="filter-end-date"
              type="date"
              value={range.end ?? ''}
              min={range.start || undefined}
              onChange={(event) => updateRange({ ...range, end: event.target.value })}
              className={`${filterClickableClass} dark:[color-scheme:dark]`}
            />
          </FilterField>
        </>
      )}

      {countryColumn && (
        <FilterField label="Country" htmlFor="filter-country">
          <input
            id="filter-country"
            type="text"
            placeholder="India, U.S, Canada.."
            value={String(countryColumn.getFilterValue() ?? '')}
            onChange={(event) => countryColumn.setFilterValue(event.target.value)}
            className={filterInputClass}
          />
        </FilterField>
      )}

      {ipColumn && (
        <FilterField label="Ignore IP Address" htmlFor="filter-ignore-ip">
          <div className="relative">
            <select
              id="filter-ignore-ip"
              value={String(ipColumn.getFilterValue() ?? '')}
              onChange={(event) => ipColumn.setFilterValue(event.target.value)}
              className={`${filterClickableClass} appearance-none pr-8`}
            >
              <option value="">Select Option</option>
              {ipOptions.map((ip) => (
                <option key={ip} value={ip}>
                  {ip}
                </option>
              ))}
            </select>
            <Icon
              d={iconPaths.chevron}
              className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            />
          </div>
        </FilterField>
      )}

      {hasFilters && (
        <button
          type="button"
          onClick={() => table.resetColumnFilters(true)}
          className="h-[34px] cursor-pointer rounded-[8px] px-3 text-[13px] font-medium text-gray-600 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-[#00B2FF]/60 dark:text-gray-300 dark:hover:bg-neutral-800"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}

/* ---------- shared table pieces ---------- */

const theadRowClass =
  'border-b border-[#d4d4d4] bg-gray-50 text-gray-600 dark:bg-neutral-800 dark:border-neutral-700 dark:text-gray-300'
const thClass =
  'px-4 py-3 font-semibold whitespace-nowrap overflow-hidden text-ellipsis'
const trClass =
  'border-b border-[#d4d4d4] last:border-b-0 dark:border-neutral-800'
const tdClass =
  'px-4 py-3 whitespace-nowrap text-gray-700 dark:text-gray-200 overflow-hidden text-ellipsis'

function TableFrame({
  minWidth,
  children,
}: {
  minWidth: number
  children: ReactNode
}) {
  return (
    <div className="overflow-x-auto max-w-full [scrollbar-width:none] [scrollbar-color:#d4d4d4_transparent] border border-[#d4d4d4] rounded-[8px] bg-white dark:bg-neutral-900 dark:border-neutral-800">
      <table
        className="w-full table-fixed text-left text-[14px]"
        style={{ minWidth }}
      >
        {children}
      </table>
    </div>
  )
}

function EmptyRow({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
      >
        No rows match your search or filters. Try changing them.
      </td>
    </tr>
  )
}

/* ---------- pagination ---------- */

const PAGE_SIZES = [5, 10, 20, 50, 100]
const DEFAULT_PAGE_SIZE = 5

const pad2 = (value: number) => String(value).padStart(2, '0')

// 1-based page numbers plus gap markers, e.g. 1 2 ...... 99 (as in the design).
// Always shows the first page, the last page and the pages around the current
// one. A gap that would hide only one page shows that page instead.
function getPageItems(current: number, total: number): Array<number | string> {
  const pages = [
    ...new Set([1, total, current - 1, current, current + 1]),
  ]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b)

  const items: Array<number | string> = []
  let previous = 0

  for (const page of pages) {
    if (previous) {
      if (page - previous === 2) items.push(previous + 1)
      else if (page - previous > 2) items.push(`gap-after-${previous}`)
    }
    items.push(page)
    previous = page
  }

  return items
}

const pageButtonClass =
  'flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-[8px] border bg-white px-3 text-[13px] outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#00B2FF]/60 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:disabled:hover:bg-neutral-900'
const pageButtonIdleClass =
  'border-[#d4d4d4] text-gray-700 dark:border-neutral-700 dark:text-gray-200'
const pageButtonActiveClass =
  'border-[#00B2FF] text-[#0082D1] dark:text-[#00B2FF]'

function Pagination<TData extends RowData>({
  table,
}: {
  table: TableInstance<TData>
}) {
  const { pageIndex, pageSize } = table.state.pagination
  const currentPage = pageIndex + 1
  const totalPages = Math.max(table.getPageCount(), 1)
  const items = getPageItems(currentPage, totalPages)

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-[14px] text-gray-700 dark:text-gray-200">
      <div className="flex items-center gap-2">
        <span>Show</span>
        <div className="relative">
          <select
            aria-label="Entries per page"
            value={pageSize}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
            className="h-8 cursor-pointer appearance-none rounded-[8px] border border-[#d4d4d4] bg-white pl-2.5 pr-6 text-[13px] text-gray-900 outline-none focus:border-gray-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {pad2(size)}
              </option>
            ))}
          </select>
          <Icon
            d={iconPaths.chevron}
            className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-500 dark:text-gray-400"
          />
        </div>
        <span>Entries</span>
      </div>

      <nav aria-label="Pagination" className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={`${pageButtonClass} ${pageButtonIdleClass}`}
        >
          Previous
        </button>

        {items.map((item) =>
          typeof item === 'number' ? (
            <button
              key={item}
              type="button"
              aria-label={`Page ${item}`}
              aria-current={item === currentPage ? 'page' : undefined}
              onClick={() => table.setPageIndex(item - 1)}
              className={`${pageButtonClass} ${
                item === currentPage ? pageButtonActiveClass : pageButtonIdleClass
              }`}
            >
              {item}
            </button>
          ) : (
            <span
              key={item}
              aria-hidden="true"
              className="select-none px-1 text-gray-500 dark:text-gray-400"
            >
              ......
            </span>
          )
        )}

        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={`${pageButtonClass} ${pageButtonIdleClass}`}
        >
          Next
        </button>
      </nav>
    </div>
  )
}
function exportTableAsPdf<TData extends RowData>(
  table: TableInstance<TData>,
  fileName: string,
  getExportValue?: (row: TableRow<TData>, columnId: string) => unknown
) {
  const exportColumns = table.getVisibleLeafColumns()

  const headers = exportColumns.map((column) =>
    getColumnLabel(column)
  )

  const rows = table.getPrePaginatedRowModel().rows.map((row) =>
    exportColumns.map((column) => {
      const value = getExportValue
        ? getExportValue(row, column.id)
        : row.getValue(column.id)

      return value ?? ''
    })
  )

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  autoTable(pdf, {
    head: [headers],
    body: rows.map((row) =>
      row.map((value) => String(value))
    ),
    startY: 15,
    styles: {
      fontSize: 6,
      cellPadding: 2,
    },
    headStyles: {
      fontSize: 6,
      fontStyle: 'bold',
    },
    theme: 'grid',
    margin: {
      top: 15,
      left: 5,
      right: 5,
    },
  })

  const date = new Date().toISOString().slice(0, 10)

  pdf.save(`${fileName}-${date}.pdf`)
}
/* ---------- LIVE TABLE: toolbar + table + pagination ---------- */

type LiveTableProps<TData extends RowData> = {
  data: TData[]
  columns: TableColumns<TData>
  searchPlaceholder: string
  /** File name used for the CSV export (the date is added automatically). */
  exportName: string
  /** Optional: customise what a cell contains in the CSV. */
  getExportValue?: (row: TableRow<TData>, columnId: string) => unknown
}

function LiveTable<TData extends RowData>({
  data,
  columns: tableColumns,
  searchPlaceholder,
  exportName,
  getExportValue,
}: LiveTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const table = useTable({
    features,
    data,
    columns: tableColumns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    initialState: { pagination: { pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE } },
  })

  const rows = table.getRowModel().rows
  const visibleColumns = table.getVisibleLeafColumns()

  return (
    <div>
      {/* Row 2: search on the left, tool icons on the right */}
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Icon
              d={iconPaths.search}
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
            <input
              type="search"
              aria-label="Search table"
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-[8px] border border-[#d4d4d4] bg-white pl-9 pr-3 py-2 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>

          <div className="flex items-center gap-1">
            <IconButton
              label="Filter"
              d={iconPaths.filter}
              pressed={showFilters}
              badge={table.state.columnFilters.length > 0}
              onClick={() => setShowFilters((open) => !open)}
            />
            <ColumnsMenu table={table} />
            <SortMenu table={table} />
            <ToolbarMenu
            label="Export"
            d={iconPaths.export}
          >
            <div className="px-2 pb-1 pt-1">
              <span className={menuTitleClass}>
                Export as
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                exportTableAsPdf(
                  table,
                  exportName,
                  getExportValue
                )
              }
              className={menuItemClass}
            >
              <span>Export as PDF</span>
            </button>

            <button
              type="button"
              onClick={() =>
                exportTableAsExcel(
                  table,
                  exportName,
                  getExportValue
                )
              }
              className={menuItemClass}
            >
              <span>Export as Excel</span>

              
            </button>
          </ToolbarMenu>
          </div>
        </div>

        {showFilters && <FilterPanel table={table} />}
      </div>

      <TableFrame minWidth={table.getTotalSize()}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className={theadRowClass}>
              {headerGroup.headers.map((header) => {
                const sorted = header.column.getIsSorted()

                return (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className={thClass}
                    aria-sort={
                      sorted === 'asc'
                        ? 'ascending'
                        : sorted === 'desc'
                          ? 'descending'
                          : undefined
                    }
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-1.5">
                        <span className="min-w-0 truncate">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {sorted && (
                          <Icon
                            d={sorted === 'asc' ? iconPaths.arrowUp : iconPaths.arrowDown}
                            className="h-3.5 w-3.5 shrink-0 text-[#0082D1] dark:text-[#00B2FF]"
                          />
                        )}
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <EmptyRow colSpan={Math.max(visibleColumns.length, 1)} />
          ) : (
            rows.map((row) => (
              <tr key={row.id} className={trClass}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    className={tdClass}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </TableFrame>

      <Pagination table={table} />
    </div>
  )
}

/* ---------- OVERVIEW + COUNTRY VIEWS ---------- */

function OverviewTable() {
  return (
    <LiveTable
      data={analyticsData}
      columns={columns}
      searchPlaceholder="Search user ID, IP address..."
      exportName="live-update-overview"
      getExportValue={getOverviewExportValue}
    />
  )
}

function CountryTable() {
  return (
    <LiveTable
      data={countryData}
      columns={countryColumns}
      searchPlaceholder="Search country..."
      exportName="live-update-country"
    />
  )
}

/* ---------- LIVE UPDATE ---------- */

type View = 'overview' | 'country'

const viewOptions: { value: View; label: string }[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'country', label: 'Country' },
]

function LiveUpdate() {
  // Switching view mounts a fresh table, so search, filters, sorting, hidden
  // columns and the page all reset on their own.
  const [view, setView] = useState<View>('overview') // Overview is the default

  return (
    <div className="min-w-0 rounded-[8px] bg-[#FAFAFA] border border-[#d4d4d4] px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-[#404040] dark:text-gray-100">
          Live Update
        </h3>

        <div className="flex items-center gap-4">
          <div className="relative w-32">
            <select
              aria-label="Table view"
              value={view}
              onChange={(e) => setView(e.target.value as View)}
              className="w-full cursor-pointer appearance-none rounded-[8px] border border-[#d4d4d4] bg-white py-1.5 pl-3 pr-8 text-[14px] text-gray-900 outline-none focus:border-gray-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
            >
              {viewOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Icon
              d={iconPaths.chevron}
              className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 text-[14px] font-medium text-gray-700 dark:text-gray-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
            </span>
            Live
          </div>
        </div>
      </div>

      {view === 'overview' ? <OverviewTable /> : <CountryTable />}
    </div>
  )
}

/* =========================================================
   CHART LEGEND
   ========================================================= */

type ChartLegendItemProps = {
  name: string
  color: string
}

function ChartLegendItem({ name, color }: ChartLegendItemProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-3.5 h-3.5 rounded-[3px] shrink-0"
        style={{ backgroundColor: color }}
      />

      <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">
        {name}
      </span>
    </div>
  )
}

/* =========================================================
   ACQUISITION CHANNEL (stacked bar)
   ========================================================= */

type ChannelSeries = {
  name: string
  color: string
  data: number[]
}

const acquisitionMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept']

const acquisitionChannels: ChannelSeries[] = [
  { name: 'Direct', color: '#BDE8FF', data: [38, 45, 38, 52, 41, 48, 51, 53, 45] },
  { name: 'Referral', color: '#00B2FF', data: [40, 35, 50, 44, 55, 39, 25, 54, 36] },
  { name: 'Social', color: '#0082D1', data: [35, 42, 30, 48, 36, 51, 41, 30, 48] },
  { name: 'SEO', color: '#00507E', data: [55, 38, 55, 40, 50, 42, 53, 47, 24] },
]

function AcquisitionChannel() {
  const isDark = useIsDark()
  const theme = isDark ? chartTheme.dark : chartTheme.light
  const stackedSeries = useMemo(() => [...acquisitionChannels].reverse(), [])

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'bar',
        stacked: true,
        toolbar: { show: false },
        fontFamily: 'inherit',
        foreColor: theme.text,
        background: 'transparent',
      },

      colors: stackedSeries.map((series) => series.color),

      plotOptions: {
        bar: {
          columnWidth: '45%',
          borderRadius: 12,
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'all',
        },
      },

      dataLabels: { enabled: false },

      xaxis: {
        categories: acquisitionMonths,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { fontSize: '12px' } },
      },

      yaxis: {
        min: 0,
        max: 240,
        tickAmount: 6,
        labels: { style: { fontSize: '12px' } },
      },

      grid: {
        borderColor: theme.grid,
        strokeDashArray: 0,
        xaxis: { lines: { show: false } },
      },

      legend: { show: false },

      tooltip: { theme: 'dark' },

      states: { hover: { filter: { type: 'none' } } },
    }),
    [theme, stackedSeries]
  )

  return (
    <div className="w-full min-w-0 h-[500px] bg-[#FAFAFA] border border-[#d4d4d4] rounded-[8px] p-6 flex flex-col dark:bg-neutral-900 dark:border-neutral-800 transition-colors duration-200">
      <h3 className="text-xl font-semibold text-[#404040] dark:text-gray-100">
        Acquisition Channel
      </h3>

      <div className="flex items-center gap-4 sm:gap-5 flex-wrap mt-3">
        {acquisitionChannels.map((item) => (
          <ChartLegendItem
            key={item.name}
            name={item.name}
            color={item.color}
          />
        ))}
      </div>

      <div className="flex-1 min-h-0 min-w-0 w-full mt-2">
        <Chart
          options={options}
          series={stackedSeries.map(({ name, data }) => ({ name, data }))}
          type="bar"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  )
}

/* =========================================================
   SESSIONS BY DEVICE (donut)
   ========================================================= */

type DeviceSlice = {
  name: string
  color: string
  value: number
}

// Replace the numbers with real session counts.
const deviceSessions: DeviceSlice[] = [
  { name: 'Mobile', color: '#BDE8FF', value: 1240 },
  { name: 'Tablet', color: '#00B2FF', value: 2610 },
  { name: 'Laptop / PC', color: '#0082D1', value: 4830 },
]

function SessionsByDevice() {
  const isDark = useIsDark()
  const theme = isDark ? chartTheme.dark : chartTheme.light

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'donut',
        foreColor: theme.text,
        fontFamily: 'inherit',
        redrawOnWindowResize: true,
        background: 'transparent',
      },

      labels: deviceSessions.map((item) => item.name),

      colors: deviceSessions.map((item) => item.color),

      // Slice gaps match the card background in each mode
      stroke: {
        show: true,
        width: 4,
        colors: [theme.stroke],
      },

      plotOptions: {
        pie: {
          expandOnClick: false,
          donut: {
            size: '57%',
            labels: { show: false },
          },
          borderRadius: 12,
        },
      },

      dataLabels: { enabled: false },

      legend: { show: false },

      tooltip: {
        enabled: true,
        theme: 'dark',
        y: {
          formatter: (value: number) =>
            `${value.toLocaleString('en-IN')} sessions`,
        },
      },

      states: { hover: { filter: { type: 'none' } } },
    }),
    [theme]
  )

  return (
    <div className="w-full min-w-0 h-[500px] bg-[#FAFAFA] border border-[#d4d4d4] rounded-[8px] p-6 flex flex-col dark:bg-neutral-900 dark:border-neutral-800 transition-colors duration-200">
      <h3 className="text-[18px] font-semibold text-gray-900 dark:text-gray-100">
        Sessions By Device
      </h3>

      <div className="flex-1 min-h-0 min-w-0 w-full my-2">
        <Chart
          options={options}
          series={deviceSessions.map((item) => item.value)}
          type="donut"
          width="100%"
          height="100%"
        />
      </div>

      <div className="flex items-center justify-center gap-5 sm:gap-8 flex-wrap">
        {deviceSessions.map((item) => (
          <ChartLegendItem
            key={item.name}
            name={item.name}
            color={item.color}
          />
        ))}
      </div>
    </div>
  )
}

/* =========================================================
   PAGE
   ========================================================= */

export default function Admin() {
  return (
    <div className="flex flex-col gap-5 w-full min-w-0">
      <Visit />
      <LiveUpdate />

      {/* Bottom charts */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 items-stretch">
        <AcquisitionChannel />
        <SessionsByDevice />
      </div>
    </div>
  )
}