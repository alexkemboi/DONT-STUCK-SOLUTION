'use client'

import { Formik, Form } from 'formik'
import { motion } from 'framer-motion'
import { FormField } from '@/components/forms/form-field'
import { FormSelect } from '@/components/forms/form-select'
import { FormCheckbox } from '@/components/forms/form-checkbox'
import { Button } from '@/components/ui/button'
import { employmentSchema } from '@/lib/validations'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setEmployment, setIsEditing } from '@/lib/store/slices/profile-slice'
import type { EmploymentFormValues, EmploymentDetail } from '@/lib/types'
import { create } from 'domain'
import { createEmploymentDetailAction, updateEmploymentDetailAction } from '@/app/actions/client'
import { toast } from 'sonner'

const employmentTypeOptions = [
    { value: 'FullTime', label: 'Full Time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'PartTime', label: 'Part Time' },
]

interface EmploymentFormProps {
    onSuccess?: () => void
}

export function EmploymentForm({ onSuccess }: EmploymentFormProps) {
    const dispatch = useAppDispatch()
    const { client, employment, isEditing } = useAppSelector((state) => state.profile)

    const initialValues: EmploymentFormValues = {
        id: employment?.id || '',
        clientId: client?.id || '',
        employerName: employment?.employerName || '',
        jobTitle: employment?.jobTitle || '',
        department: employment?.department || '',
        dateJoined: employment?.dateJoined ? employment.dateJoined.split('T')[0] : '',
        periodWorked: employment?.periodWorked || '',
        employmentType: employment?.employmentType || 'FullTime',
        contractExpiry: employment?.contractExpiry ? employment.contractExpiry.split('T')[0] : '',
        onNotice: employment?.onNotice || false,
        netSalary: employment?.netSalary || 0,
        branchLocation: employment?.branchLocation || '',
        roadStreet: employment?.roadStreet || '',
        building: employment?.building || '',
        floorOffice: employment?.floorOffice || '',
        telephone: employment?.telephone || '',
    }

    const handleSubmit = async(values: EmploymentFormValues) => {

        if(values.id){
            // we are updating existing employment
            // For simplicity, we'll just log and return here.
            const res = await updateEmploymentDetailAction(values.id, values);
            if(!res.success){
                toast.error("Failed to update employment details. Please try again.");
                return;
            }
            const updatedEmployment: EmploymentDetail = {
                id: values.id,
                clientId: values.clientId || '',
                ...values,
                createdAt: res.data?.createdAt ? res.data.createdAt.toISOString() : new Date().toISOString(),
                updatedAt: res.data?.updatedAt ? res.data.updatedAt.toISOString() : new Date().toISOString(),
            }
            dispatch(setEmployment(updatedEmployment))
            dispatch(setIsEditing(false))
            toast.success("Employment details updated successfully.");
            onSuccess?.()
            return;
        }


        const response = await createEmploymentDetailAction(values)

        if(!response.success){
            // Handle error (you can show a notification or message)
            toast.error(`Failed to save employment details: ${response.error}`)
            return
        }
        const updatedEmployment: EmploymentDetail = {
            id: response?.data?.id || `emp_${Date.now()}`,
            clientId: response?.data?.clientId || '',
            ...values,
            createdAt: response?.data?.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: response?.data?.updatedAt?.toISOString() || new Date().toISOString(),
        }
        dispatch(setEmployment(updatedEmployment))
        dispatch(setIsEditing(false))
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
                            <FormField name="employerName" label="Employer Name" placeholder="Company name" disabled={!isEditing} />
                            <FormField name="jobTitle" label="Job Title" placeholder="Your position" disabled={!isEditing} />
                            <FormField name="department" label="Department" placeholder="Optional" disabled={!isEditing} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <FormSelect name="employmentType" label="Employment Type" options={employmentTypeOptions} disabled={!isEditing} />
                            <FormField name="dateJoined" label="Date Joined" type="date" disabled={!isEditing} />
                            <FormField name="periodWorked" label="Period Worked" placeholder="e.g. 2 years" disabled={!isEditing} />
                            <FormField name="contractExpiry" label="Contract Expiry" type="date" disabled={!isEditing} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="netSalary" label="Net Salary (KES)" type="number" placeholder="0.00" disabled={!isEditing} />
                            <div className="flex items-end pb-2">
                                <FormCheckbox name="onNotice" label="Currently on notice period" disabled={!isEditing} />
                            </div>
                        </div>

                        <div className="border-t border-border pt-4">
                            <h4 className="text-sm font-medium text-foreground mb-4">Work Address</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <FormField name="branchLocation" label="Branch/Location" placeholder="Branch name" disabled={!isEditing} />
                                <FormField name="roadStreet" label="Road/Street" placeholder="Street address" disabled={!isEditing} />
                                <FormField name="building" label="Building" placeholder="Building name" disabled={!isEditing} />
                                <FormField name="floorOffice" label="Floor/Office" placeholder="Floor number" disabled={!isEditing} />
                            </div>
                            <div className="mt-4">
                                <FormField name="telephone" label="Office Telephone" placeholder="+254..." disabled={!isEditing} className="max-w-xs" />
                            </div>
                        </div>

                        {isEditing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-end gap-3 pt-4"
                            >
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => dispatch(setIsEditing(false))}
                                >
                                    Cancel
                                </Button>
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
