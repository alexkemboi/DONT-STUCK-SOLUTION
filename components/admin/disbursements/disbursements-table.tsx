"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/admin/shared/updated-data-table";
import {
  createDisbursementsColumns,
  type Disbursement,
} from "@/components/admin/disbursements/disbursements-columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DisbursementsTableProps {
  disbursements: Disbursement[];
}

export function DisbursementsTable({ disbursements }: DisbursementsTableProps) {
  const [methodFilter, setMethodFilter] = useState("all");

  const filteredDisbursements = useMemo(
    () =>
      methodFilter === "all"
        ? disbursements
        : disbursements.filter((d) => d.method === methodFilter),
    [disbursements, methodFilter]
  );

  const columns = useMemo(() => createDisbursementsColumns(), []);

  return (
    <DataTable
      data={filteredDisbursements}
      columns={columns}
      searchPlaceholder="Search disbursements..."
      toolbar={
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="M-Pesa">M-Pesa</SelectItem>
            <SelectItem value="Bank">Bank</SelectItem>
          </SelectContent>
        </Select>
      }
    />
  );
}
