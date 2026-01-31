'use client'

import { Formik, Form } from 'formik'
import { motion } from 'framer-motion'
import { FormField } from '@/components/forms/form-field'
import { FormSelect } from '@/components/forms/form-select'
import { FormCheckbox } from '@/components/forms/form-checkbox'
import { Button } from '@/components/ui/button'
import { employmentSchema } from '@/lib/validations'
import type { EmploymentFormValues, EmploymentDetail } from '@/lib/types'
import { createEmploymentDetailAction, updateEmploymentDetailAction } from '@/app/actions/client'
import { toast } from 'sonner'

const employmentTypeOptions = [
    { value: 'FullTime', label: 'Full Time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'PartTime', label: 'Part Time' },
]

interface EmploymentFormProps {
    employment?: EmploymentDetail;
    isReadOnly?: boolean;
    onSuccess?: () => void
}

export function EmploymentForm({ employment, isReadOnly = false, onSuccess }: EmploymentFormProps) {
    const initialValues: EmploymentFormValues = {
        id: employment?.id || '',
        clientId: employment?.clientId || '',
        employerName: employment?.employerName || '',
        jobTitle: employment?.jobTitle || '',
        department: employment?.department || '',
        dateJoined: employment?.dateJoined ? new Date(employment.dateJoined).toISOString().split('T')[0] : '',
        periodWorked: employment?.periodWorked || '',
        employmentType: employment?.employmentType || 'FullTime',
        contractExpiry: employment?.contractExpiry ? new Date(employment.contractExpiry).toISOString().split('T')[0] : '',
        onNotice: employment?.onNotice || false,
        netSalary: parseFloat(employment?.netSalary as string) || 0,
        branchLocation: employment?.branchLocation || '',
        roadStreet: employment?.roadStreet || '',
        building: employment?.building || '',
        floorOffice: employment?.floorOffice || '',
        telephone: employment?.telephone || '',
    }

    const handleSubmit = async(values: EmploymentFormValues) => {
        if(values.id){
            const res = await updateEmploymentDetailAction(values.id, {
                ...values,
                netSalary:values.netSalary.toString()
            });
            if(!res.success){
                toast.error("Failed to update employment details. Please try again.");
                return;
            }
            toast.success("Employment details updated successfully.");
            onSuccess?.()
            return;
        }

        const response = await createEmploymentDetailAction(values)
        if(!response.success){
            toast.error(`Failed to save employment details: ${response.error}`)
            return
        }
        toast.success('Employment details saved successfully')
        onSuccess?.()
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={employmentSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ isSubmitting, dirty }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormField name="employerName" label="Employer Name" placeholder="Company name" disabled={isReadOnly} />
                            <FormField name="jobTitle" label="Job Title" placeholder="Your position" disabled={isReadOnly} />
                            <FormField name="department" label="Department" placeholder="Optional" disabled={isReadOnly} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <FormSelect name="employmentType" label="Employment Type" options={employmentTypeOptions} disabled={isReadOnly} />
                            <FormField name="dateJoined" label="Date Joined" type="date" disabled={isReadOnly} />
                            <FormField name="periodWorked" label="Period Worked" placeholder="e.g. 2 years" disabled={isReadOnly} />
                            <FormField name="contractExpiry" label="Contract Expiry" type="date" disabled={isReadOnly} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="netSalary" label="Net Salary (KES)" type="number" placeholder="0.00" disabled={isReadOnly} />
                            <div className="flex items-end pb-2">
                                <FormCheckbox name="onNotice" label="Currently on notice period" disabled={isReadOnly} />
                            </div>
                        </div>

                        <div className="border-t border-border pt-4">
                            <h4 className="text-sm font-medium text-foreground mb-4">Work Address</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <FormField name="branchLocation" label="Branch/Location" placeholder="Branch name" disabled={isReadOnly} />
                                <FormField name="roadStreet" label="Road/Street" placeholder="Street address" disabled={isReadOnly} />
                                <FormField name="building" label="Building" placeholder="Building name" disabled={isReadOnly} />
                                <FormField name="floorOffice" label="Floor/Office" placeholder="Floor number" disabled={isReadOnly} />
                            </div>
                            <div className="mt-4">
                                <FormField name="telephone" label="Office Telephone" placeholder="+254..." disabled={isReadOnly} className="max-w-xs" />
                            </div>
                        </div>

                        {!isReadOnly && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-end gap-3 pt-4"
                            >
                                <Button type="submit" disabled={isSubmitting || !dirty}>
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </motion.div>
                        )}
                    </Form>
                )}
            </Formik>
        </motion.div>
    )
}
