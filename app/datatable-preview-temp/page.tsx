"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/admin/shared/updated-data-table";
import { createColumnHelper } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/components/admin/shared/data-table-features";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

interface Row {
  id: string;
  client: string;
  amount: number;
  method: string;
  date: string;
}

const data: Row[] = [
  { id: "1", client: "Alex Kemboi", amount: 12000, method: "Mpesa", date: "2026-09-20" },
  { id: "2", client: "Mary Wanjiru", amount: 5000, method: "Bank", date: "2026-09-21" },
  { id: "3", client: "John Otieno", amount: 27000, method: "Cash", date: "2026-09-22" },
  { id: "4", client: "Grace Achieng", amount: 9000, method: "Mpesa", date: "2026-09-23" },
];

const columnHelper = createColumnHelper<DataTableFeatures, Row>();
const columns = columnHelper.columns([
  columnHelper.accessor("client", { header: "Client" }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: ({ getValue }) => `KES ${getValue().toLocaleString()}`,
  }),
  columnHelper.accessor("method", {
    header: "Method",
    cell: ({ getValue }) => <Badge>{getValue()}</Badge>,
  }),
  columnHelper.accessor("date", { header: "Date" }),
]);

export default function Preview() {
  const [filter, setFilter] = useState("all");
  const cols = useMemo(() => columns, []);
  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <DataTable
        data={data}
        columns={cols}
        searchPlaceholder="Search by client..."
        toolbar={
          <>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="Mpesa">M-Pesa</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          </>
        }
      />
    </div>
  );
}
