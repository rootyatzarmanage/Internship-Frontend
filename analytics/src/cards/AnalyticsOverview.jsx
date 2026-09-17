import React from 'react';
import Chart from 'react-apexcharts';
import { menuItems } from '../config/project-content';

export default function OverviewChart() {
  const colors = ['#00a3f5', '#032b49', '#67c8ff', '#bde8ff'];

  const getShortLabel = (label) => label.replace(/^No\.\s*of\s*/i, '');

  const series = menuItems.map((item) => parseInt(item.number, 10) || 0);
  const data = menuItems.map((item, index) => ({
    label: getShortLabel(item.label),
    color: colors[index % colors.length],
  }));

  const labels = menuItems.map((item) => getShortLabel(item.label));

  const chartOptions = {
    chart: {
      type: 'donut',
      // Dynamically matches tooltip text to dark/light theme
      foreColor: '#9ca3af',
    },
    labels: labels,
    colors: colors,
    stroke: {
      show: true,
      width: 4, // Gap spacing between donut segments
      // Uses transparent/current border trick to blend seamlessly in both themes
      colors: ['var(--chart-stroke-color, #ffffff)'],
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '58%',
          labels: { show: false },
        },
        borderRadius: 12,
        borderRadiusApplication: 'around',
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: {
      enabled: true,
      // Tooltip dark theme configuration
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: 'inherit',
      },
    },
    states: { hover: { filter: { type: 'none' } } },
  };

  return (
    <div className="bg-white border border-[#d4d4d4] rounded-[8px] p-7 w-[433px] h-[352px] flex flex-col justify-between dark:bg-neutral-900 dark:border-neutral-800 transition-colors duration-200">
      {/* Title */}
      <h3 className="text-[20px] font-large text-gray-900 dark:text-gray-100">
        Overview
      </h3>

      <div className="flex items-center justify-between my-auto px-2">
        {/* Scaled Donut Chart */}
        <div className="w-[210px] [--chart-stroke-color:#ffffff] dark:[--chart-stroke-color:#171717]">
          <Chart
            options={chartOptions}
            series={series}
            type="donut"
            width="100%"
            height={210}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-4 pr-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3.5">
              {/* Rounded Square Indicator */}
              <span
                className="w-4 h-4 rounded-[4px] shrink-0"
                style={{ backgroundColor: item.color }}
              />
              {/* Label Name */}
              <span className="text-[15px] font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}