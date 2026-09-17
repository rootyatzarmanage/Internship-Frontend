import React from 'react';
import { menuItems } from '../config/project-content';

export default function Page({ className = '' }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 w-fit ${className}`}>
      {menuItems.map((item, index) => (
        <div
          key={index}
          className="bg-white border border-[#D4D4D4] rounded-[8px] px-5 py-10 h-[170px] w-[353.5px] flex flex-col justify-between dark:bg-neutral-900 dark:border-neutral-800"
        >
          <p className="text-[18px] font-medium text-gray-900 dark:text-gray-100">
            {item.label}
          </p>
          <div className="text-[48px] font-bold text-gray-900 leading-none dark:text-white">
            {item.number}
          </div>
        </div>
      ))}
    </div>
  );
}