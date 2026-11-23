import { useMemo } from 'react'
import { usePageVisits, aggregateCountryAnalytics } from '../api/page-visit-api'
import { countryAnalyticsMock } from '../mock'
import { countryColumns } from '../columns'
import { LiveTable } from './LiveTable'
 
export function CountryTable() {
  const { data: visits } = usePageVisits()
  const data = useMemo(() => {
    if (visits && visits.length > 0) {
      return aggregateCountryAnalytics(visits)
    }
    return countryAnalyticsMock
  }, [visits])
 
  return (
<LiveTable
      data={data}
      columns={countryColumns}
      searchPlaceholder="Search country..."
      exportName="live-update-country"
    />
  )
}