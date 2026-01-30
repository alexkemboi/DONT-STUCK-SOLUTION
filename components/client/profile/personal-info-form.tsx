'use client'

import { Formik, Form } from 'formik'
import { motion } from 'framer-motion'
import { FormField } from '@/components/forms/form-field'
import { FormSelect } from '@/components/forms/form-select'
import { Button } from '@/components/ui/button'
import { personalInfoSchema } from '@/lib/validations'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setClient, setIsEditing } from '@/lib/store/slices/profile-slice'
import type { PersonalInfoFormValues, Client } from '@/lib/types'
import { createClientAction, updateClientAction } from '@/app/actions/client'
import { toast } from 'sonner'

const titleOptions = [
    { value: 'Mr', label: 'Mr' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Ms', label: 'Ms' },
    { value: 'Dr', label: 'Dr' },
    { value: 'Prof', label: 'Prof' },
]

const maritalStatusOptions = [
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Widowed', label: 'Widowed' },
]

interface PersonalInfoFormProps {
    onSuccess?: () => void
}

export function PersonalInfoForm({ onSuccess }: PersonalInfoFormProps) {
    const dispatch = useAppDispatch()
    const { client, isEditing } = useAppSelector((state) => state.profile)

    const initialValues: PersonalInfoFormValues = {
        id: client?.id || '',
        userId: client?.userId || '',
        title: client?.title || 'Mr',
        surname: client?.surname || '',
        otherNames: client?.otherNames || '',
        dateOfBirth: client?.dateOfBirth ? client.dateOfBirth.split('T')[0] : '',
        maritalStatus: client?.maritalStatus || 'Single',
        nationality: client?.nationality || '',
        dependents: client?.dependents || 0,
        idPassportNo: client?.idPassportNo || '',
        kraPin: client?.kraPin || '',
        phoneWork: client?.phoneWork || '',
        phoneMobile: client?.phoneMobile || '',
        phoneAlternative: client?.phoneAlternative || '',
        emailPersonal: client?.emailPersonal || '',
        emailOfficial: client?.emailOfficial || '',
    }

    const handleSubmit = async(values: PersonalInfoFormValues) => {

        if(values.id){

            const res = await updateClientAction(values.id, values);

            if(!res.success){
                toast.error("Failed to update client. Please try again.");
                return;
            }

            const updatedClient: Client = {
                id: res.data?.id || values.id,
                userId: res.data?.userId || values.userId || '',
                ...values,
                status: res.data?.status || 'Active',
                createdAt: res.data?.createdAt ? res.data.createdAt.toISOString() : new Date().toISOString(),
                updatedAt: res.data?.updatedAt ? res.data.updatedAt.toISOString() : new Date().toISOString(),
            }
            dispatch(setClient(updatedClient))
            dispatch(setIsEditing(false))
            toast.success("Client profile updated successfully.");
            onSuccess?.()
            return;
        }

        // submit data to db

        const response = await createClientAction(values);

        if(!response.success){
            // handle error
            toast.error("Failed to create client. Please try again.");
            return;
        }

        

        const updatedClient: Client = {
            id: response.data?.id || `client_${Date.now()}`,
            userId: response.data?.userId || '',
            ...values,
            status: response.data?.status || 'Active',
            createdAt: response.data?.createdAt ? response.data.createdAt.toISOString() : new Date().toISOString(),
            updatedAt: response.data?.updatedAt ? response.data.updatedAt.toISOString() : new Date().toISOString(),
        }
        dispatch(setClient(updatedClient))
        dispatch(setIsEditing(false))
        toast.success("Client profile saved successfully.");
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
                validationSchema={personalInfoSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ isSubmitting, dirty }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormSelect name="title" label="Title" options={titleOptions} disabled={!isEditing} />
                            <FormField name="surname" label="Surname" placeholder="Enter surname" disabled={!isEditing} />
                            <FormField name="otherNames" label="Other Names" placeholder="Enter other names" disabled={!isEditing} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormField name="dateOfBirth" label="Date of Birth" type="date" disabled={!isEditing} />
                            <FormSelect name="maritalStatus" label="Marital Status" options={maritalStatusOptions} disabled={!isEditing} />
                            <FormField name="nationality" label="Nationality" placeholder="Enter nationality" disabled={!isEditing} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormField name="dependents" label="Number of Dependents" type="number" disabled={!isEditing} />
                            <FormField name="idPassportNo" label="ID/Passport Number" placeholder="Enter ID or Passport" disabled={!isEditing} />
                            <FormField name="kraPin" label="KRA PIN" placeholder="Enter KRA PIN (optional)" disabled={!isEditing} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormField name="phoneMobile" label="Mobile Phone" placeholder="+254..." disabled={!isEditing} />
                            <FormField name="phoneWork" label="Work Phone" placeholder="Optional" disabled={!isEditing} />
                            <FormField name="phoneAlternative" label="Alternative Phone" placeholder="Optional" disabled={!isEditing} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="emailPersonal" label="Personal Email" type="email" placeholder="personal@email.com" disabled={!isEditing} />
                            <FormField name="emailOfficial" label="Official Email" type="email" placeholder="official@company.com" disabled={!isEditing} />
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
