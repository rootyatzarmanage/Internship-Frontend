export interface VisitorMetricValue {
  value: number
  changePercent: number
}

export interface VisitorSummary {
  uniqueVisitors: VisitorMetricValue
  totalPageViews: VisitorMetricValue
  averageVisitDurationSeconds: VisitorMetricValue
}

export interface AnalyticsUser {
  name: string
  id: string
}

export interface AnalyticsRecord {
  sNo: number
  pageName: string
  pageUrl: string
  previousPage: string
  user: AnalyticsUser
  ipAddress: string
  country: string
  region: string
  city: string
  pinCode: string
  device: string
  operatingSystem: string
  browser: string
  timeZone: string
  durationInSec: number
  viewedAt: string
}

export interface CountryAnalyticsRecord {
  sNo: number
  country: string
  totalView: number
  loginView: number
  withoutLoginView: number
  totalVisits: number
  newVisitors: number
  avgDuration: number
}

export interface AcquisitionRecord {
  month: string
  direct: number
  referral: number
  social: number
  seo: number
}

export interface DeviceSessionRecord {
  device: string
  sessions: number
}
