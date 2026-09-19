import { menuItems } from './config/Visitors'
import { analyticsData } from './config/LiveUpdate'
import type { AnalyticsRecord } from './config/LiveUpdate'
import {
  columnSizingFeature,
  createColumnHelper,
  flexRender,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'

type VisitProp = {
  className?: string
}

type MenuItem = {
  label: string
  number: string
}

/* =========================================================
   VISIT STATS
   ========================================================= */

function Visit({ className = '' }: VisitProp) {
  const projects = menuItems as MenuItem[]

  return (
    <div
      className={`grid md:grid-cols-3 grid-cols-1 gap-3 w-full ${className}`}
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
   LIVE UPDATE TABLE (TanStack Table v9)
   ========================================================= */

// v9: features are opt-in. `size` / getSize() come from columnSizingFeature.
// The core row model is automatic (no getCoreRowModel).
const features = tableFeatures({ columnSizingFeature })

const columnHelper = createColumnHelper<
  typeof features,
  AnalyticsRecord
>()

const columns = columnHelper.columns([
  columnHelper.accessor('sNo', { header: 'S.No', size: 70 }),
  columnHelper.accessor('pageName', { header: 'Page Name', size: 120 }),
  columnHelper.accessor('pageUrl', { header: 'Page URL', size: 120 }),
  columnHelper.accessor('previousPage', { header: 'Previous Page', size: 120 }),
  columnHelper.accessor('user', {
    header: 'User',
    size: 150,
    cell: (info) => (
      <div>
        <div>{info.getValue().name}</div>
        <div className="text-[11px] font-bold text-gray-600 dark:text-gray-400">
          ID: {info.getValue().id}
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('ipAddress', { header: 'IP Address', size: 140 }),
  columnHelper.accessor('country', { header: 'Country', size: 100 }),
  columnHelper.accessor('region', { header: 'Region', size: 120 }),
  columnHelper.accessor('city', { header: 'City', size: 120 }),
  columnHelper.accessor('pinCode', { header: 'Pin code', size: 100 }),
  columnHelper.accessor('device', { header: 'Device', size: 100 }),
  columnHelper.accessor('operatingSystem', { header: 'Operating System', size: 150 }),
  columnHelper.accessor('browser', { header: 'Browser', size: 110 }),
  columnHelper.accessor('timeZone', { header: 'Time Zone', size: 110 }),
  columnHelper.accessor('durationInSec', { header: 'Duration (in sec)', size: 140 }),
  columnHelper.accessor('viewedAt', { header: 'Viewed at', size: 180 }),
])

function LiveUpdate() {
  const table = useTable({
    features,
    data: analyticsData,
    columns,
  })

  return (
    // min-w-0 allows flexbox parents to shrink and trigger overflow-x-auto
    <div className="w-full min-w-0 overflow-x-auto [scrollbar-width:none] [scrollbar-color:#d4d4d4_transparent] dark:[scrollbar-color:#404040_transparent] border border-[#E2E8F0] rounded-[8px] bg-white dark:bg-neutral-900 dark:border-neutral-800">
      {/* table-fixed honors column pixel sizes, min-w-max prevents squishing */}
      <table className="w-full min-w-max table-fixed border-collapse text-left text-[14px]">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border-b border-[#E2E8F0] bg-gray-50 text-gray-600 dark:bg-neutral-800 dark:border-neutral-700 dark:text-gray-300"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{ width: `${header.getSize()}px` }}
                  className="px-4 py-3 font-semibold whitespace-nowrap overflow-hidden text-ellipsis"
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
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-[#EDF2F7] last:border-b-0 dark:border-neutral-800"
            >
              {/* getVisibleCells() needs columnVisibilityFeature; getAllCells() doesn't */}
              {row.getAllCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{ width: `${cell.column.getSize()}px` }}
                  className="px-4 py-3 whitespace-nowrap text-gray-700 dark:text-gray-200 overflow-hidden text-ellipsis"
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
    </div>
  )
}