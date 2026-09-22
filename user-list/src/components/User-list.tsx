import { useEffect, useRef, useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import {
  columnFilteringFeature,
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
import type { ReactTable, Row } from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'
import { menuItems } from './config/Visitors'
import { userListData } from './config/UserData'
import type { User } from './config/UserData'
import Chart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'

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

/* -------------------------------------------------------------------------- */
/*  Stat cards                                                                */
/* -------------------------------------------------------------------------- */

type VisitProp = {
  className?: string
}

type MenuItem = {
  label: string
  number: string
  percent: string
  time: string
}

function Visit({ className = '' }: VisitProp) {
  const projects = menuItems as MenuItem[]

  return (
    <div
      className={`grid lg:grid-cols-4 grid-cols-1 gap-3 w-full ${className}`}
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
              {item.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Table setup (TanStack Table v9)                                           */
/* -------------------------------------------------------------------------- */

const features = tableFeatures({
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
type TableInstance<TData extends User> = ReactTable<Features, TData>
type TableRow<TData extends User> = Row<Features, TData>

/** Case-insensitive "contains" – used by the Name / Email filters and the search box. */
const includesText = (row: TableRow<User>, columnId: string, filterValue: unknown) =>
  String(row.getValue(columnId) ?? '')
    .toLowerCase()
    .includes(String(filterValue).toLowerCase())

/** Exact match on the stringified value – used by the Verified / Status selects. */
const equalsText = (row: TableRow<User>, columnId: string, filterValue: unknown) =>
  String(row.getValue(columnId)) === String(filterValue)

const columnHelper = createColumnHelper<Features, User>()

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'sno',
    header: 'S.no',
    enableSorting: false,
    enableGlobalFilter: false,
    // Position in the filtered + sorted list, continuing across pages.
    cell: ({ table, row }) => {
      const { pageIndex, pageSize } = table.store.state.pagination
      return pageIndex * pageSize + table.getRowModel().rows.indexOf(row) + 1
    },
  }),
  columnHelper.accessor('userId', {
    id: 'userId',
    header: 'User ID',
  }),
  columnHelper.accessor('name', {
    id: 'name',
    header: 'Name',
    filterFn: includesText,
  }),
  columnHelper.accessor('email', {
    id: 'email',
    header: 'Email',
    filterFn: includesText,
  }),
  columnHelper.accessor('phone', {
    id: 'phone',
    header: 'Phone Number',
    enableGlobalFilter: false,
  }),
  columnHelper.accessor('workspaceCount', {
    id: 'workspaceCount',
    header: 'Workspace Count',
    enableGlobalFilter: false,
  }),
  columnHelper.accessor('projects', {
    id: 'projects',
    header: 'Projects',
    enableGlobalFilter: false,
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: 'Status',
    filterFn: equalsText,
    enableGlobalFilter: false,
  }),
  columnHelper.accessor('verified', {
    id: 'verified',
    header: 'Verified',
    filterFn: equalsText,
    enableGlobalFilter: false,
    cell: ({ getValue }) => {
      const isVerified = getValue()
      return (
        <span
          className={`inline-flex items-center gap-1 text-sm font-medium ${
            isVerified ? 'text-sky-500' : 'text-red-500'
          }`}
        >
          <Icon d={isVerified ? iconPaths.checkCircle : iconPaths.xCircle} className="size-4" />
          {isVerified ? 'Verified' : 'Not Verified'}
        </span>
      )
    },
  }),
  columnHelper.accessor('lastLogin', {
    id: 'lastLogin',
    header: 'Last Login',
    enableGlobalFilter: false,
  }),
  columnHelper.accessor('registered', {
    id: 'registered',
    header: 'Registered',
    enableGlobalFilter: false,
  }),
])

/** Search box: match User ID, Name or Email only. */
const globalSearch = (row: TableRow<User>, columnId: string, filterValue: unknown) =>
  includesText(row, columnId, filterValue)

/* -------------------------------------------------------------------------- */
/*  Export helpers                                                            */
/* -------------------------------------------------------------------------- */

const EXPORT_NAME = 'user-list'

function getExportValue(row: TableRow<User>, columnId: string, index: number): string | number {
  if (columnId === 'sno') return index + 1
  const value = row.getValue(columnId)
  return typeof value === 'number' ? value : String(value ?? '')
}

/** Everything that matches the current filters/sort – not just the visible page. */
function getExportData(table: TableInstance<User>) {
  const cols = table.getVisibleLeafColumns()
  const head = cols.map((c) =>
    typeof c.columnDef.header === 'string' ? c.columnDef.header : c.id
  )
  const body = table
    .getPrePaginatedRowModel()
    .rows.map((row, i) => cols.map((c) => getExportValue(row, c.id, i)))
  return { head, body }
}

async function exportAsPdf(table: TableInstance<User>) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])
  const { head, body } = getExportData(table)
  const doc = new jsPDF({ orientation: 'landscape' })
  doc.setFontSize(14)
  doc.text('User List', 14, 14)
  autoTable(doc, {
    head: [head],
    body: body.map((r) => r.map(String)),
    startY: 20,
    styles: { fontSize: 9, halign: 'center' },
    headStyles: { fillColor: [64, 64, 64] },
  })
  doc.save(`${EXPORT_NAME}.pdf`)
}

