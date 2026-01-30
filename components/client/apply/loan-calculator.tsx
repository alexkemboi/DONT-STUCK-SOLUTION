'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppSelector } from '@/lib/store/hooks'
import { Calculator } from 'lucide-react'

const ANNUAL_INTEREST_RATE = 20

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)

export function LoanCalculator() {
    const { loanDetails } = useAppSelector((state) => state.loanApplication)

    const calculations = useMemo(() => {
        const { amountRequested, repaymentPeriod } = loanDetails
        if (!amountRequested || amountRequested <= 0 || !repaymentPeriod || repaymentPeriod <= 0) {
            return null
        }

        const monthlyRate = ANNUAL_INTEREST_RATE / 100 / 12
        const monthlyPayment =
            monthlyRate === 0
                ? amountRequested / repaymentPeriod
                : (amountRequested * monthlyRate * Math.pow(1 + monthlyRate, repaymentPeriod)) /
                  (Math.pow(1 + monthlyRate, repaymentPeriod) - 1)

        const totalRepayable = monthlyPayment * repaymentPeriod
        const totalInterest = totalRepayable - amountRequested

        return {
            monthlyPayment: Math.round(monthlyPayment),
            totalRepayable: Math.round(totalRepayable),
            totalInterest: Math.round(totalInterest),
        }
    }, [loanDetails])

    return (
        <Card className="border-border/50">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                    Loan Summary
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {!calculations ? (
                    <p className="text-sm text-muted-foreground">
                        Enter loan details to see estimated payments.
                    </p>
                ) : (
                    <>
                        <div className="space-y-3">
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm text-muted-foreground">
                                    Loan Amount
                                </span>
                                <span className="text-sm font-medium">
                                    {formatCurrency(loanDetails.amountRequested)}
                                </span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm text-muted-foreground">
                                    Interest Rate
                                </span>
                                <span className="text-sm font-medium">
                                    {ANNUAL_INTEREST_RATE}% p.a.
                                </span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm text-muted-foreground">
                                    Period
                                </span>
                                <span className="text-sm font-medium">
                                    {loanDetails.repaymentPeriod} month{loanDetails.repaymentPeriod !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-border/50 pt-3 space-y-3">
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm text-muted-foreground">
                                    Total Interest
                                </span>
                                <span className="text-sm font-medium text-muted-foreground">
                                    {formatCurrency(calculations.totalInterest)}
                                </span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm text-muted-foreground">
                                    Total Repayable
                                </span>
                                <span className="text-sm font-medium">
                                    {formatCurrency(calculations.totalRepayable)}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-border/50 pt-3">
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm font-medium text-foreground">
                                    Monthly Payment
                                </span>
                                <span className="text-lg font-semibold text-foreground">
                                    {formatCurrency(calculations.monthlyPayment)}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
