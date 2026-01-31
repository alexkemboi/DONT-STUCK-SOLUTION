"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { deleteClient } from "@/app/actions/admin";
import { Client, User } from "@/lib/generated/prisma";

interface ClientWithUser extends Client {
  user?: User;
}

interface ClientsTableProps {
  clients: ClientWithUser[];
}

export function ClientsTable({ clients }: ClientsTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleDelete = async (id: string) => {
    const promise = deleteClient(id).then((res) => {
      if (res.error) {
        throw new Error(res.error);
      }
      router.refresh();
      return res;
    });

    toast.promise(promise, {
      loading: "Deactivating client...",
      success: "Client deactivated successfully",
      error: "Failed to deactivate client",
    });
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.surname.toLowerCase().includes(search.toLowerCase()) ||
      client.otherNames.toLowerCase().includes(search.toLowerCase()) ||
      client?.user?.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: "name",
      header: "Client",
      render: (client: ClientWithUser) => (
        <div>
          <p className="font-medium text-slate-900">{`${client.surname} ${client.otherNames}`}</p>
          <p className="text-sm text-slate-500">{client?.user?.email}</p>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (client: ClientWithUser) => (
        <span className="text-sm text-slate-600">{client?.user?.phone}</span>
      ),
    },
    {
      key: "idNumber",
      header: "ID Number",
      render: (client: ClientWithUser) => (
        <span className="font-mono text-sm text-slate-600">{client.idPassportNo}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (client: ClientWithUser) => (
        <Badge
          className={
            client.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }
        >
          {client.status}
        </Badge>
      ),
    },
    {
      key: "totalLoans",
      header: "Loans",
      render: (client: ClientWithUser) => (
        <span className="font-medium text-slate-900">{0}</span>
      ),
      className: "text-center",
    },
    {
      key: "outstandingBalance",
      header: "Outstanding",
      render: (client: ClientWithUser) => (
        <span
          className={`font-medium ${
            0 > 0 ? "text-amber-600" : "text-slate-500"
          }`}
        >
          {formatCurrency(0)}
        </span>
      ),
      className: "text-right",
    },
    {
      key: "joinedAt",
      header: "Joined",
      render: (client: ClientWithUser) => (
        <span className="text-sm text-slate-500">{formatDate(client.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (client: ClientWithUser) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/dss/admin/clients/${client.id}`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(client.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Deactivate
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
      onAddClick={() => router.push("/dss/admin/clients/new")}
      addButtonLabel="Add Client"
    />
  );
}
