import { useMemo, useState } from 'react'
import { Icon } from '../../../shared/icons/Icon'
import { iconPaths } from '../../../shared/icons/iconPaths'
import { usePageVisits } from '../api/page-visit-api'
import { viewOptions } from '../constants'
import { analyticsDataMock } from '../mock'
import type { View } from '../types'
import { aggregateUserAnalytics, userVisitsMock } from './UserData'
import { OverviewTable } from './OverviewTable'
import { CountryTable } from './CountryTable'
import { UserTable } from './UserTable'

export function LiveUpdate() {
  const [view, setView] = useState<View>('overview')
  const [tab, setTab] = useState<'page' | 'user'>('page')
  const { data: visits } = usePageVisits()
  const hasVisits = Boolean(visits && visits.length > 0)
  const userData = useMemo(
    () => aggregateUserAnalytics(hasVisits ? (visits as any) : userVisitsMock),
    [visits, hasVisits]
  )
  const tabs = [
    { value: 'page' as const, label: 'Page', count: hasVisits ? visits!.length : analyticsDataMock.length },
    { value: 'user' as const, label: 'User', count: userData.length },
  ]

  return (
    <div className="min-w-0 rounded-[8px] bg-[#FAFAFA] border border-[#d4d4d4] px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-[#404040] dark:text-gray-100">
          Live Update
        </h3>

        <div className="flex items-center gap-4">
          {tab === 'page' && (
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
          )}

          <div className="flex items-center gap-2 text-[14px] font-medium text-gray-700 dark:text-gray-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
            </span>
            Live
          </div>
        </div>
      </div>

      <div role="tablist" className="mb-4 flex gap-6 border-b border-[#d4d4d4] dark:border-neutral-800">
        {tabs.map((t) => {
          const active = tab === t.value
          return (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.value)}
              className={`-mb-px flex cursor-pointer items-center gap-2 border-b-2 px-1.5 py-2.5 text-[14px] outline-none ${
                active
                  ? 'border-[#00B2FF] font-medium text-[#0082D1] dark:text-[#00B2FF]'
                  : 'border-transparent text-gray-700 dark:text-gray-300'
              }`}
            >
              {t.label}
              <span className={`rounded-full px-2 text-[11px] ${active ? 'bg-[#00B2FF]/15 text-[#0082D1] dark:text-[#00B2FF]' : 'bg-gray-100 text-gray-500 dark:bg-neutral-800 dark:text-gray-400'}`}>
                {t.count}
              </span>
            </button>
          )
        })}
      </div>

      {tab === 'user' ? <UserTable data={userData} /> : view === 'overview' ? <OverviewTable /> : <CountryTable />}
    </div>
  )
}
