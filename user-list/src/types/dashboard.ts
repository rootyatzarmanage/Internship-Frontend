export interface UserMetric {
  id: string
  label: string
  value: number
  changePercent: number
  context: string
}

export interface AcquisitionDataPoint {
  month: string
  verified: number
  notVerified: number
}

export interface SessionStatus {
  status: 'Deactive' | 'Offline' | 'Active'
  count: number
}
