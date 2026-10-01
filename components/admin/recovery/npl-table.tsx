"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/admin/shared/updated-data-table";
import { createNplColumns, type NPLLoan } from "@/components/admin/recovery/npl-columns";

interface NPLTableProps {
  nplLoans: NPLLoan[];
}

export function NPLTable({ nplLoans }: NPLTableProps) {
  const columns = useMemo(() => createNplColumns(), []);

  return (
    <DataTable
      data={nplLoans}
      columns={columns}
      searchPlaceholder="Search NPL loans..."
    />
  );
}
