"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, statusColors } from "@/lib/data/dummy-data";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  status: string;
  totalLoans: number;
  outstandingBalance: number;
  joinedAt: string;
}

interface ClientsTableProps {
  clients: Client[];
}

export function ClientsTable({ clients }: ClientsTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase()) ||
      client.phone.includes(search) ||
      client.idNumber.includes(search);
    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: "name",
      header: "Client",
      render: (client: Client) => (
        <div>
          <p className="font-medium text-slate-900">{client.name}</p>
          <p className="text-sm text-slate-500">{client.email}</p>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (client: Client) => (
        <span className="text-sm text-slate-600">{client.phone}</span>
      ),
    },
    {
      key: "idNumber",
      header: "ID Number",
      render: (client: Client) => (
        <span className="font-mono text-sm text-slate-600">{client.idNumber}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (client: Client) => (
        <Badge className={statusColors[client.status]}>{client.status}</Badge>
      ),
    },
    {
      key: "totalLoans",
      header: "Loans",
      render: (client: Client) => (
        <span className="font-medium text-slate-900">{client.totalLoans}</span>
      ),
      className: "text-center",
    },
    {
      key: "outstandingBalance",
      header: "Outstanding",
      render: (client: Client) => (
        <span
          className={`font-medium ${
            client.outstandingBalance > 0 ? "text-amber-600" : "text-slate-500"
          }`}
        >
          {formatCurrency(client.outstandingBalance)}
        </span>
      ),
      className: "text-right",
    },
    {
      key: "joinedAt",
      header: "Joined",
      render: (client: Client) => (
        <span className="text-sm text-slate-500">{formatDate(client.joinedAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (client: Client) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => toast.info(`Viewing ${client.name}`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.info(`Editing ${client.name}`)}
            >
              Edit Client
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.info(`Viewing loans for ${client.name}`)}
            >
              View Loans
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-12",
    },
  ];

  return (
    <DataTable
      data={filteredClients}
      columns={columns}
      searchPlaceholder="Search clients..."
      searchValue={search}
      onSearchChange={setSearch}
      filterOptions={[
        { label: "All Statuses", value: "all" },
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
      ]}
      filterValue={statusFilter}
      onFilterChange={setStatusFilter}
      onAddClick={() => toast.info("Add client modal would open")}
      addButtonLabel="Add Client"
    />
  );
}
