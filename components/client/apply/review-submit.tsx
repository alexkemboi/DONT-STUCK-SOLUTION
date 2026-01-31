'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Send, Loader2, FileText, Users, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import {
    prevStep,
    setIsSubmitting,
    setSubmitSuccess,
    setSubmitError,
} from '@/lib/store/slices/loan-application-slice'
import { submitLoanApplicationAction } from '@/app/actions/loan'
import { toast } from 'sonner'

const ANNUAL_INTEREST_RATE = 20

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)

export function ReviewSubmit() {
    const dispatch = useAppDispatch()
    const { loanDetails, guarantors, isSubmitting, submitSuccess, submittedLoanId } =
        useAppSelector((state) => state.loanApplication)

    const calculations = useMemo(() => {
        const { amountRequested, repaymentPeriod } = loanDetails
        if (!amountRequested || !repaymentPeriod) return null

        const monthlyRate = ANNUAL_INTEREST_RATE / 100 / 12
        const monthlyPayment =
            (amountRequested * monthlyRate * Math.pow(1 + monthlyRate, repaymentPeriod)) /
            (Math.pow(1 + monthlyRate, repaymentPeriod) - 1)

        return {
            monthlyPayment: Math.round(monthlyPayment),
            totalRepayable: Math.round(monthlyPayment * repaymentPeriod),
        }
    }, [loanDetails])

    const handleSubmit = async () => {
        dispatch(setIsSubmitting(true))

        const result = await submitLoanApplicationAction({
            purpose: loanDetails.purpose,
            amountRequested: loanDetails.amountRequested,
            repaymentPeriod: loanDetails.repaymentPeriod,
            guarantors: guarantors.map(({ id, ...rest }) => rest),
        })

        if (result.success && result.data) {
            dispatch(setSubmitSuccess({ loanId: result.data.loanId }))
            toast.success('Loan application submitted successfully!')
        } else {
            dispatch(setSubmitError(result.error || 'Failed to submit application'))
            toast.error(result.error || 'Failed to submit application')
        }
    }

    if (submitSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center py-12 text-center"
            >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-6">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                    Application Submitted
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mb-2">
                    Your loan application has been submitted for review.
                    We will notify you once it has been processed.
                </p>
                {submittedLoanId && (
                    <p className="text-xs text-muted-foreground/70 font-mono">
                        Reference: {submittedLoanId}
                    </p>
                )}
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground">Review & Submit</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Confirm your application details before submitting
                </p>
            </div>

            <div className="space-y-4">
                <Card className="border-border/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            Loan Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <p className="text-xs text-muted-foreground">Amount Requested</p>
                                <p className="text-sm font-medium">
                                    {formatCurrency(loanDetails.amountRequested)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Repayment Period</p>
                                <p className="text-sm font-medium">
                                    {loanDetails.repaymentPeriod} month
                                    {loanDetails.repaymentPeriod !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Interest Rate</p>
                                <p className="text-sm font-medium">{ANNUAL_INTEREST_RATE}% p.a.</p>
                            </div>
                            {calculations && (
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Est. Monthly Payment
                                    </p>
                                    <p className="text-sm font-medium">
                                        {formatCurrency(calculations.monthlyPayment)}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Purpose</p>
                            <p className="text-sm font-medium mt-0.5">{loanDetails.purpose}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Users className="h-4 w-4" />
                            Guarantors ({guarantors.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {guarantors.map((guarantor, index) => (
                                <div
                                    key={guarantor.id}
                                    className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                                >
                                    <div>
                                        <p className="text-sm font-medium">{guarantor.fullName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {guarantor.phone}
                                            {guarantor.relationship &&
                                                ` \u00B7 ${guarantor.relationship}`}
                                        </p>
                                    </div>
                                    <span className="text-xs text-muted-foreground/60">
                                        #{index + 1}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-between pt-6 mt-6 border-t border-border/50">
                <Button
                    type="button"
                    variant="ghost"
                    className="gap-2"
                    onClick={() => dispatch(prevStep())}
                    disabled={isSubmitting}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
                <Button
                    type="button"
                    className="gap-2"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send className="h-4 w-4" />
                            Submit Application
                        </>
                    )}
                </Button>
            </div>
        </motion.div>
    )
}
