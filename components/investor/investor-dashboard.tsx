"use client";

import { useState } from "react";
import { InvestorStats } from "./investor-stats";
import { PortfolioChart } from "./portfolio-chart";
import { InvestmentsList } from "./investments-list";
import { AvailableLoans } from "./available-loans";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { InvestorStats as IInvestorStats } from "@/lib/types";
import { PiggyBank, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Allocation {
  id: string;
  loan_application_id: string;
  allocated_amount: number;
  expected_return: number;
  actual_return: number;
  status: string;
  created_at: string;
  loan_type: string;
  approved_amount: number;
  interest_rate: number;
  tenure_months: number;
  loan_status: string;
  borrower_name: string;
}

interface AvailableLoan {
  id: string;
  loan_type: string;
  approved_amount: number;
  interest_rate: number;
  tenure_months: number;
  purpose: string;
  borrower_name: string;
  city: string;
  state: string;
  employment_status: string;
  monthly_income: number;
  already_funded: number;
}

interface PerformanceData {
  month: string;
  invested: number;
  returns: number;
}

interface InvestorDashboardProps {
  investorId: string;
  stats: IInvestorStats;
  allocations: Allocation[];
  availableLoans: AvailableLoan[];
  performance: PerformanceData[];
}

export function InvestorDashboard({
  investorId,
  stats,
  allocations,
  availableLoans,
  performance,
}: InvestorDashboardProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success">
              <PiggyBank className="h-5 w-5 text-success-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Investor Portfolio</h1>
              <p className="text-sm text-muted-foreground">
                {"Don't Stuck Solution"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2 bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <InvestorStats stats={stats} />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <PortfolioChart data={performance} />
        </div>

        <div className="mt-8">
          <Tabs defaultValue="investments">
            <TabsList>
              <TabsTrigger value="investments">
                My Investments ({allocations.length})
              </TabsTrigger>
              <TabsTrigger value="available">
                Available Loans ({availableLoans.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="investments" className="mt-6">
              <InvestmentsList allocations={allocations} />
            </TabsContent>

            <TabsContent value="available" className="mt-6">
              <AvailableLoans loans={availableLoans} investorId={investorId} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
