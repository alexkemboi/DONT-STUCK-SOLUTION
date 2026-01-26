"use client";

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
import type { LoanStatus } from "@/lib/types";
import {
  ArrowLeft,
  Banknote,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Home,
  User,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";

interface ApplicationDetailsProps {
  application: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    national_id: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    employment_status: string;
    employer_name: string;
    job_title: string;
    monthly_income: number;
    loan_type: string;
    requested_amount: number;
    approved_amount: number | null;
    interest_rate: number | null;
    tenure_months: number;
    purpose: string;
    status: LoanStatus;
    created_at: string;
    submitted_at: string | null;
    reviewed_at: string | null;
    disbursed_at: string | null;
    rejection_reason: string | null;
    guarantors: Array<{
      id: string;
      full_name: string;
      relationship: string;
      phone: string;
      occupation: string;
    }>;
    collaterals: Array<{
      id: string;
      collateral_type: string;
      description: string;
      estimated_value: number;
    }>;
    repayments: Array<{
      id: string;
      due_date: string;
      amount_due: number;
      amount_paid: number;
      status: string;
    }>;
  };
}

const statusConfig: Record<
  LoanStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock }
> = {
  draft: { label: "Draft", variant: "secondary", icon: FileText },
  submitted: { label: "Submitted", variant: "default", icon: Clock },
  under_review: { label: "Under Review", variant: "default", icon: Clock },
  approved: { label: "Approved", variant: "default", icon: CheckCircle2 },
  disbursed: { label: "Disbursed", variant: "default", icon: Banknote },
  repaying: { label: "Repaying", variant: "default", icon: Calendar },
  completed: { label: "Completed", variant: "default", icon: CheckCircle2 },
  rejected: { label: "Rejected", variant: "destructive", icon: XCircle },
  defaulted: { label: "Defaulted", variant: "destructive", icon: XCircle },
};

export function ApplicationDetails({ application }: ApplicationDetailsProps) {
  const status = statusConfig[application.status] || statusConfig.submitted;
  const StatusIcon = status.icon;

  const totalCollateralValue = application.collaterals.reduce(
    (sum, c) => sum + c.estimated_value,
    0
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Application #{application.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Submitted on{" "}
              {new Date(application.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <Badge variant={status.variant} className="w-fit gap-2 px-4 py-2 text-sm">
            <StatusIcon className="h-4 w-4" />
            {status.label}
          </Badge>
        </div>
      </div>

      {application.status === "rejected" && application.rejection_reason && (
        <Card className="mb-6 border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-start gap-4 pt-6">
            <XCircle className="h-6 w-6 text-destructive" />
            <div>
              <h3 className="font-semibold text-destructive">Application Rejected</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {application.rejection_reason}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Banknote className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Loan Details</CardTitle>
                  <CardDescription>Requested loan information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Loan Type</p>
                  <p className="font-medium capitalize">{application.loan_type} Loan</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Requested Amount</p>
                  <p className="text-2xl font-bold text-primary">
                    ${application.requested_amount.toLocaleString()}
                  </p>
                </div>
                {application.approved_amount && (
                  <div>
                    <p className="text-sm text-muted-foreground">Approved Amount</p>
                    <p className="text-xl font-semibold text-success">
                      ${application.approved_amount.toLocaleString()}
                    </p>
                  </div>
                )}
                {application.interest_rate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Interest Rate</p>
                    <p className="font-medium">{application.interest_rate}% APR</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Tenure</p>
                  <p className="font-medium">{application.tenure_months} months</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Purpose</p>
                  <p className="font-medium">{application.purpose}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Applicant details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{application.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{application.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{application.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">
                    {new Date(application.date_of_birth).toLocaleDateString()}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">
                    {application.address}, {application.city}, {application.state}{" "}
                    {application.postal_code}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Employment Information</CardTitle>
                  <CardDescription>Income and work details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Employment Status</p>
                  <p className="font-medium capitalize">
                    {application.employment_status?.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Income</p>
                  <p className="font-medium">
                    ${application.monthly_income?.toLocaleString() || "N/A"}
                  </p>
                </div>
                {application.employer_name && (
                  <div>
                    <p className="text-sm text-muted-foreground">Employer</p>
                    <p className="font-medium">{application.employer_name}</p>
                  </div>
                )}
                {application.job_title && (
                  <div>
                    <p className="text-sm text-muted-foreground">Job Title</p>
                    <p className="font-medium">{application.job_title}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {application.repayments.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Repayment Schedule</CardTitle>
                    <CardDescription>Monthly payment plan</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {application.repayments.slice(0, 12).map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {new Date(payment.due_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>${payment.amount_due.toLocaleString()}</TableCell>
                        <TableCell>${payment.amount_paid.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              payment.status === "paid"
                                ? "default"
                                : payment.status === "overdue"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {application.repayments.length > 12 && (
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    Showing first 12 of {application.repayments.length} payments
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Guarantors</CardTitle>
                  <CardDescription>{application.guarantors.length} guarantor(s)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {application.guarantors.length === 0 ? (
                <p className="text-sm text-muted-foreground">No guarantors added</p>
              ) : (
                application.guarantors.map((g) => (
                  <div key={g.id} className="rounded-lg border p-3">
                    <p className="font-medium">{g.full_name}</p>
                    <p className="text-sm text-muted-foreground">{g.relationship}</p>
                    <p className="text-sm">{g.phone}</p>
                    <p className="text-sm text-muted-foreground">{g.occupation}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Collateral</CardTitle>
                  <CardDescription>
                    Total: ${totalCollateralValue.toLocaleString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {application.collaterals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No collateral added</p>
              ) : (
                application.collaterals.map((c) => (
                  <div key={c.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium capitalize">{c.collateral_type}</p>
                      <p className="font-semibold text-primary">
                        ${c.estimated_value.toLocaleString()}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Need Help?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Contact our support team for any questions about your application.
              </p>
              <Button variant="outline" className="w-full bg-transparent">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
