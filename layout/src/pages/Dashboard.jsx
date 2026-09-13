import Header from '../Components/layout/Header'
import Sidebar from '../Components/layout/Sidebar'
import OverallView from '../Components/dashboard/OverallView'
import PaymentChart from '../Components/dashboard/PaymentChart'
import RecentPayments from '../Components/dashboard/RecentPayments'
import SummaryCards from '../Components/dashboard/SummaryCards'

export default function Dashboard({ isSidebarCollapsed, onToggleSidebar }) {
  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <main className="min-w-0 flex-1">
        <Header onToggleSidebar={onToggleSidebar} />
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-[30px] px-6 py-7 xl:grid-cols-[1.35fr_0.9fr]">
          <SummaryCards />
          <OverallView />
          <PaymentChart />
          <RecentPayments />
        </div>
      </main>
    </div>
  )
}
