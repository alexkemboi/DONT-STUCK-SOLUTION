"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InvestorStats as IInvestorStats } from "@/lib/types";
import {
  Banknote,
  PiggyBank,
  TrendingUp,
  Percent,
  Wallet,
} from "lucide-react";

interface InvestorStatsProps {
  stats: IInvestorStats;
}

export function InvestorStats({ stats }: InvestorStatsProps) {
  const cards = [
    {
      title: "Portfolio Value",
      value: `$${stats.portfolioValue.toLocaleString()}`,
      icon: Wallet,
      description: "Total portfolio worth",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Invested",
      value: `$${stats.totalInvested.toLocaleString()}`,
      icon: Banknote,
      description: "Principal amount",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Returns",
      value: `$${stats.totalReturns.toLocaleString()}`,
      icon: TrendingUp,
      description: "Earnings to date",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Average Return",
      value: `${stats.averageReturn.toFixed(1)}%`,
      icon: Percent,
      description: "ROI percentage",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Active Investments",
      value: stats.activeInvestments,
      icon: PiggyBank,
      description: "Current loans funded",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
