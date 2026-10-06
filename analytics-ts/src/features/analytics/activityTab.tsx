import type { ActivityType } from './dailyActivity'

export type ActivityFilter = 'All' | ActivityType

export const ACTIVITY_TABS: ActivityFilter[] = [
  'All',
  'Projects',
  'Meetings',
  'Workspaces',
]

type ActivityTabsProps = {
  value: ActivityFilter
  onChange: (value: ActivityFilter) => void
}

export function ActivityTabs({ value, onChange }: ActivityTabsProps) {
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