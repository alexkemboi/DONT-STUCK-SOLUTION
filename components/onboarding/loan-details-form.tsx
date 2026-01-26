"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LoanDetailsFormData, LoanType } from "@/lib/types";
import { ArrowLeft, ArrowRight, Banknote, Calculator } from "lucide-react";
import { useMemo } from "react";

interface LoanDetailsFormProps {
  data: LoanDetailsFormData;
  onSubmit: (data: LoanDetailsFormData) => void;
  onBack: () => void;
}

const INTEREST_RATES: Record<LoanType, number> = {
  personal: 12.5,
  business: 15.0,
  mortgage: 7.5,
  auto: 9.0,
  education: 6.5,
};

export function LoanDetailsForm({
  data,
  onSubmit,
  onBack,
}: LoanDetailsFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoanDetailsFormData>({
    defaultValues: data,
  });

  const loanType = watch("loan_type");
  const requestedAmount = watch("requested_amount") || 0;
  const tenureMonths = watch("tenure_months") || 12;

  const monthlyPayment = useMemo(() => {
    if (!loanType || !requestedAmount || !tenureMonths) return 0;
    const rate = INTEREST_RATES[loanType] / 100 / 12;
    const payment =
      (requestedAmount * rate * Math.pow(1 + rate, tenureMonths)) /
      (Math.pow(1 + rate, tenureMonths) - 1);
    return isNaN(payment) ? 0 : payment;
  }, [loanType, requestedAmount, tenureMonths]);

  const totalInterest = useMemo(() => {
    return monthlyPayment * tenureMonths - requestedAmount;
  }, [monthlyPayment, tenureMonths, requestedAmount]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Banknote className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Loan Details</CardTitle>
            <CardDescription>
              Specify the loan amount and terms you need
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="loan_type">Loan Type *</Label>
              <Select
                value={loanType}
                onValueChange={(value) => setValue("loan_type", value as LoanType)}
              >
                <SelectTrigger id="loan_type">
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">
                    Personal Loan (12.5% APR)
                  </SelectItem>
                  <SelectItem value="business">
                    Business Loan (15.0% APR)
                  </SelectItem>
                  <SelectItem value="mortgage">
                    Mortgage (7.5% APR)
                  </SelectItem>
                  <SelectItem value="auto">Auto Loan (9.0% APR)</SelectItem>
                  <SelectItem value="education">
                    Education Loan (6.5% APR)
                  </SelectItem>
                </SelectContent>
              </Select>
              {!loanType && errors.loan_type && (
                <p className="text-sm text-destructive">Loan type is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="requested_amount">Requested Amount (USD) *</Label>
              <Input
                id="requested_amount"
                type="number"
                min="1000"
                max="1000000"
                step="100"
                placeholder="25000"
                {...register("requested_amount", {
                  required: "Loan amount is required",
                  valueAsNumber: true,
                  min: { value: 1000, message: "Minimum amount is $1,000" },
                  max: { value: 1000000, message: "Maximum amount is $1,000,000" },
                })}
                className={errors.requested_amount ? "border-destructive" : ""}
              />
              {errors.requested_amount && (
                <p className="text-sm text-destructive">
                  {errors.requested_amount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenure_months">Loan Tenure *</Label>
              <Select
                value={tenureMonths?.toString()}
                onValueChange={(value) =>
                  setValue("tenure_months", parseInt(value))
                }
              >
                <SelectTrigger id="tenure_months">
                  <SelectValue placeholder="Select tenure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                  <SelectItem value="24">24 Months</SelectItem>
                  <SelectItem value="36">36 Months</SelectItem>
                  <SelectItem value="48">48 Months</SelectItem>
                  <SelectItem value="60">60 Months</SelectItem>
                  <SelectItem value="120">120 Months (10 Years)</SelectItem>
                  <SelectItem value="240">240 Months (20 Years)</SelectItem>
                  <SelectItem value="360">360 Months (30 Years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estimated Monthly Payment</Label>
              <div className="flex h-10 items-center rounded-md border bg-muted px-3 text-lg font-semibold text-primary">
                ${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="purpose">Purpose of Loan *</Label>
              <Textarea
                id="purpose"
                placeholder="Please describe the purpose of this loan in detail..."
                rows={4}
                {...register("purpose", {
                  required: "Purpose is required",
                  minLength: {
                    value: 20,
                    message: "Please provide more detail (at least 20 characters)",
                  },
                })}
                className={errors.purpose ? "border-destructive" : ""}
              />
              {errors.purpose && (
                <p className="text-sm text-destructive">
                  {errors.purpose.message}
                </p>
              )}
            </div>
          </div>

          {loanType && requestedAmount > 0 && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calculator className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <h4 className="font-semibold text-primary">Loan Summary</h4>
                    <div className="grid gap-2 text-sm md:grid-cols-3">
                      <div>
                        <p className="text-muted-foreground">Principal Amount</p>
                        <p className="text-lg font-semibold">
                          ${requestedAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Interest</p>
                        <p className="text-lg font-semibold">
                          ${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Repayment</p>
                        <p className="text-lg font-semibold text-primary">
                          $
                          {(requestedAmount + totalInterest).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onBack}
              className="gap-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button type="submit" size="lg" className="gap-2">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
