import { USER_DEFAULT_COLUMN_IDS, userColumns, type UserRow } from '../UserData'
import { LiveTable } from './LiveTable'

export function UserTable({ data }: { data: UserRow[] }) {
  return (
    <LiveTable
      data={data}
      columns={userColumns}
      searchPlaceholder="Search IP address, user, role..."
      exportName="live-update-users"
      defaultVisibleColumnIds={USER_DEFAULT_COLUMN_IDS}
      defaultOneWeekFilter={false}
    />
  )
}
