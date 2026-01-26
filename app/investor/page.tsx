import {
  getInvestorStats,
  getInvestorAllocations,
  getAvailableLoansForInvestment,
  getMonthlyPerformance,
} from "@/app/actions/investor-actions";
import { InvestorDashboard } from "@/components/investor/investor-dashboard";

export const metadata = {
  title: "Investor Portfolio | Don't Stuck Solution",
  description: "Manage your loan investments and track returns",
};

// Demo investor ID for display
const DEMO_INVESTOR_ID = "demo-investor-1";

export default async function InvestorPage() {
  const [stats, allocations, availableLoans, performance] = await Promise.all([
    getInvestorStats(DEMO_INVESTOR_ID),
    getInvestorAllocations(DEMO_INVESTOR_ID),
    getAvailableLoansForInvestment(),
    getMonthlyPerformance(DEMO_INVESTOR_ID),
  ]);

  return (
    <InvestorDashboard
      investorId={DEMO_INVESTOR_ID}
      stats={stats}
      allocations={allocations}
      availableLoans={availableLoans}
      performance={performance}
    />
  );
}
