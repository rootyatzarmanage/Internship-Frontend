import { usePageVisits } from '../api/page-visit-api'
import { analyticsDataMock } from '../mock'
import { columns } from '../columns'
import { getOverviewExportValue } from '../tableConfig'
import { LiveTable } from './LiveTable'
 
export function OverviewTable() {
  const { data: visits } = usePageVisits()
  const data = visits && visits.length > 0 ? visits : analyticsDataMock
 
  return (
<LiveTable
      data={data}
      columns={columns}
      searchPlaceholder="Search user ID, IP address..."
      exportName="live-update-overview"
      getExportValue={getOverviewExportValue}
    />
  )
}