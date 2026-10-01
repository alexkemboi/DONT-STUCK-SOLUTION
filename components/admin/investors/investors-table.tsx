"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/admin/shared/updated-data-table";
import {
  createInvestorsColumns,
  type Investor,
} from "@/components/admin/investors/investors-columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface InvestorsTableProps {
  investors: Investor[];
}

export function InvestorsTable({ investors }: InvestorsTableProps) {
  const columns = useMemo(() => createInvestorsColumns(), []);

  return (
    <DataTable
      data={investors}
      columns={columns}
      searchPlaceholder="Search investors..."
      toolbar={
        <Button size="sm" onClick={() => toast.info("Add investor modal would open")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Investor
        </Button>
      }
    />
  );
}
