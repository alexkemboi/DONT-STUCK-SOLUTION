import { Suspense } from 'react'
import { getClientForApplyAction, getClientLoansAction } from '@/app/actions/loan'
import { ApplyLoanClient } from '@/components/client/apply/apply-loan-client'

const ApplyLoanPage = async () => {
    const [clientResult, loansResult] = await Promise.all([
        getClientForApplyAction(),
        getClientLoansAction(),
    ])

    return (
        <main className="min-h-screen bg-background">
            <Suspense>
                <ApplyLoanClient
                    clientData={clientResult?.data || null}
                    existingLoans={loansResult?.data || []}
                />
            </Suspense>
        </main>
    )
}

export default ApplyLoanPage
