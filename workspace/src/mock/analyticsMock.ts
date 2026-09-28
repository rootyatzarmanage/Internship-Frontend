import type {
  AnalyticsSummary,
  MeetingItem,
  PaymentData,
  PaymentItem,
} from '../types/analytics'

export const analyticsSummaryMock: AnalyticsSummary = {
  workspaceCount: 3,
  projectCount: 8,
  pimProjectCount: 5,
  aimProjectCount: 3,
}

export const paymentDataMock: PaymentData = {
  title: 'Payment',
  subtitle: 'Total amount spent',
  totalAmount: 25000,
  selectedYear: 2026,
  availableYears: [2026, 2025, 2024],
  series: [
    {
      name: 'PIM',
      color: '#67c8ff',
      data: [3000, 9000, 4000, 5000, 8500, 10000, 6000],
    },
    {
      name: 'AIM',
      color: '#0085e6',
      data: [8800, 4200, 9200, 8500, 4700, 3000, 7200],
    },
  ],
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
}

export const recentPaymentsMock: PaymentItem[] = [
  { id: 1, plan: 'PIM Project', transactionMethod: 'Card', amount: 5000, paidAt: '2026-05-28T15:51:00Z' },
  { id: 2, plan: 'AIM Project', transactionMethod: 'UPI', amount: 10000, paidAt: '2026-05-23T18:51:00Z' },
  { id: 3, plan: 'AIM Project', transactionMethod: 'Card', amount: 10000, paidAt: '2026-05-17T14:51:00Z' },
  { id: 4, plan: 'PIM + AIM Project', transactionMethod: 'UPI', amount: 12500, paidAt: '2026-05-05T15:51:00Z' },
  { id: 5, plan: 'PIM Project', transactionMethod: 'UPI', amount: 5000, paidAt: '2026-04-28T10:51:00Z' },
  { id: 6, plan: 'PIM Project', transactionMethod: 'UPI', amount: 5000, paidAt: '2026-04-20T10:51:00Z' },
  { id: 7, plan: 'PIM + AIM Project', transactionMethod: 'Card', amount: 12500, paidAt: '2026-04-15T10:51:00Z' },
]

const user = (id: string) => ({
  id,
  name: `User ${id}`,
  avatarUrl: `https://i.pravatar.cc/150?img=${id}`,
})

export const latestMeetingsMock: MeetingItem[] = [
  {
    id: '1',
    title: 'M4',
    description: 'M4 discuss about the process of containing co...',
    date: '2026-05-28T15:51:00Z',
    members: [user('1'), user('2'), user('3')],
    groupsCount: 2,
    status: 'Open',
  },
  {
    id: '2',
    title: 'M3',
    description: 'M3 codes about the process of containing co...',
    date: '2026-05-23T18:51:00Z',
    members: [user('1'), user('2')],
    groupsCount: 3,
    status: 'On going',
  },
  {
    id: '3',
    title: 'M2',
    description: 'M2 discuss about the process of containing co...',
    date: '2026-05-17T14:51:00Z',
    members: [user('1'), user('2'), user('3'), user('4')],
    groupsCount: 6,
    status: 'Closed',
  },
  {
    id: '4',
    title: 'M1',
    description: 'M1 discuss about the process of containing co...',
    date: '2026-05-05T15:51:00Z',
    members: [user('1'), user('2')],
    groupsCount: 1,
    status: 'Closed',
  },
  {
    id: '5',
    title: 'M0',
    description: 'M0 discuss about the process of containing co...',
    date: '2026-04-28T10:51:00Z',
    members: [user('1'), user('2'), user('3'), user('4')],
    groupsCount: 9,
    status: 'Closed',
  },
]
