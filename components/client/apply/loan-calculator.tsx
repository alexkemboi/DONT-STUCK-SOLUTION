'use client'

import { useAppSelector } from '@/lib/store/hooks'
import { AmortizationSchedule } from '@/components/shared/amortization-schedule'

const MONTHLY_INTEREST_RATE = 20

export function LoanCalculator() {
    const { loanDetails } = useAppSelector((state) => state.loanApplication)

    return (
        <AmortizationSchedule
            principal={loanDetails.amountRequested || 0}
            monthlyInterestRate={MONTHLY_INTEREST_RATE}
            periodMonths={loanDetails.repaymentPeriod || 0}
            showFullSchedule={true}
            compact={false}
        />
    )
}
