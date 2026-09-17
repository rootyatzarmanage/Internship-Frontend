export const paymentData = {
  title: 'Payment',
  subtitle: 'Total amount spent',
  totalAmount: '₹25,000.00',
  selectedYear: 2026,
  availableYears: [2026, 2025, 2024],

  // Stacked chart series matching the legend and bar segments
  series: [
    {
      name: 'PIM',
      color: '#67c8ff', // Darker Blue (Top Segment)
      data: [3000, 9000, 4000, 5000, 8500, 10000, 6000],
    },
    {
      name: 'AIM',
      color: '#0085e6', // Lighter Blue (Bottom Segment)
      data: [8800, 4200, 9200, 8500, 4700, 3000, 7200],
    },
  ],

  // X-Axis categories
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
};
