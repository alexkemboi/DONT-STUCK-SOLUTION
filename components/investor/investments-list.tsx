"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { FileSearch } from "lucide-react";

interface Allocation {
  id: string;
  loan_application_id: string;
  allocated_amount: number;
  expected_return: number;
  actual_return: number;
  status: string;
  created_at: string;
  loan_type: string;
  approved_amount: number;
  interest_rate: number;
  tenure_months: number;
  loan_status: string;
  borrower_name: string;
}

interface InvestmentsListProps {
  allocations: Allocation[];
}

export function InvestmentsList({ allocations }: InvestmentsListProps) {
  if (allocations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileSearch className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No investments yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse available loans to start investing.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Investments</CardTitle>
        <CardDescription>
          Track your active and completed investments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Borrower</TableHead>
              <TableHead>Loan Type</TableHead>
              <TableHead className="text-right">Invested</TableHead>
              <TableHead className="text-right">Expected Return</TableHead>
              <TableHead className="text-right">Actual Return</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allocations.map((allocation) => {
              const progress =
                allocation.expected_return > 0
                  ? (allocation.actual_return / allocation.expected_return) * 100
                  : 0;

              return (
                <TableRow key={allocation.id}>
                  <TableCell className="font-medium">
                    {allocation.borrower_name}
                  </TableCell>
                  <TableCell className="capitalize">
                    {allocation.loan_type}
                  </TableCell>
                  <TableCell className="text-right">
                    ${allocation.allocated_amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    ${allocation.expected_return.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-success font-medium">
                    ${allocation.actual_return.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="w-20" />
                      <span className="text-xs text-muted-foreground">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        allocation.status === "completed"
                          ? "default"
                          : allocation.status === "defaulted"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {allocation.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
