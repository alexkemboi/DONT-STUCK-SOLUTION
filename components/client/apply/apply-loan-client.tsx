'use client'

import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { resetLoanApplication } from '@/lib/store/slices/loan-application-slice'
import { StepIndicator } from './step-indicator'
import { LoanDetailsForm } from './loan-details-form'
import { GuarantorsForm } from './guarantors-form'
import { ReviewSubmit } from './review-submit'
import { LoanCalculator } from './loan-calculator'
import { AlertTriangle } from 'lucide-react'
import type { LoanApplication } from '@/lib/generated/prisma'

const steps = [
    { label: 'Loan Details', description: 'Amount and purpose' },
    { label: 'Guarantors', description: 'Add guarantors' },
    { label: 'Review', description: 'Confirm and submit' },
]

interface ApplyLoanClientProps {
    clientData: { id: string; surname: string; otherNames: string } | null
    existingLoans: LoanApplication[]
}

export function ApplyLoanClient({ clientData, existingLoans }: ApplyLoanClientProps) {
    const dispatch = useAppDispatch()
    const { currentStep, submitSuccess } = useAppSelector(
        (state) => state.loanApplication
    )

    useEffect(() => {
        dispatch(resetLoanApplication())
    }, [dispatch])

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <LoanDetailsForm key="loan-details" />
            case 1:
                return <GuarantorsForm key="guarantors" />
            case 2:
                return <ReviewSubmit key="review" />
            default:
                return <LoanDetailsForm key="loan-details" />
        }
    }

    const pendingLoans = existingLoans.filter((l) => l.status === 'Pending')

    return (
        <div>
            <div className="border-b border-border bg-background">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                            Apply for a Loan
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Complete the form below to submit your loan application
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!submitSuccess && (
                    <StepIndicator currentStep={currentStep} steps={steps} />
                )}

                {pendingLoans.length > 0 && currentStep === 0 && !submitSuccess && (
                    <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-sm text-amber-800">
                            You have {pendingLoans.length} pending loan application
                            {pendingLoans.length !== 1 ? 's' : ''} under review.
                            You can still submit a new application.
                        </p>
                    </div>
                )}

                <div className={`mt-8 grid grid-cols-1 ${!submitSuccess ? 'lg:grid-cols-3' : ''} gap-8`}>
                    <div className={!submitSuccess ? 'lg:col-span-2' : ''}>
                        <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
                            <AnimatePresence mode="wait">
                                {renderStep()}
                            </AnimatePresence>
                        </div>
                    </div>

                    {!submitSuccess && (
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <LoanCalculator />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