async function exportAsExcel(table: TableInstance<User>) {
  const XLSX = await import('xlsx')
  const { head, body } = getExportData(table)
  const sheet = XLSX.utils.aoa_to_sheet([head, ...body])
  const book = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(book, sheet, 'Users')
  XLSX.writeFile(book, `${EXPORT_NAME}.xlsx`)
}

/* -------------------------------------------------------------------------- */
/*  Icons (inline so there are no extra dependencies)                         */
/* -------------------------------------------------------------------------- */

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
  checkCircle: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  xCircle: 'M9.75 9.75l4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
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

const svgBase = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

const FileBadgeIcon = ({ label }: { label: 'PDF' | 'XLS' }) => (
  <span className="relative grid size-5 place-items-center text-neutral-600 dark:text-neutral-300">
    <svg {...svgBase} className="size-5">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5" />
    </svg>
    <span className="absolute bottom-[3px] text-[5px] font-bold leading-none">{label}</span>
  </span>
)

/* -------------------------------------------------------------------------- */
/*  Small UI pieces                                                           */
/* -------------------------------------------------------------------------- */

const inputBase =
  'h-8 rounded-md border border-neutral-300 bg-white px-2.5 text-xs text-neutral-700 ' +
  'placeholder:text-neutral-400 outline-none transition-colors focus:border-sky-500 ' +
  'dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200'

function IconButton({
  label,
  active = false,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      onClick={onClick}
      className={`grid size-9 place-items-center rounded-md text-neutral-700 transition-colors
        hover:bg-neutral-200/70 focus-visible:outline-2 focus-visible:outline-sky-500
        dark:text-neutral-200 dark:hover:bg-neutral-800 cursor-pointer
        ${active ? 'bg-sky-200 text-sky-600 hover:bg-sky-200 dark:bg-sky-900 dark:text-sky-200 dark:hover:bg-sky-900' : ''}`}
    >
      {children}
    </button>
  )
}

function MenuPanel({ children }: { children: ReactNode }) {
  return (
    <div
      role="menu"
      className="absolute right-0 top-full z-20 mt-2 min-w-48 rounded-lg border border-neutral-300 bg-white p-1
        text-sm text-neutral-700 shadow-md dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
    >
      {children}
    </div>
  )
}

const menuRow =
  'flex w-full items-center justify-between gap-6 rounded-md px-3 py-2 text-left ' +
  'hover:bg-neutral-100 dark:hover:bg-neutral-800'

function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-neutral-700 dark:text-neutral-200">
      {label}
      {children}
    </label>
  )
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <span className="relative block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} w-full min-w-[200px] appearance-none pr-8 ${value ? '' : 'text-neutral-400'}`}
      >
        <option value="">Select Option</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Icon d={iconPaths.chevron} className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-neutral-500" />
    </span>
  )
}

const pageButton =
  'h-10 min-w-10 rounded-md border border-neutral-300 bg-[#FAFAFA] px-3 text-sm text-neutral-600 ' +
  'transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 ' +
  'dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'

