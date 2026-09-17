import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { paymentData } from '../config/payment-data';

export default function PaymentChart() {
  const [selectedYear, setSelectedYear] = useState(paymentData.selectedYear);

  const options = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: { show: false },
      fontFamily: 'inherit',
    },
    colors: paymentData.series.map((s) => s.color),
    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 6,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: paymentData.categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: '#000000', fontSize: '13px' },
      },
    },
    yaxis: {
      min: 0,
      max: 15000,
      tickAmount: 5,
      labels: {
        style: { colors: '#000000', fontSize: '12px' },
        formatter: (value) => {
          if (value === 0) return '0';
          return `${value / 1000}k`;
        },
      },
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 0, // Solid horizontal grid lines
      xaxis: { lines: { show: false } },
    },
    legend: {
      show: false, // Using custom header legend for exact placement
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (value) => `₹${value.toLocaleString('en-IN')}`,
      },
    },
    states: {
      hover: { filter: { type: 'none' } },
    },
  };

  return (
    <div className="bg-white border border-[#d4d4d4] rounded-[12px] w-[720px] h-[447px] p-6 flex flex-col justify-between dark:bg-neutral-900 dark:border-neutral-800 transition-colors duration-200">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[22px] font-bold text-gray-900 dark:text-gray-100">
            {paymentData.title}
          </h3>
          <p className="text-[13px] text-gray-500 mt-0.5 dark:text-gray-400">
            {paymentData.subtitle}
          </p>
          <p className="text-[28px] font-extrabold text-gray-900 mt-1 dark:text-white">
            {paymentData.totalAmount}
          </p>
        </div>

        <div className="flex flex-col items-end gap-5">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm font-medium text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-gray-200"
          >
            {paymentData.availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-5">
            {paymentData.series.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-[3px] shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stacked Bar Chart */}
      <div className="flex-1 w-full mt-4">
        <Chart
          options={options}
          series={paymentData.series}
          type="bar"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
}