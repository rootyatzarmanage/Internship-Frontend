export type PaymentMethod = 'Card' | 'UPI'
export type PaymentStatus = 'Success' | 'Failed' | 'Pending'

export interface User {
  name: string
  email: string
}

export interface SalesRecord {
  /** Unique row key for React/UI rendering. */
  id: string
  userId: number
  salesNo: string
  plan: string
  user: User
  amount: number
  currency: string
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  /** ISO 8601 timestamp supplied by the eventual backend. */
  date: string
}

export interface PaymentMetric {
  label: string
  value: number
  changePercent: number
  context: string
}

export interface AcquisitionChannel {
  name: string
  data: number[]
}

export interface PaymentMethodSession {
  name: PaymentMethod
  value: number
}
