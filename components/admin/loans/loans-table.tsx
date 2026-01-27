"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, statusColors } from "@/lib/data/dummy-data";
import { Eye, MoreHorizontal, CheckCircle, XCircle, Banknote } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Loan {
  id: string;
  clientName: string;
  clientId: string;
  amount: number;
  approvedAmount: number | null;
  interestRate: number;
  tenure: number;
  status: string;
  purpose: string;
  appliedAt: string;
  qualificationType: string;
}

interface LoansTableProps {
  loans: Loan[];
}

export function LoansTable({ loans }: LoansTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.id.toLowerCase().includes(search.toLowerCase()) ||
      loan.clientName.toLowerCase().includes(search.toLowerCase()) ||
      loan.purpose.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (loan: Loan) => {
    toast.success(`Loan ${loan.id} approved!`, {
      description: `${formatCurrency(loan.amount)} for ${loan.clientName}`,
    });
  };

  const handleReject = (loan: Loan) => {
    toast.error(`Loan ${loan.id} rejected`, {
      description: `Application from ${loan.clientName}`,
    });
  };

  const handleDisburse = (loan: Loan) => {
    toast.success(`Disbursement initiated for ${loan.id}`, {
      description: `${formatCurrency(loan.approvedAmount || loan.amount)} via M-Pesa`,
    });
  };

  const columns = [
    {
      key: "id",
      header: "Loan ID",
      render: (loan: Loan) => (
        <span className="font-mono text-sm font-medium text-slate-900">
          {loan.id}
        </span>
      ),
    },
    {
      key: "clientName",
      header: "Client",
      render: (loan: Loan) => (
        <div>
          <p className="font-medium text-slate-900">{loan.clientName}</p>
          <p className="text-xs text-slate-500">{loan.clientId}</p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (loan: Loan) => (
        <div>
          <p className="font-medium text-slate-900">{formatCurrency(loan.amount)}</p>
          {loan.approvedAmount && loan.approvedAmount !== loan.amount && (
            <p className="text-xs text-emerald-600">
              Approved: {formatCurrency(loan.approvedAmount)}
            </p>
          )}
        </div>
      ),
      className: "text-right",
    },
    {
      key: "tenure",
      header: "Tenure",
      render: (loan: Loan) => (
        <span className="text-sm text-slate-600">{loan.tenure} months</span>
      ),
      className: "text-center",
    },
    {
      key: "qualificationType",
      header: "Type",
      render: (loan: Loan) => (
        <Badge variant="outline" className="text-xs">
          {loan.qualificationType}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (loan: Loan) => (
        <Badge className={statusColors[loan.status]}>{loan.status}</Badge>
      ),
    },
    {
      key: "appliedAt",
      header: "Applied",
      render: (loan: Loan) => (
        <span className="text-sm text-slate-500">{formatDate(loan.appliedAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (loan: Loan) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toast.info(`Viewing ${loan.id}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {loan.status === "Pending" && (
              <>
                <DropdownMenuItem
                  onClick={() => handleApprove(loan)}
                  className="text-emerald-600"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleReject(loan)}
                  className="text-red-600"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </DropdownMenuItem>
              </>
            )}
            {loan.status === "Approved" && (
              <DropdownMenuItem
                onClick={() => handleDisburse(loan)}
                className="text-blue-600"
              >
                <Banknote className="mr-2 h-4 w-4" />
                Disburse
              </DropdownMenuItem>
            )}
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
      searchPlaceholder="Search loans..."
      searchValue={search}
      onSearchChange={setSearch}
      filterOptions={[
        { label: "All Statuses", value: "all" },
        { label: "Pending", value: "Pending" },
        { label: "Approved", value: "Approved" },
        { label: "Disbursed", value: "Disbursed" },
        { label: "Active", value: "Active" },
        { label: "NPL", value: "NPL" },
      ]}
      filterValue={statusFilter}
      onFilterChange={setStatusFilter}
    />
  );
}
