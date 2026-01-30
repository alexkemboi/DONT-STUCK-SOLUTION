'use client'

import { useEffect } from 'react'
import { Formik, Form, useFormikContext } from 'formik'
import { motion } from 'framer-motion'
import { FormField } from '@/components/forms/form-field'
import { FormTextarea } from '@/components/forms/form-textarea'
import { FormSelect } from '@/components/forms/form-select'
import { Button } from '@/components/ui/button'
import { loanApplicationSchema } from '@/lib/validations'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setLoanDetails, nextStep } from '@/lib/store/slices/loan-application-slice'
import type { LoanApplicationFormValues } from '@/lib/types'
import { ArrowRight } from 'lucide-react'

const repaymentOptions = [
    { value: '1', label: '1 month' },
    { value: '3', label: '3 months' },
    { value: '6', label: '6 months' },
    { value: '12', label: '12 months' },
    { value: '24', label: '24 months' },
    { value: '36', label: '36 months' },
    { value: '48', label: '48 months' },
    { value: '60', label: '60 months' },
]

function FormValuesObserver() {
    const { values } = useFormikContext<LoanApplicationFormValues>()
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(
            setLoanDetails({
                purpose: values.purpose,
                amountRequested: Number(values.amountRequested) || 0,
                repaymentPeriod: Number(values.repaymentPeriod) || 1,
            })
        )
    }, [values, dispatch])

    return null
}

export function LoanDetailsForm() {
    const dispatch = useAppDispatch()
    const { loanDetails } = useAppSelector((state) => state.loanApplication)

    const initialValues: LoanApplicationFormValues = {
        purpose: loanDetails.purpose,
        amountRequested: loanDetails.amountRequested || ('' as unknown as number),
        repaymentPeriod: loanDetails.repaymentPeriod,
    }

    const handleSubmit = (values: LoanApplicationFormValues) => {
        dispatch(
            setLoanDetails({
                purpose: values.purpose,
                amountRequested: Number(values.amountRequested),
                repaymentPeriod: Number(values.repaymentPeriod),
            })
        )
        dispatch(nextStep())
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground">Loan Details</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Tell us about the loan you need
                </p>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={loanApplicationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ dirty, isValid }) => (
                    <Form className="space-y-6">
                        <FormValuesObserver />

                        <FormTextarea
                            name="purpose"
                            label="Loan Purpose"
                            placeholder="Describe the purpose of this loan (e.g., business expansion, education fees, home improvement)..."
                            rows={4}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                name="amountRequested"
                                label="Amount Requested (KES)"
                                type="number"
                                placeholder="e.g. 50000"
                            />
                            <FormSelect
                                name="repaymentPeriod"
                                label="Repayment Period"
                                options={repaymentOptions}
                                placeholder="Select period"
                            />
                        </div>

                        <div className="flex justify-end pt-4 border-t border-border/50">
                            <Button type="submit" className="gap-2">
                                Continue
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </motion.div>
    )
}
