"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { EmploymentFormData, EmploymentStatus } from "@/lib/types";
import { ArrowLeft, ArrowRight, Briefcase } from "lucide-react";

interface EmploymentFormProps {
  data: EmploymentFormData;
  onSubmit: (data: EmploymentFormData) => void;
  onBack: () => void;
}

export function EmploymentForm({ data, onSubmit, onBack }: EmploymentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmploymentFormData>({
    defaultValues: data,
  });

  const employmentStatus = watch("employment_status");
  const isEmployed =
    employmentStatus === "employed" || employmentStatus === "self_employed";

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Employment Information</CardTitle>
            <CardDescription>
              Tell us about your current employment and income
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="employment_status">Employment Status *</Label>
              <Select
                value={employmentStatus}
                onValueChange={(value) =>
                  setValue("employment_status", value as EmploymentStatus)
                }
              >
                <SelectTrigger id="employment_status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">Employed</SelectItem>
                  <SelectItem value="self_employed">Self Employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
              {errors.employment_status && (
                <p className="text-sm text-destructive">
                  Employment status is required
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly_income">Monthly Income (USD) *</Label>
              <Input
                id="monthly_income"
                type="number"
                min="0"
                step="100"
                placeholder="5000"
                {...register("monthly_income", {
                  required: "Monthly income is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Income must be positive" },
                })}
                className={errors.monthly_income ? "border-destructive" : ""}
              />
              {errors.monthly_income && (
                <p className="text-sm text-destructive">
                  {errors.monthly_income.message}
                </p>
              )}
            </div>

            {isEmployed && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="employer_name">
                    {employmentStatus === "self_employed"
                      ? "Business Name"
                      : "Employer Name"}{" "}
                    *
                  </Label>
                  <Input
                    id="employer_name"
                    placeholder={
                      employmentStatus === "self_employed"
                        ? "Your Business LLC"
                        : "Acme Corporation"
                    }
                    {...register("employer_name", {
                      required: isEmployed
                        ? "Employer/Business name is required"
                        : false,
                    })}
                    className={errors.employer_name ? "border-destructive" : ""}
                  />
                  {errors.employer_name && (
                    <p className="text-sm text-destructive">
                      {errors.employer_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job_title">Job Title *</Label>
                  <Input
                    id="job_title"
                    placeholder="Software Engineer"
                    {...register("job_title", {
                      required: isEmployed ? "Job title is required" : false,
                    })}
                    className={errors.job_title ? "border-destructive" : ""}
                  />
                  {errors.job_title && (
                    <p className="text-sm text-destructive">
                      {errors.job_title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employment_start_date">Start Date</Label>
                  <Input
                    id="employment_start_date"
                    type="date"
                    {...register("employment_start_date")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="work_phone">Work Phone</Label>
                  <Input
                    id="work_phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    {...register("work_phone")}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="work_address">Work Address</Label>
                  <Input
                    id="work_address"
                    placeholder="456 Business Ave, Suite 200"
                    {...register("work_address")}
                  />
                </div>
              </>
            )}
          </div>

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
