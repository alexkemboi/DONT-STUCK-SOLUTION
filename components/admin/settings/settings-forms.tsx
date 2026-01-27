"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, RotateCcw } from "lucide-react";

interface Settings {
  interestRate: number;
  processingFeePercent: number;
  legalFee: number;
  maxLoanAmount: number;
  minLoanAmount: number;
  maxTenureMonths: number;
  minTenureMonths: number;
  salaryMultiplier: number;
  statementMultiplier: number;
  nplThresholdDays: number;
  smsReminderDaysBefore: number;
}

interface SettingsFormsProps {
  settings: Settings;
}

// Validation schemas
const financialSchema = Yup.object({
  interestRate: Yup.number()
    .min(0, "Must be positive")
    .max(100, "Cannot exceed 100%")
    .required("Required"),
  processingFeePercent: Yup.number()
    .min(0, "Must be positive")
    .max(20, "Cannot exceed 20%")
    .required("Required"),
  legalFee: Yup.number().min(0, "Must be positive").required("Required"),
});

const loanLimitsSchema = Yup.object({
  maxLoanAmount: Yup.number()
    .min(1000, "Minimum is 1,000")
    .required("Required"),
  minLoanAmount: Yup.number()
    .min(1000, "Minimum is 1,000")
    .required("Required"),
  maxTenureMonths: Yup.number()
    .min(1, "Minimum is 1 month")
    .max(120, "Maximum is 120 months")
    .required("Required"),
  minTenureMonths: Yup.number()
    .min(1, "Minimum is 1 month")
    .required("Required"),
});

const qualificationSchema = Yup.object({
  salaryMultiplier: Yup.number()
    .min(1, "Must be at least 1x")
    .max(10, "Cannot exceed 10x")
    .required("Required"),
  statementMultiplier: Yup.number()
    .min(1, "Must be at least 1x")
    .max(10, "Cannot exceed 10x")
    .required("Required"),
});

const notificationSchema = Yup.object({
  nplThresholdDays: Yup.number()
    .min(30, "Minimum is 30 days")
    .max(180, "Maximum is 180 days")
    .required("Required"),
  smsReminderDaysBefore: Yup.number()
    .min(1, "Minimum is 1 day")
    .max(14, "Maximum is 14 days")
    .required("Required"),
});

