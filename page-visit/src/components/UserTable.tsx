import { USER_DEFAULT_COLUMN_IDS, userColumns, type RoleBreakdown, type UserRow } from './UserData'
import { LiveTable } from './LiveTable'

const roleStyle: Record<string, string> = {
  Guest: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  'Super Admin': 'bg-[#0082D1] text-white',
  Admin: 'bg-sky-200 text-sky-900 dark:bg-sky-800/60 dark:text-sky-100',
}

function UserRowDetail({ breakdown }: { breakdown: RoleBreakdown[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {breakdown.map((item) => (
        <div
          key={item.role}
          className="rounded-[8px] border border-[#d4d4d4] bg-white p-3 text-[13px] dark:border-neutral-700 dark:bg-neutral-900"
        >
          <div className="flex items-center justify-between">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${roleStyle[item.role] ?? 'bg-sky-100 text-sky-700'}`}>
              {item.role}
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {item.visits} visit{item.visits > 1 ? 's' : ''}
            </span>
          </div>
          <p className="mb-2 mt-1 text-[12px] text-gray-500 dark:text-gray-400">{item.users.join(', ')}</p>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#d4d4d4] text-[12px] text-gray-500 dark:border-neutral-700 dark:text-gray-400">
                <th className="py-1 pr-2 font-medium">Page</th>
                <th className="py-1 pr-2 font-medium">Location</th>
                <th className="py-1 text-right font-medium">Visits</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-200">
              {item.pages.map((p) =>
                p.locations.map((loc, i) => (
                  <tr key={p.page + loc.location} className="border-b border-dashed border-[#d4d4d4] last:border-0 dark:border-neutral-700">
                    {i === 0 && (
                      <td rowSpan={p.locations.length} className="py-1.5 pr-2 align-top">{p.page}</td>
                    )}
                    <td className="py-1.5 pr-2 text-gray-500 dark:text-gray-400">{loc.location}</td>
                    <td className="py-1.5 text-right">{loc.visits}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

export function UserTable({ data }: { data: UserRow[] }) {
  return (
    <LiveTable
      data={data}
      columns={userColumns}
      searchPlaceholder="Search IP address, user, role..."
      exportName="live-update-users"
      defaultVisibleColumnIds={USER_DEFAULT_COLUMN_IDS}
      defaultOneWeekFilter={false}
      renderRowDetail={(row) => <UserRowDetail breakdown={row.original.breakdown} />}
    />
  )
}