/** 1 2 …… 99, or 1 …… 4 5 6 …… 99 – always first, last and the current neighbourhood. */
function getPageItems(current: number, total: number): (number | 'gap-start' | 'gap-end')[] {
  const wanted = new Set([0, current - 1, current, current + 1, total - 1])
  if (current === 0) wanted.add(1)
  if (current === total - 1) wanted.add(total - 2)
  const pages = [...wanted].filter((p) => p >= 0 && p < total).sort((a, b) => a - b)

  const items: (number | 'gap-start' | 'gap-end')[] = []
  pages.forEach((page, i) => {
    const prev = pages[i - 1]
    if (prev !== undefined) {
      if (page - prev === 2) items.push(prev + 1)
      else if (page - prev > 2) items.push(prev === 0 ? 'gap-start' : 'gap-end')
    }
    items.push(page)
  })
  return items
}

/* -------------------------------------------------------------------------- */
/*  User list                                                                 */
/* -------------------------------------------------------------------------- */

type MenuName = 'columns' | 'sort' | 'export'

const PAGE_SIZES = [5, 10, 20, 50]

function UserTable() {
  const [showFilters, setShowFilters] = useState(false)
  const [openMenu, setOpenMenu] = useState<MenuName | null>(null)
  const actionsRef = useRef<HTMLDivElement>(null)

  const table = useTable({
    features,
    columns,
    data: userListData,
    getRowId: (row) => row.id,
    globalFilterFn: globalSearch,
    initialState: {
      pagination: { pageIndex: 0, pageSize: PAGE_SIZES[0] },
    },
  })

  // Close the open toolbar menu on outside click / Escape.
  useEffect(() => {
    if (!openMenu) return
    const onPointerDown = (e: PointerEvent) => {
      if (!actionsRef.current?.contains(e.target as Node)) setOpenMenu(null)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openMenu])

  const toggleMenu = (name: MenuName) => setOpenMenu((cur) => (cur === name ? null : name))

  const { pageIndex, pageSize } = table.state.pagination
  const pageCount = table.getPageCount()
  const rows = table.getRowModel().rows
  const visibleColumnCount = table.getVisibleLeafColumns().length

  const filterValue = (id: string) => (table.getColumn(id)?.getFilterValue() as string | undefined) ?? ''
  const setFilter = (id: string, value: string) =>
    table.getColumn(id)?.setFilterValue(value === '' ? undefined : value)

  const runExport = async (kind: 'pdf' | 'excel') => {
    setOpenMenu(null)
    try {
      if (kind === 'pdf') await exportAsPdf(table)
      else await exportAsExcel(table)
    } catch (err) {
      console.error(`Export as ${kind} failed`, err)
    }
  }

  return (
    <section
      className="w-full rounded-2xl border border-[#D4D4D4] bg-[#FAFAFA] p-5 sm:px-6 sm:py-7
        dark:border-neutral-800 dark:bg-neutral-900"
    >
      <h2 className="text-2xl font-semibold text-neutral-700 dark:text-neutral-100">User List</h2>

      {/* Toolbar */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-[280px]">
          <Icon d={iconPaths.search} className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="search"
            value={(table.state.globalFilter as string | undefined) ?? ''}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            placeholder="Search User ID,Name, Emai..."
            aria-label="Search users"
            className="h-8 w-full rounded-md border border-[#d4d4d4] bg-white pl-8 pr-2 text-xs text-neutral-700
              placeholder:text-neutral-500 outline-none focus:border-gray-600
              dark:border-neutral-500 dark:bg-neutral-900 dark:text-neutral-200"
          />
        </div>

        <div ref={actionsRef} className="flex items-center gap-1">
          <IconButton label="Filter" active={showFilters} onClick={() => setShowFilters((v) => !v)}>
            <Icon d={iconPaths.filter} />
          </IconButton>

          <div className="relative">
            <IconButton label="Columns" active={openMenu === 'columns'} onClick={() => toggleMenu('columns')}>
              <Icon d={iconPaths.columns} />
            </IconButton>
            {openMenu === 'columns' && (
              <MenuPanel>
                {table
                  .getAllLeafColumns()
                  .filter((c) => c.getCanHide())
                  .map((column) => (
                    <label key={column.id} className={`${menuRow} cursor-pointer`}>
                      {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={(e) => column.toggleVisibility(e.target.checked)}
                        className="size-4 accent-sky-500"
                      />
                    </label>
                  ))}
              </MenuPanel>
            )}
          </div>

          <div className="relative">
            <IconButton label="Sort" active={openMenu === 'sort'} onClick={() => toggleMenu('sort')}>
              <Icon d={iconPaths.sort} />
            </IconButton>
            {openMenu === 'sort' && (
              <MenuPanel>
                {table
                  .getAllLeafColumns()
                  .filter((c) => c.getCanSort())
                  .map((column) => {
                    const sorted = column.getIsSorted()
                    return (
                      <button
                        key={column.id}
                        type="button"
                        role="menuitem"
                        className={menuRow}
                        // none → ascending → descending → none
                        onClick={() =>
                          table.setSorting(
                            sorted === false
                              ? [{ id: column.id, desc: false }]
                              : sorted === 'asc'
                                ? [{ id: column.id, desc: true }]
                                : []
                          )
                        }
                      >
                        {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                        <span className="w-4 text-right text-sky-600" aria-label={sorted || 'not sorted'}>
                          {sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : ''}
                        </span>
                      </button>
                    )
                  })}
              </MenuPanel>
            )}
          </div>

          <div className="relative">
            <IconButton label="Export" active={openMenu === 'export'} onClick={() => toggleMenu('export')}>
              <Icon d={iconPaths.export} />
            </IconButton>
            {openMenu === 'export' && (
              <MenuPanel>
                <button type="button" role="menuitem" className={menuRow} onClick={() => runExport('pdf')}>
                  Export as PDF
                  <FileBadgeIcon label="PDF" />
                </button>
                <button type="button" role="menuitem" className={menuRow} onClick={() => runExport('excel')}>
                  Export as Excel
                  <FileBadgeIcon label="XLS" />
                </button>
              </MenuPanel>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mt-5 flex flex-wrap items-end gap-x-5 gap-y-3">
          <FilterField label="Name">
            <input
              value={filterValue('name')}
              onChange={(e) => setFilter('name', e.target.value)}
              placeholder="Eg. Alex James"
              className={`${inputBase} w-[200px]`}
            />
          </FilterField>
          <FilterField label="Email">
            <input
              value={filterValue('email')}
              onChange={(e) => setFilter('email', e.target.value)}
              placeholder="Eg. alexjames@company.com"
              className={`${inputBase} w-[202px]`}
            />
          </FilterField>
          <FilterField label="Verified">
            <SelectField
              value={filterValue('verified')}
              onChange={(v) => setFilter('verified', v)}
              options={[
                { value: 'true', label: 'Verified' },
                { value: 'false', label: 'Not verified' },
              ]}
            />
          </FilterField>
          <FilterField label="Status">
            <SelectField
              value={filterValue('status')}
              onChange={(v) => setFilter('status', v)}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Offline', label: 'Offline' },
                { value: 'Deactive', label: 'Deactive' },
              ]}
            />
          </FilterField>

          {table.state.columnFilters.length > 0 && (
            <button
              type="button"
              onClick={() => table.resetColumnFilters(true)}
              className="h-8 cursor-pointer rounded-md px-3 text-[13px] font-medium text-neutral-600 outline-none
                transition-colors hover:bg-neutral-200/70 focus-visible:ring-2 focus-visible:ring-sky-500/60
                dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Table — horizontally scrollable, scrollbar hidden across browsers */}
      <div
        className="mt-5 overflow-x-auto rounded-xl border border-[#D4D4D4] dark:border-neutral-700
          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <table className="w-full min-w-[1180px] border-collapse text-center">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="h-[46px] whitespace-nowrap px-3 text-base font-medium text-neutral-700 dark:text-neutral-100"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr className="border-t border-[#D4D4D4] dark:border-neutral-700">
                <td colSpan={visibleColumnCount} className="h-24 text-sm text-neutral-500">
                  No users match your search or filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-[#D4D4D4] dark:border-neutral-700">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="h-[44px] whitespace-nowrap px-3 text-sm text-neutral-600 dark:text-neutral-300"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
          Show
          <span className="relative">
            <select
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              aria-label="Entries per page"
              className="h-9 appearance-none rounded-md border border-neutral-300 bg-[#FAFAFA] pl-2.5 pr-7 text-sm
                outline-none focus:border-sky-500 dark:border-neutral-700 dark:bg-neutral-900"
            >
              {PAGE_SIZES.map((n) => (
                <option key={n} value={n}>
                  {String(n).padStart(2, '0')}
                </option>
              ))}
            </select>
            <Icon d={iconPaths.chevron} className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2" />
          </span>
          Entries
        </div>

        <nav aria-label="Pagination" className="flex items-center gap-2">
          <button
            type="button"
            className={pageButton}
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            Previous
          </button>

          {getPageItems(pageIndex, pageCount).map((item) =>
            typeof item === 'number' ? (
              <button
                key={item}
                type="button"
                aria-current={item === pageIndex ? 'page' : undefined}
                onClick={() => table.setPageIndex(item)}
                className={`${pageButton} ${
                  item === pageIndex
                    ? 'border-sky-500 text-sky-500 hover:bg-[#FAFAFA] dark:hover:bg-neutral-900'
                    : ''
                }`}
              >
                {item + 1}
              </button>
            ) : (
              <span key={item} className="px-1 text-sm text-neutral-500" aria-hidden="true">
                ......
              </span>
            )
          )}

          <button
            type="button"
            className={pageButton}
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next
          </button>
        </nav>
      </div>
    </section>
  )
}

type ChannelSeries = {
  name: string
  color: string
  data: number[]
}

const acquisitionMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept']

const acquisitionChannels: ChannelSeries[] = [
  { name: 'Verified', color: '#BDE8FF', data: [55, 85, 38, 102, 71, 48, 91, 53, 45] },
  { name: 'Not Verified', color: '#0082D1', data: [95, 82, 80, 58, 36, 151, 141, 80, 48] },
]

//barchart
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

      <span className="text-[13px] font-medium text-[#404040] dark:text-gray-300">
        {name}
      </span>
    </div>
  )
}

function AcquisitionChannel() {
  const [selectedYear, setSelectedYear] = useState('2026')
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
      {/* Header Container with Title and Dropdown */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-[#404040] dark:text-gray-100">
          Verified Status
        </h3>

        {/* Year Select Dropdown */}
        <div className="relative inline-block">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="appearance-none bg-white dark:bg-neutral-800 border border-[#d4d4d4] dark:border-neutral-700 rounded-[8px] pl-3.5 pr-8 py-1.5 text-sm font-medium text-[#404040] dark:text-gray-200 cursor-pointer outline-none transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-750"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#404040] dark:text-gray-300" />
        </div>
      </div>

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

//donut

type DeviceSlice = {
  name: string
  color: string
  value: number
}

// Replace the numbers with real session counts.
const deviceSessions: DeviceSlice[] = [
  { name: 'Deactive', color: '#B8E6FE', value: 37 },
  { name: 'Offline', color: '#00BCFF', value: 63 },
  { name: 'Active', color: '#0082D1', value: 63 },
]

function SessionsByPayment() {
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
          customScale: 0.8,
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
            `${value.toLocaleString('en-IN')}`,
        },
      },

      states: { hover: { filter: { type: 'none' } } },
    }),
    [theme]
  )

  return (
    <div className="w-full min-w-0 h-[500px] bg-[#FAFAFA] border border-[#d4d4d4] rounded-[8px] p-6 flex flex-col dark:bg-neutral-900 dark:border-neutral-800 transition-colors duration-200">
      <h3 className="text-2xl font-semibold text-[#404040] dark:text-gray-100">
        Sessions By Status
      </h3>

      <div className="flex-2 min-h-0 min-w-0 w-full my-2">
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

export default function UserList() {
  return (
    <div className="flex w-full flex-col gap-5">
      <Visit />
      <UserTable />
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 items-stretch">
        <AcquisitionChannel />
        <SessionsByPayment />
      </div>
    </div>
  )
}