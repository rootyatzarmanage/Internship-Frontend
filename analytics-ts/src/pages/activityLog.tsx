import { useState } from 'react'
import { Search } from 'lucide-react'
import { ActivityTabs } from '../features/analytics/activityTab'
import type { ActivityFilter } from '../features/analytics/activityTab'
import { Pagination } from '../features/analytics/pagination'

type ActivityType = 'Projects' | 'Meetings' | 'Workspaces'

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
  Workspaces: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
}

/* =========================================================
   ACTIVITY LOG
   ========================================================= */

export default function ActivityLog() {
  const [filter, setFilter] = useState<ActivityFilter>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const filtered = activityLogMock.filter(
    (item) => {
      const matchesFilter = filter === 'All' || item.type === filter
      const matchesSearch =
        normalizedSearchQuery.length === 0 ||
        [item.user, item.action, item.target].some((value) =>
          value.toLowerCase().includes(normalizedSearchQuery),
        )

      return matchesFilter && matchesSearch
    },
  )

  const pageCount = Math.max(Math.ceil(filtered.length / pageSize), 1)
  const currentPage = Math.min(pageIndex, pageCount - 1)

  const items = filtered.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  )

  const handleFilterChange = (value: ActivityFilter) => {
    setFilter(value)
    setPageIndex(0) 
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setPageIndex(0)
  }

  return (
    <div className={`grid grid-cols-1 xl:grid-cols-[1.65fr_1fr] gap-5 items-stretch`}>
      <div className="flex w-full min-w-0 flex-col overflow-hidden rounded-[8px] border border-[#d4d4d4] bg-white transition-colors duration-200 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex min-h-0 flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-[20px] font-semibold text-gray-900 dark:text-gray-100">
                Activity log
              </h3>
            </div>

            <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
              Latest changes across your workspaces
            </p>
          </div>

          <label className="flex h-[35px] w-[300px] max-w-full min-w-0 shrink items-center gap-2 rounded-[6px] border-[0.5px] border-[#bbbbbb] bg-white px-2 text-black dark:border-[#303030] dark:bg-[#151515] dark:text-gray-100">
            <Search size={14} strokeWidth={1.8} aria-hidden="true" />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search activity..."
              aria-label="Search activity log"
              className="min-w-0 flex-1 bg-transparent text-xs text-[#414141] outline-none placeholder:text-[#aeb0b4] dark:text-gray-100 dark:placeholder:text-gray-400"
            />
          </label>
        </div>

        <div>
          <ActivityTabs value={filter} onChange={handleFilterChange} />
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
    </div>
  )
}