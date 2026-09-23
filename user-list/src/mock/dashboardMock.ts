import type { AcquisitionDataPoint, SessionStatus, UserMetric } from '../types/dashboard'

export const userMetricsMock: UserMetric[] = [
  { id: 'total-users', label: 'Total Users', value: 12400, changePercent: 12, context: 'vs Last Month' },
  { id: 'active-users', label: 'Active Users', value: 11200, changePercent: 87.5, context: 'Engagement Rate' },
  { id: 'verified-users', label: 'Verified Users', value: 10900, changePercent: 90, context: 'Active Base' },
  { id: 'new-signups', label: 'New Signups', value: 840, changePercent: 4.3, context: 'vs Last Month' },
]

export const acquisitionDataMock: AcquisitionDataPoint[] = [
  { month: 'Jan', verified: 55, notVerified: 95 },
  { month: 'Feb', verified: 85, notVerified: 82 },
  { month: 'Mar', verified: 38, notVerified: 80 },
  { month: 'Apr', verified: 102, notVerified: 58 },
  { month: 'May', verified: 71, notVerified: 36 },
  { month: 'Jun', verified: 48, notVerified: 151 },
  { month: 'Jul', verified: 91, notVerified: 141 },
  { month: 'Aug', verified: 53, notVerified: 80 },
  { month: 'Sept', verified: 45, notVerified: 48 },
]

export const sessionStatusMock: SessionStatus[] = [
  { status: 'Deactive', count: 37 },
  { status: 'Offline', count: 63 },
  { status: 'Active', count: 63 },
]
