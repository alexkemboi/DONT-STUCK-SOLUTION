"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { LoanStatus } from "@/lib/types";
import { updateLoanStatus } from "@/app/actions/loan-actions";
import {
  CheckCircle2,
  Clock,
  Eye,
  MoreHorizontal,
  XCircle,
  Banknote,
  FileSearch,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LoanApplicationRow {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  loan_type: string;
  requested_amount: number;
  approved_amount: number | null;
  tenure_months: number;
  status: LoanStatus;
  monthly_income: number;
  created_at: string;
}

interface ApplicationsTableProps {
  applications: LoanApplicationRow[];
}

const statusConfig: Record<
  LoanStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  draft: { label: "Draft", variant: "secondary" },
  submitted: { label: "Submitted", variant: "outline" },
  under_review: { label: "Under Review", variant: "default" },
  approved: { label: "Approved", variant: "default" },
  disbursed: { label: "Disbursed", variant: "default" },
  repaying: { label: "Repaying", variant: "default" },
  completed: { label: "Completed", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
  defaulted: { label: "Defaulted", variant: "destructive" },
};

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<LoanApplicationRow | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    startTransition(async () => {
      await updateLoanStatus(applicationId, newStatus, "admin-1");
      router.refresh();
    });
  };

  const handleReject = () => {
    if (!selectedApplication) return;
    startTransition(async () => {
      await updateLoanStatus(
        selectedApplication.id,
        "rejected",
        "admin-1",
        rejectionReason
      );
      setRejectDialogOpen(false);
      setSelectedApplication(null);
      setRejectionReason("");
      router.refresh();
    });
  };

  const openRejectDialog = (application: LoanApplicationRow) => {
    setSelectedApplication(application);
    setRejectDialogOpen(true);
  };

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileSearch className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No applications found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            There are no loan applications matching your filter.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>
            {applications.length} application(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Loan Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Tenure</TableHead>
                <TableHead className="text-right">Monthly Income</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => {
                const status = statusConfig[app.status] || statusConfig.submitted;
                return (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{app.full_name}</p>
                        <p className="text-sm text-muted-foreground">{app.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{app.loan_type}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${app.requested_amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{app.tenure_months} mo</TableCell>
                    <TableCell className="text-right">
                      ${app.monthly_income?.toLocaleString() || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(app.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={isPending}>
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/application/${app.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {app.status === "submitted" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(app.id, "under_review")
                              }
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              Start Review
                            </DropdownMenuItem>
                          )}
                          {(app.status === "submitted" ||
                            app.status === "under_review") && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(app.id, "approved")}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4 text-success" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openRejectDialog(app)}
                                className="text-destructive"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          {app.status === "approved" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(app.id, "disbursed")}
                            >
                              <Banknote className="mr-2 h-4 w-4" />
                              Disburse Funds
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this loan application for{" "}
              <strong>{selectedApplication?.full_name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isPending || !rejectionReason.trim()}
            >
              {isPending ? "Rejecting..." : "Reject Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
