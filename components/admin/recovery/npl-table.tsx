"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/data/dummy-data";
import { Phone, MoreHorizontal, MessageSquare, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface NPLLoan {
  id: string;
  loanId: string;
  clientName: string;
  clientPhone: string;
  originalAmount: number;
  outstandingAmount: number;
  daysOverdue: number;
  assignedAgent: string;
  lastAction: string;
  lastActionDate: string;
  flaggedAt: string;
}

interface NPLTableProps {
  nplLoans: NPLLoan[];
}

export function NPLTable({ nplLoans }: NPLTableProps) {
  const [search, setSearch] = useState("");

  const filteredLoans = nplLoans.filter(
    (loan) =>
      loan.loanId.toLowerCase().includes(search.toLowerCase()) ||
      loan.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const getOverdueBadge = (days: number) => {
    if (days >= 90) return "bg-red-100 text-red-800";
    if (days >= 60) return "bg-amber-100 text-amber-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const columns = [
    {
      key: "loanId",
      header: "Loan ID",
      render: (loan: NPLLoan) => (
        <span className="font-mono text-sm font-medium text-slate-900">
          {loan.loanId}
        </span>
      ),
    },
    {
      key: "clientName",
      header: "Client",
      render: (loan: NPLLoan) => (
        <div>
          <p className="font-medium text-slate-900">{loan.clientName}</p>
          <p className="text-xs text-slate-500">{loan.clientPhone}</p>
        </div>
      ),
    },
    {
      key: "outstandingAmount",
      header: "Outstanding",
      render: (loan: NPLLoan) => (
        <div>
          <p className="font-semibold text-red-600">
            {formatCurrency(loan.outstandingAmount)}
          </p>
          <p className="text-xs text-slate-500">
            of {formatCurrency(loan.originalAmount)}
          </p>
        </div>
      ),
      className: "text-right",
    },
    {
      key: "daysOverdue",
      header: "Days Overdue",
      render: (loan: NPLLoan) => (
        <Badge className={getOverdueBadge(loan.daysOverdue)}>
          {loan.daysOverdue} days
        </Badge>
      ),
      className: "text-center",
    },
    {
      key: "assignedAgent",
      header: "Assigned To",
      render: (loan: NPLLoan) => (
        <span className="text-sm font-medium text-slate-700">
          {loan.assignedAgent}
        </span>
      ),
    },
    {
      key: "lastAction",
      header: "Last Action",
      render: (loan: NPLLoan) => (
        <div>
          <p className="text-sm text-slate-600">{loan.lastAction}</p>
          <p className="text-xs text-slate-400">{formatDate(loan.lastActionDate)}</p>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (loan: NPLLoan) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                toast.info(`Calling ${loan.clientName}`, {
                  description: loan.clientPhone,
                })
              }
            >
              <Phone className="mr-2 h-4 w-4" />
              Call Client
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.info(`Sending SMS to ${loan.clientName}`)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Send SMS
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.info(`Scheduling visit for ${loan.clientName}`)}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Schedule Visit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => toast.info(`Recording action for ${loan.loanId}`)}
            >
              Record Action
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.info(`Reassigning ${loan.loanId}`)}
            >
              Reassign Agent
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-12",
    },
  ];

  return (
    <DataTable
      data={filteredLoans}
      columns={columns}
      searchPlaceholder="Search NPL loans..."
      searchValue={search}
      onSearchChange={setSearch}
    />
  );
}
