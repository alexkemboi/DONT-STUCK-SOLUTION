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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { investInLoan } from "@/app/actions/investor-actions";
import {
  Banknote,
  Briefcase,
  Calendar,
  FileSearch,
  MapPin,
  Percent,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface AvailableLoan {
  id: string;
  loan_type: string;
  approved_amount: number;
  interest_rate: number;
  tenure_months: number;
  purpose: string;
  borrower_name: string;
  city: string;
  state: string;
  employment_status: string;
  monthly_income: number;
  already_funded: number;
}

interface AvailableLoansProps {
  loans: AvailableLoan[];
  investorId: string;
}

export function AvailableLoans({ loans, investorId }: AvailableLoansProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [investDialogOpen, setInvestDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<AvailableLoan | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleInvest = () => {
    if (!selectedLoan || !investmentAmount) return;

    startTransition(async () => {
      const response = await investInLoan(
        investorId,
        selectedLoan.id,
        parseFloat(investmentAmount)
      );
      setResult(response);
      if (response.success) {
        setTimeout(() => {
          setInvestDialogOpen(false);
          setSelectedLoan(null);
          setInvestmentAmount("");
          setResult(null);
          router.refresh();
        }, 2000);
      }
    });
  };

  const openInvestDialog = (loan: AvailableLoan) => {
    setSelectedLoan(loan);
    setInvestDialogOpen(true);
    setResult(null);
  };

  if (loans.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileSearch className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No loans available</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Check back later for new investment opportunities.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loans.map((loan) => {
          const fundedPercentage =
            (Number(loan.already_funded) / loan.approved_amount) * 100;
          const remainingAmount =
            loan.approved_amount - Number(loan.already_funded);

          return (
            <Card key={loan.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="capitalize">
                    {loan.loan_type}
                  </Badge>
                  <div className="flex items-center gap-1 text-success">
                    <Percent className="h-4 w-4" />
                    <span className="font-semibold">{loan.interest_rate}%</span>
                  </div>
                </div>
                <CardTitle className="mt-2">
                  ${loan.approved_amount.toLocaleString()}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {loan.purpose}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span className="capitalize">
                      {loan.employment_status?.replace("_", " ")}
                    </span>
                    {loan.monthly_income && (
                      <span>
                        - ${loan.monthly_income.toLocaleString()}/mo
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {loan.city}, {loan.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{loan.tenure_months} months</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Funded</span>
                    <span className="font-medium">
                      {fundedPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={fundedPercentage} />
                  <p className="text-xs text-muted-foreground">
                    ${remainingAmount.toLocaleString()} remaining
                  </p>
                </div>

                <div className="rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Expected Return</span>
                  </div>
                  <p className="mt-1 text-lg font-bold text-success">
                    $
                    {(
                      (loan.approved_amount *
                        (loan.interest_rate / 100) *
                        loan.tenure_months) /
                      12
                    ).toLocaleString()}
                  </p>
                </div>

                <Button
                  className="w-full gap-2"
                  onClick={() => openInvestDialog(loan)}
                >
                  <Banknote className="h-4 w-4" />
                  Invest Now
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={investDialogOpen} onOpenChange={setInvestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invest in Loan</DialogTitle>
            <DialogDescription>
              Invest in a {selectedLoan?.loan_type} loan of $
              {selectedLoan?.approved_amount.toLocaleString()} at{" "}
              {selectedLoan?.interest_rate}% interest rate.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {result ? (
              <div
                className={`rounded-lg p-4 ${
                  result.success
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {result.message}
              </div>
            ) : (
              <>
                <div className="rounded-lg border p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Loan Amount</p>
                      <p className="font-semibold">
                        ${selectedLoan?.approved_amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Interest Rate</p>
                      <p className="font-semibold">
                        {selectedLoan?.interest_rate}% APR
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tenure</p>
                      <p className="font-semibold">
                        {selectedLoan?.tenure_months} months
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Remaining</p>
                      <p className="font-semibold">
                        $
                        {(
                          (selectedLoan?.approved_amount || 0) -
                          Number(selectedLoan?.already_funded || 0)
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Investment Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="100"
                    max={
                      (selectedLoan?.approved_amount || 0) -
                      Number(selectedLoan?.already_funded || 0)
                    }
                    step="100"
                    placeholder="Enter amount to invest"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum investment: $100
                  </p>
                </div>
                {investmentAmount && (
                  <div className="rounded-lg bg-success/10 p-3">
                    <p className="text-sm text-success">
                      Expected Return:{" "}
                      <strong>
                        $
                        {(
                          (parseFloat(investmentAmount) *
                            ((selectedLoan?.interest_rate || 0) / 100) *
                            (selectedLoan?.tenure_months || 0)) /
                          12
                        ).toLocaleString()}
                      </strong>
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          {!result && (
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setInvestDialogOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleInvest}
                disabled={isPending || !investmentAmount}
                className="bg-success text-success-foreground hover:bg-success/90"
              >
                {isPending ? "Processing..." : "Confirm Investment"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
