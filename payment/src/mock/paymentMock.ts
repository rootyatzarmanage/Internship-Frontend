import type {
  AcquisitionChannel,
  PaymentMetric,
  PaymentMethodSession,
  SalesRecord,
} from '../types/payment'

export const paymentMetricsMock: PaymentMetric[] = [
  { label: 'Total Revenue', value: 12800, changePercent: 12.5, context: 'This Month' },
  { label: 'Total Transactions', value: 1400, changePercent: 87.5, context: 'This Month' },
  { label: 'Successful Payments', value: 1380, changePercent: 90, context: 'Success Rate' },
  { label: 'Monthly Transaction', value: 14, changePercent: 4.3, context: 'Rate' },
]

export const salesListMock: SalesRecord[] = [
  {
    id: 's1', userId: 1, salesNo: 'UAN2792', plan: 'PIM',
    user: { name: 'Alex James', email: 'alexjames@company.com' },
    amount: 5000, currency: 'INR', paymentMethod: 'Card', paymentStatus: 'Success',
    date: '2026-08-27T12:02:00Z',
  },
  {
    id: 's2', userId: 2, salesNo: 'UHA3923', plan: 'AIM',
    user: { name: 'Mary Jane', email: 'janemary@company.com' },
    amount: 10000, currency: 'INR', paymentMethod: 'UPI', paymentStatus: 'Success',
    date: '2026-08-27T12:02:00Z',
  },
  {
    id: 's3', userId: 3, salesNo: 'YAM2932', plan: 'PIM + AIM',
    user: { name: 'Devi Viswanath', email: 'deviv@company.com' },
    amount: 12500, currency: 'USD', paymentMethod: 'Card', paymentStatus: 'Success',
    date: '2026-08-27T12:02:00Z',
  },
  {
    id: 's4', userId: 4, salesNo: 'UHA3923', plan: 'PIM',
    user: { name: 'Harry Osborn', email: 'harryosborn@company.com' },
    amount: 5000, currency: 'INR', paymentMethod: 'UPI', paymentStatus: 'Success',
    date: '2026-08-27T12:02:00Z',
  },
  {
    id: 's5', userId: 5, salesNo: 'UAN2792', plan: 'PIM',
    user: { name: 'Kanye West', email: 'yegoat45@company.com' },
    amount: 5000, currency: 'INR', paymentMethod: 'UPI', paymentStatus: 'Success',
    date: '2026-08-27T12:02:00Z',
  },
  {
    id: 's6', userId: 6, salesNo: 'YAM2932', plan: 'AIM',
    user: { name: 'Jean Gray', email: 'jean3gray@company.com' },
    amount: 10000, currency: 'INR', paymentMethod: 'Card', paymentStatus: 'Failed',
    date: '2026-08-27T12:02:00Z',
  },
  {
    id: 's7', userId: 7, salesNo: 'YAM2932', plan: 'AIM',
    user: { name: 'Taylor Swift', email: 'swiftt@company.com' },
    amount: 10000, currency: 'INR', paymentMethod: 'Card', paymentStatus: 'Success',
    date: '2026-08-27T12:02:00Z',
  },
  {
    id: 's8', userId: 8, salesNo: 'YAM2932', plan: 'AIM',
    user: { name: 'Alex James', email: 'alexjames@company.com' },
    amount: 10000, currency: 'INR', paymentMethod: 'Card', paymentStatus: 'Pending',
    date: '2026-08-27T12:02:00Z',
  },
]

export const acquisitionMonthsMock = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept']

export const acquisitionChannelsMock: AcquisitionChannel[] = [
  { name: 'PIM Project', data: [38, 45, 38, 52, 41, 48, 51, 53, 45] },
  { name: 'AIM Project', data: [40, 35, 50, 44, 55, 39, 25, 54, 36] },
  { name: 'PIM + AIM Project', data: [35, 42, 30, 48, 36, 51, 41, 30, 48] },
]

export const yearlyRevenueMock = {
  year: 2026,
  total: 257340,
}

export const deviceSessionsMock: PaymentMethodSession[] = [
  { name: 'Card', value: 37 },
  { name: 'UPI', value: 63 },
]
