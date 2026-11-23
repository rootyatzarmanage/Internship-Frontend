import { Fragment, useEffect, useMemo, useRef, useState } from 'react'

import type { ReactNode } from 'react'

import { flexRender, useTable } from '@tanstack/react-table'

import type { RowData } from '@tanstack/react-table'

import { Icon } from '../../../shared/icons/Icon'

import { iconPaths } from '../../../shared/icons/iconPaths'

import { FilterPanel } from './FilterPanel'

import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from '../constants'

import {

  exportTableAsExcel,

  exportTableAsPdf,

  features,

  getColumnLabel,

} from '../tableConfig'

import type {

  TableColumn,

  TableColumns,

  TableInstance,

  TableRow,

} from '../tableConfig'
 
const iconButtonClass =

  'relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-[8px] text-gray-600 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-[#00B2FF]/60 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:text-gray-300 dark:hover:bg-neutral-800 dark:disabled:hover:bg-transparent'
 
type IconButtonProps = {

  label: string

  d: string

  onClick?: () => void

  pressed?: boolean

  expanded?: boolean

  badge?: boolean

  disabled?: boolean

  showTooltip?: boolean

  className?: string

}
 
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
 
const menuPanelClass =

  'absolute right-0 top-full z-20 mt-2 w-64 rounded-[8px] border border-[#d4d4d4] bg-white p-1.5 shadow-md dark:border-neutral-700 dark:bg-neutral-900'

const menuTitleClass =

  'text-[13px] font-semibold text-gray-900 dark:text-gray-100'

const menuActionClass =

  'cursor-pointer rounded-[4px] px-1 text-[12px] font-medium text-[#0082D1] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#00B2FF]/60 disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline dark:text-[#00B2FF]'

const menuItemClass =

  'flex w-full items-center justify-between gap-2 rounded-[6px] px-2 py-1.5 text-left text-[13px] text-gray-700 outline-none hover:bg-gray-100 focus-visible:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800'
 
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
 
function SortMenu<TData extends RowData>({

  table,

}: {

  table: TableInstance<TData>

}) {

  const sortableColumns = table.getAllLeafColumns().filter((column) => column.getCanSort())

  const hasSorting = table.state.sorting.length > 0
 
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
 
const pad2 = (value: number) => String(value).padStart(2, '0')
 
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
 
function PageVisitPagination<TData extends RowData>({

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
 
function toLocalIsoDate(d: Date): string {

  const year = d.getFullYear()

  const month = String(d.getMonth() + 1).padStart(2, '0')

  const day = String(d.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`

}
 
function getInitialColumnFilters<TData extends RowData>(

  columns: TableColumns<TData>,

  defaultOneWeekFilter: boolean

) {

  if (!defaultOneWeekFilter) return []
 
  const hasViewedAt = columns.some(

    (col: any) =>

      col.id === 'viewedAt' ||

      col.accessorKey === 'viewedAt' ||

      (typeof col.accessorFn === 'function' && col.id === 'viewedAt')

  )

  if (!hasViewedAt) return []
 
  const now = new Date()

  const end = toLocalIsoDate(now)

  const startObj = new Date(now)

  startObj.setDate(startObj.getDate() - 7)

  const start = toLocalIsoDate(startObj)
 
  return [{ id: 'viewedAt', value: { start, end } }]

}
 
export type LiveTableProps<TData extends RowData> = {

  data: TData[]

  columns: TableColumns<TData>

  searchPlaceholder: string

  exportName: string

  getExportValue?: (row: TableRow<TData>, columnId: string) => unknown

  defaultShowFilters?: boolean

  defaultOneWeekFilter?: boolean

  defaultVisibleColumnIds?: string[]

  /** When set, rows become expandable and this renders the dropdown content. */
  renderRowDetail?: (row: TableRow<TData>) => ReactNode

}
 
export function LiveTable<TData extends RowData>({

  data,

  columns: tableColumns,

  searchPlaceholder,

  exportName,

  getExportValue,

  defaultShowFilters = true,

  defaultOneWeekFilter = true,

  defaultVisibleColumnIds,

  renderRowDetail,

}: LiveTableProps<TData>) {

  const [globalFilter, setGlobalFilter] = useState('')

  const [showFilters, setShowFilters] = useState(defaultShowFilters)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggleRow = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
 
  const initialColumnFilters = useMemo(

    () => getInitialColumnFilters(tableColumns, defaultOneWeekFilter),

    [tableColumns, defaultOneWeekFilter]

  )
 
  // Only the listed column ids are visible initially; the rest stay available in the Columns menu.
  const initialColumnVisibility = useMemo(() => {
    if (!defaultVisibleColumnIds) return {}
    return Object.fromEntries(
      tableColumns.map((col: any) => {
        const id = col.id ?? col.accessorKey
        return [id, defaultVisibleColumnIds.includes(id)]
      })
    )
  }, [tableColumns, defaultVisibleColumnIds])

  const table = useTable({

    features,

    data,

    columns: tableColumns,

    state: { globalFilter },

    onGlobalFilterChange: setGlobalFilter,

    initialState: {

      pagination: { pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE },

      columnFilters: initialColumnFilters,

      columnVisibility: initialColumnVisibility,

    },

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
<ToolbarMenu label="Export" d={iconPaths.export}>
<div className="px-2 pb-1 pt-1">
<span className={menuTitleClass}>Export as</span>
</div>
 
              <button

                type="button"

                onClick={() => exportTableAsPdf(table, exportName, getExportValue)}

                className={menuItemClass}
>
<span>Export as PDF</span>
</button>
 
              <button

                type="button"

                onClick={() => exportTableAsExcel(table, exportName, getExportValue)}

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

            rows.map((row) => {
              const isOpen = expanded.has(row.id)
              const cells = row.getVisibleCells()

              return (
                <Fragment key={row.id}>
                  <tr
                    className={`${trClass} ${
                      renderRowDetail ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800' : ''
                    }`}
                    onClick={renderRowDetail ? () => toggleRow(row.id) : undefined}
                  >
                    {cells.map((cell, index) => {
                      const content = flexRender(cell.column.columnDef.cell, cell.getContext())

                      return (
                        <td key={cell.id} style={{ width: cell.column.getSize() }} className={tdClass}>
                          {renderRowDetail && index === 0 ? (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                aria-expanded={isOpen}
                                aria-label={isOpen ? 'Hide details' : 'Show details'}
                                onClick={(event) => {
                                  event.stopPropagation()
                                  toggleRow(row.id)
                                }}
                                className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded text-gray-500 outline-none focus-visible:ring-2 focus-visible:ring-[#00B2FF]/60 dark:text-gray-400"
                              >
                                <Icon
                                  d={iconPaths.chevron}
                                  className={`h-3.5 w-3.5 transition-transform ${isOpen ? '' : '-rotate-90'}`}
                                />
                              </button>
                              <span className="min-w-0 truncate">{content}</span>
                            </div>
                          ) : (
                            content
                          )}
                        </td>
                      )
                    })}
                  </tr>

                  {renderRowDetail && isOpen && (
                    <tr className={trClass}>
                      <td colSpan={cells.length} className="bg-gray-50 px-4 py-4 dark:bg-neutral-800/50">
                        {renderRowDetail(row)}
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })

          )}
</tbody>
</TableFrame>
 
      <PageVisitPagination table={table} />
</div>

  )

}

 
 
 
 