"use client";

import { useState } from "react";
import { StatsCards } from "./stats-cards";
import { ApplicationsTable } from "./applications-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { DashboardStats, LoanStatus } from "@/lib/types";
import { LayoutDashboard, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LoanApplicationRow {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  loan_type: string;
  requested_amount: number;
  approved_amount: number | null;
  tenure_months: number;
  status: LoanStatus;
  monthly_income: number;
  created_at: string;
}

interface AdminDashboardProps {
  initialStats: DashboardStats;
  initialApplications: LoanApplicationRow[];
}

export function AdminDashboard({
  initialStats,
  initialApplications,
}: AdminDashboardProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const filteredApplications =
    statusFilter === "all"
      ? initialApplications
      : initialApplications.filter((app) => app.status === statusFilter);

  const statusCounts = {
    all: initialApplications.length,
    submitted: initialApplications.filter((a) => a.status === "submitted").length,
    under_review: initialApplications.filter((a) => a.status === "under_review").length,
    approved: initialApplications.filter((a) => a.status === "approved").length,
    disbursed: initialApplications.filter((a) => a.status === "disbursed").length,
    rejected: initialApplications.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Admin Dashboard</h1>
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
        <StatsCards stats={initialStats} />

        <div className="mt-8">
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold">Loan Applications</h2>
              <TabsList>
                <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
                <TabsTrigger value="submitted">
                  Pending ({statusCounts.submitted})
                </TabsTrigger>
                <TabsTrigger value="under_review">
                  Review ({statusCounts.under_review})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({statusCounts.approved})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({statusCounts.rejected})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={statusFilter} className="mt-0">
              <ApplicationsTable applications={filteredApplications} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
