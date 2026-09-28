export interface AnalyticsSummary {
  workspaceCount: number
  projectCount: number
  pimProjectCount: number
  aimProjectCount: number
}

export interface PaymentSeries {
  name: string
  color: string
  data: number[]
}

export interface PaymentData {
  title: string
  subtitle: string
  totalAmount: number
  selectedYear: number
  availableYears: number[]
  series: PaymentSeries[]
  categories: string[]
}

export interface PaymentItem {
  id: number
  plan: string
  transactionMethod: string
  amount: number
  paidAt: string
}

export interface MeetingMember {
  id: string
  name: string
  avatarUrl: string
}

export interface MeetingItem {
  id: string
  title: string
  description: string
  date: string
  members: MeetingMember[]
  groupsCount: number
  status: 'Open' | 'On going' | 'Closed'
}