function FormField({
  name,
  label,
  type = "text",
  suffix,
  prefix,
}: {
  name: string;
  label: string;
  type?: string;
  suffix?: string;
  prefix?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
            {prefix}
          </span>
        )}
        <Field
          as={Input}
          id={name}
          name={name}
          type={type}
          className={`${prefix ? "pl-12" : ""} ${suffix ? "pr-12" : ""}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
            {suffix}
          </span>
        )}
      </div>
      <ErrorMessage
        name={name}
        component="p"
        className="text-sm text-red-500"
      />
    </div>
  );
}

export function SettingsForms({ settings }: SettingsFormsProps) {
  const handleSubmit = (values: Record<string, unknown>, formName: string) => {
    console.log(`${formName} values:`, values);
    toast.success(`${formName} settings saved!`, {
      description: "Changes have been applied successfully.",
    });
  };

  return (
    <Tabs defaultValue="financial" className="space-y-4">
      <TabsList className="bg-slate-100">
        <TabsTrigger value="financial">Financial Rules</TabsTrigger>
        <TabsTrigger value="limits">Loan Limits</TabsTrigger>
        <TabsTrigger value="qualification">Qualification</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      {/* Financial Rules */}
      <TabsContent value="financial">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Financial Rules</CardTitle>
            <CardDescription>
              Configure interest rates, fees, and other financial parameters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{
                interestRate: settings.interestRate,
                processingFeePercent: settings.processingFeePercent,
                legalFee: settings.legalFee,
              }}
              validationSchema={financialSchema}
              onSubmit={(values) => handleSubmit(values, "Financial Rules")}
            >
              {({ isSubmitting, resetForm, dirty }) => (
                <Form className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-3">
                    <FormField
                      name="interestRate"
                      label="Annual Interest Rate"
                      type="number"
                      suffix="%"
                    />
                    <FormField
                      name="processingFeePercent"
                      label="Processing Fee"
                      type="number"
                      suffix="%"
                    />
                    <FormField
                      name="legalFee"
                      label="Legal Fee"
                      type="number"
                      prefix="KES"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => resetForm()}
                      disabled={!dirty}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !dirty}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Loan Limits */}
      <TabsContent value="limits">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Loan Limits</CardTitle>
            <CardDescription>
              Set minimum and maximum loan amounts and tenure periods.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{
                maxLoanAmount: settings.maxLoanAmount,
                minLoanAmount: settings.minLoanAmount,
                maxTenureMonths: settings.maxTenureMonths,
                minTenureMonths: settings.minTenureMonths,
              }}
              validationSchema={loanLimitsSchema}
              onSubmit={(values) => handleSubmit(values, "Loan Limits")}
            >
              {({ isSubmitting, resetForm, dirty }) => (
                <Form className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      name="minLoanAmount"
                      label="Minimum Loan Amount"
                      type="number"
                      prefix="KES"
                    />
                    <FormField
                      name="maxLoanAmount"
                      label="Maximum Loan Amount"
                      type="number"
                      prefix="KES"
                    />
                    <FormField
                      name="minTenureMonths"
                      label="Minimum Tenure"
                      type="number"
                      suffix="months"
                    />
                    <FormField
                      name="maxTenureMonths"
                      label="Maximum Tenure"
                      type="number"
                      suffix="months"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => resetForm()}
                      disabled={!dirty}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !dirty}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Qualification Rules */}
      <TabsContent value="qualification">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Qualification Rules</CardTitle>
            <CardDescription>
              Configure salary and statement-based qualification multipliers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{
                salaryMultiplier: settings.salaryMultiplier,
                statementMultiplier: settings.statementMultiplier,
              }}
              validationSchema={qualificationSchema}
              onSubmit={(values) => handleSubmit(values, "Qualification Rules")}
            >
              {({ isSubmitting, resetForm, dirty }) => (
                <Form className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-4">
                      <FormField
                        name="salaryMultiplier"
                        label="Salary Multiplier"
                        type="number"
                        suffix="x"
                      />
                      <p className="text-sm text-slate-500">
                        Maximum loan = Net Salary × Multiplier
                      </p>
                    </div>
                    <div className="space-y-4">
                      <FormField
                        name="statementMultiplier"
                        label="Statement Multiplier"
                        type="number"
                        suffix="x"
                      />
                      <p className="text-sm text-slate-500">
                        Maximum loan = 6-month Avg Income × Multiplier
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => resetForm()}
                      disabled={!dirty}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !dirty}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notification Settings */}
      <TabsContent value="notifications">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure NPL thresholds and SMS reminder schedules.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{
                nplThresholdDays: settings.nplThresholdDays,
                smsReminderDaysBefore: settings.smsReminderDaysBefore,
              }}
              validationSchema={notificationSchema}
              onSubmit={(values) => handleSubmit(values, "Notification Settings")}
            >
              {({ isSubmitting, resetForm, dirty }) => (
                <Form className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-4">
                      <FormField
                        name="nplThresholdDays"
                        label="NPL Threshold"
                        type="number"
                        suffix="days"
                      />
                      <p className="text-sm text-slate-500">
                        Days overdue before loan is flagged as NPL
                      </p>
                    </div>
                    <div className="space-y-4">
                      <FormField
                        name="smsReminderDaysBefore"
                        label="SMS Reminder"
                        type="number"
                        suffix="days before"
                      />
                      <p className="text-sm text-slate-500">
                        Send payment reminder this many days before due date
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => resetForm()}
                      disabled={!dirty}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !dirty}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
