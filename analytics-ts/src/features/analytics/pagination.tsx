type PaginationProps = {
  pageIndex: number
  pageSize: number
  pageCount: number
  onPageChange: (index: number) => void
  onPageSizeChange: (size: number) => void
  pageSizes?: number[]
}

type PageItem = number | 'ellipsis'

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
  'h-[34px] min-w-[34px] px-3 rounded-[6px] border text-[13px] transition-colors cursor-pointer ' +
  'border-[#D4D4D4] bg-[#FAFAFA] text-gray-600 hover:bg-gray-100 ' +
  'dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-300 dark:hover:bg-neutral-800 ' +
  'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#FAFAFA] ' +
  'dark:disabled:hover:bg-neutral-900'

const pageBtnActive =
  'border-sky-500 text-sky-500 bg-white hover:bg-white ' +
  'dark:border-sky-400 dark:text-sky-400 dark:bg-neutral-900 dark:hover:bg-neutral-900'

export function Pagination({
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
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E5E5] px-6 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2 text-[13px] font-medium text-gray-700 dark:text-gray-200">
        <span>Show</span>

        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Entries per page"
            className="h-[34px] cursor-pointer appearance-none rounded-[6px] border border-[#D4D4D4] bg-[#FAFAFA] pl-3 pr-7 text-[13px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-sky-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-300"
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