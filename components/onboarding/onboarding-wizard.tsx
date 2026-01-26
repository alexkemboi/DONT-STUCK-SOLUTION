"use client";

import { useState, useTransition } from "react";
import { StepIndicator } from "./step-indicator";
import { PersonalInfoForm } from "./personal-info-form";
import { EmploymentForm } from "./employment-form";
import { LoanDetailsForm } from "./loan-details-form";
import { GuarantorsForm } from "./guarantors-form";
import { CollateralsForm } from "./collaterals-form";
import type {
  OnboardingFormData,
  PersonalInfoFormData,
  EmploymentFormData,
  LoanDetailsFormData,
  GuarantorFormData,
  CollateralFormData,
} from "@/lib/types";
import { submitLoanApplication } from "@/app/actions/loan-actions";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle2, XCircle } from "lucide-react";

const STEPS = [
  { id: 1, title: "Personal Info", description: "Basic details" },
  { id: 2, title: "Employment", description: "Income & work" },
  { id: 3, title: "Loan Details", description: "Amount & terms" },
  { id: 4, title: "Guarantors", description: "References" },
  { id: 5, title: "Collateral", description: "Security" },
];

const initialFormData: OnboardingFormData = {
  personal: {
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    national_id: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    marital_status: "",
    dependents: 0,
  },
  employment: {
    employment_status: "employed",
    employer_name: "",
    job_title: "",
    monthly_income: 0,
    employment_start_date: "",
    work_address: "",
    work_phone: "",
  },
  loan: {
    loan_type: "personal",
    requested_amount: 0,
    tenure_months: 12,
    purpose: "",
  },
  guarantors: [],
  collaterals: [],
};

export function OnboardingWizard() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);
  const [showResult, setShowResult] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    applicationId?: string;
  } | null>(null);

  const handlePersonalSubmit = (data: PersonalInfoFormData) => {
    setFormData((prev) => ({ ...prev, personal: data }));
    setCurrentStep(2);
  };

  const handleEmploymentSubmit = (data: EmploymentFormData) => {
    setFormData((prev) => ({ ...prev, employment: data }));
    setCurrentStep(3);
  };

  const handleLoanSubmit = (data: LoanDetailsFormData) => {
    setFormData((prev) => ({ ...prev, loan: data }));
    setCurrentStep(4);
  };

  const handleGuarantorsSubmit = (data: GuarantorFormData[]) => {
    setFormData((prev) => ({ ...prev, guarantors: data }));
    setCurrentStep(5);
  };

  const handleCollateralsSubmit = (data: CollateralFormData[]) => {
    const finalData = { ...formData, collaterals: data };
    setFormData(finalData);

    startTransition(async () => {
      try {
        const result = await submitLoanApplication(finalData);
        setSubmitResult(result);
        setShowResult(true);
      } catch {
        setSubmitResult({
          success: false,
          message: "An unexpected error occurred. Please try again.",
        });
        setShowResult(true);
      }
    });
  };

  const handleResultClose = () => {
    setShowResult(false);
    if (submitResult?.success) {
      router.push(`/application/${submitResult.applicationId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Loan Application
          </h1>
          <p className="mt-2 text-muted-foreground">
            Complete all steps to submit your loan application
          </p>
        </div>

        <div className="mb-10">
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          {currentStep === 1 && (
            <PersonalInfoForm
              data={formData.personal}
              onSubmit={handlePersonalSubmit}
            />
          )}

          {currentStep === 2 && (
            <EmploymentForm
              data={formData.employment}
              onSubmit={handleEmploymentSubmit}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <LoanDetailsForm
              data={formData.loan}
              onSubmit={handleLoanSubmit}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <GuarantorsForm
              data={formData.guarantors}
              onSubmit={handleGuarantorsSubmit}
              onBack={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 5 && (
            <CollateralsForm
              data={formData.collaterals}
              onSubmit={handleCollateralsSubmit}
              onBack={() => setCurrentStep(4)}
              isSubmitting={isPending}
            />
          )}
        </div>
      </div>

      <AlertDialog open={showResult} onOpenChange={setShowResult}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {submitResult?.success ? (
                <>
                  <CheckCircle2 className="h-6 w-6 text-success" />
                  Application Submitted
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-destructive" />
                  Submission Failed
                </>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {submitResult?.message}
              {submitResult?.success && submitResult.applicationId && (
                <span className="mt-2 block font-medium">
                  Application ID: {submitResult.applicationId}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleResultClose}>
              {submitResult?.success ? "View Application" : "Try Again"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
