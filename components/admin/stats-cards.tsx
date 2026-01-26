"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/types";
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  Clock,
  FileText,
  TrendingUp,
} from "lucide-react";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: FileText,
      description: "All time submissions",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Pending Review",
      value: stats.pendingReview,
      icon: Clock,
      description: "Awaiting decision",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Approved Loans",
      value: stats.approvedLoans,
      icon: CheckCircle2,
      description: "Successfully approved",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Total Disbursed",
      value: `$${(stats.totalDisbursed / 1000).toFixed(0)}K`,
      icon: Banknote,
      description: "Funds released",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Loans",
      value: stats.activeLoans,
      icon: TrendingUp,
      description: "Currently repaying",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Overdue Payments",
      value: stats.overduePayments,
      icon: AlertTriangle,
      description: "Require attention",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
