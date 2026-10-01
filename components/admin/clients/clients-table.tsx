"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/shared/updated-data-table";
import {
  createClientsColumns,
  type ClientWithUser,
} from "@/components/admin/clients/clients-columns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { deleteClient } from "@/app/actions/admin";

interface ClientsTableProps {
  clients: ClientWithUser[];
}

export function ClientsTable({ clients }: ClientsTableProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");

  const handleEdit = async (id: string) => {
    const promise = deleteClient(id).then((res) => {
      if (res.error) {
        throw new Error(res.error);
      }
      router.refresh();
      return res;
    });

    toast.promise(promise, {
      loading: "Editing client...",
      success: "Client Edit successfully",
      error: "Failed to edit client",
    });
  };

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

  const filteredClients = useMemo(
    () =>
      statusFilter === "all"
        ? clients
        : clients.filter((client) => client.status === statusFilter),
    [clients, statusFilter]
  );

  const columns = useMemo(
    () =>
      createClientsColumns({
        onView: (client) => router.push(`/dss/admin/clients/${client.id}`),
        onDeactivate: (client) => handleDelete(client.id),
        onEdit: (client) => handleEdit(client.id),
      }),
    [router]
  );

  return (
    <DataTable
      data={filteredClients}
      columns={columns}
      searchPlaceholder="Search clients..."
      toolbar={
        <>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => router.push("/dss/admin/clients/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </>
      }
    />
  );
}
