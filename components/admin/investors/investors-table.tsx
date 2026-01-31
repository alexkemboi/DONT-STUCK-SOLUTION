"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/shared/data-table";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Eye, MoreHorizontal, TrendingUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Investor {
  id: string;
  name: string;
  email: string;
  phone: string;
  investedAmount: number;
  activeAllocations: number;
  totalReturns: number;
  joinedAt: string;
}

interface InvestorsTableProps {
  investors: Investor[];
}

export function InvestorsTable({ investors }: InvestorsTableProps) {
  const [search, setSearch] = useState("");

  const filteredInvestors = investors.filter(
    (investor) =>
      investor.name.toLowerCase().includes(search.toLowerCase()) ||
      investor.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      header: "Investor",
      render: (investor: Investor) => (
        <div>
          <p className="font-medium text-slate-900">{investor.name}</p>
          <p className="text-sm text-slate-500">{investor.email}</p>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (investor: Investor) => (
        <span className="text-sm text-slate-600">{investor.phone}</span>
      ),
    },
    {
      key: "investedAmount",
      header: "Invested",
      render: (investor: Investor) => (
        <span className="font-semibold text-slate-900">
          {formatCurrency(investor.investedAmount)}
        </span>
      ),
      className: "text-right",
    },
    {
      key: "activeAllocations",
      header: "Active Loans",
      render: (investor: Investor) => (
        <span className="font-medium text-slate-900">
          {investor.activeAllocations}
        </span>
      ),
      className: "text-center",
    },
    {
      key: "totalReturns",
      header: "Returns",
      render: (investor: Investor) => (
        <div className="flex items-center justify-end gap-1">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <span className="font-semibold text-emerald-600">
            {formatCurrency(investor.totalReturns)}
          </span>
        </div>
      ),
      className: "text-right",
    },
    {
      key: "returnRate",
      header: "Return Rate",
      render: (investor: Investor) => {
        const rate = (investor.totalReturns / investor.investedAmount) * 100;
        return (
          <span className="font-medium text-emerald-600">{rate.toFixed(1)}%</span>
        );
      },
      className: "text-right",
    },
    {
      key: "joinedAt",
      header: "Joined",
      render: (investor: Investor) => (
        <span className="text-sm text-slate-500">
          {formatDate(investor.joinedAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (investor: Investor) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => toast.info(`Viewing ${investor.name}'s portfolio`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Portfolio
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.info(`Viewing ${investor.name}'s allocations`)}
            >
              View Allocations
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.info(`Recording payout for ${investor.name}`)}
            >
              Record Payout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-12",
    },
  ];

  return (
    <DataTable
      data={filteredInvestors}
      columns={columns}
      searchPlaceholder="Search investors..."
      searchValue={search}
      onSearchChange={setSearch}
      onAddClick={() => toast.info("Add investor modal would open")}
      addButtonLabel="Add Investor"
    />
  );
}
