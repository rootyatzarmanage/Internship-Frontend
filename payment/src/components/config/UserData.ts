export type PaymentMethod = 'Card' | 'UPI';
export type PaymentStatus = 'Success' | 'Failed' | 'Pending';

export type User = {
  name: string;
  email: string;
};

export type SalesRecord = {
  /** Unique row key for React/UI rendering */
  id: string;
  userId: number;
  salesNo: string;
  plan: string;
  user: User;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  date: string;
};

export const salesListData: SalesRecord[] = [
  {
    id: 's1',
    userId: 1,
    salesNo: 'UAN2792',
    plan: 'PIM',
    user: {
      name: 'Alex James',
      email: 'alexjames@company.com',
    },
    amount: 5000,
    currency: 'INR',
    paymentMethod: 'Card',
    paymentStatus: 'Success',
    date: '27 Aug 2026, 05:32 PM',
  },
  {
    id: 's2',
    userId: 2,
    salesNo: 'UHA3923',
    plan: 'AIM',
    user: {
      name: 'Harry Osborn',
      email: 'alexjames@company.com',
    },
    amount: 10000,
    currency: 'INR',
    paymentMethod: 'UPI',
    paymentStatus: 'Success',
    date: '27 Aug 2026, 05:32 PM',
  },
  {
    id: 's3',
    userId: 3,
    salesNo: 'YAM2932',
    plan: 'PIM + AIM',
    user: {
      name: 'Mary Jane',
      email: 'alexjames@company.com',
    },
    amount: 12500,
    currency: 'USD',
    paymentMethod: 'Card',
    paymentStatus: 'Success',
    date: '27 Aug 2026, 05:32 PM',
  },
  {
    id: 's4',
    userId: 4,
    salesNo: 'UHA3923',
    plan: 'PIM',
    user: {
      name: 'Devi Viswanath',
      email: 'alexjames@company.com',
    },
    amount: 5000,
    currency: 'INR',
    paymentMethod: 'UPI',
    paymentStatus: 'Success',
    date: '27 Aug 2026, 05:32 PM',
  },
  {
    id: 's5',
    userId: 5,
    salesNo: 'UAN2792',
    plan: 'PIM',
    user: {
      name: 'Kendrick Lamar',
      email: 'alexjames@company.com',
    },
    amount: 5000,
    currency: 'INR',
    paymentMethod: 'UPI',
    paymentStatus: 'Success',
    date: '27 Aug 2026, 05:32 PM',
  },
  {
    id: 's6',
    userId: 6,
    salesNo: 'YAM2932',
    plan: 'AIM',
    user: {
      name: 'Kanye West',
      email: 'alexjames@company.com',
    },
    amount: 10000,
    currency: 'INR',
    paymentMethod: 'Card',
    paymentStatus: 'Success',
    date: '27 Aug 2026, 05:32 PM',
  },
  {
    id: 's7',
    userId: 7,
    salesNo: 'YAM2932',
    plan: 'AIM',
    user: {
      name: 'Taylor Swift',
      email: 'alexjames@company.com',
    },
    amount: 10000,
    currency: 'INR',
    paymentMethod: 'Card',
    paymentStatus: 'Success',
    date: '27 Aug 2026, 05:32 PM',
  },
  {
    id: 's8',
    userId: 8,
    salesNo: 'YAM2932',
    plan: 'AIM',
    user: {
      name: 'Alex James',
      email: 'alexjames@company.com',
    },
    amount: 10000,
    currency: 'INR',
    paymentMethod: 'Card',
    paymentStatus: 'Success',
    date: '27 Aug 2026, 05:32 PM',
  },
];