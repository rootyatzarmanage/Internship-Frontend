import React from 'react';
import TotalProject from './TotalProjects';
import Overview from './AnalyticsOverview';
import Payment from './PaymentChart';

function Page() {
  return (
    <div className="h-screen bg-[#F8F8F8] text-gray-500 transition-colors dark:bg-black dark:text-gray-300 p-8">
      <div className="flex flex-col lg:flex-row items-start justify-center gap-5">
        <TotalProject />
        <Overview />
      </div>
      <div className="flex flex-col lg:flex-row items-start pt-5 pl-50">
        <Payment />
      </div>
    </div>
  );
}

export default Page;