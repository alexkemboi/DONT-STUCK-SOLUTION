'use client'

import { Formik, Form } from 'formik'
import { motion } from 'framer-motion'
import { FormField } from '@/components/forms/form-field'
import { Button } from '@/components/ui/button'
import { addressSchema } from '@/lib/validations'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setAddress, setIsEditing } from '@/lib/store/slices/profile-slice'
import type { AddressFormValues, ClientAddress } from '@/lib/types'
import { createClientAddressAction, updateAddressAction } from '@/app/actions/client'
import { toast } from 'sonner'

interface AddressFormProps {
    onSuccess?: () => void
}

export function AddressForm({ onSuccess }: AddressFormProps) {
    const dispatch = useAppDispatch()
    const { client, address, isEditing } = useAppSelector((state) => state.profile)

    const initialValues: AddressFormValues = {
        id: address?.id || '',
        clientId: client?.id || '',
        postalAddress: address?.postalAddress || '',
        postalCode: address?.postalCode || '',
        townCity: address?.townCity || '',
        residentialAddress: address?.residentialAddress || '',
        location: address?.location || '',
        estate: address?.estate || '',
        building: address?.building || '',
        houseNumber: address?.houseNumber || '',
        landmark: address?.landmark || '',
    }

    const handleSubmit = async (values: AddressFormValues) => {

        if(values.id){
            // we are updating existing address
            // For simplicity, we'll just log and return here.
            const res= await updateAddressAction({id: values.id, data: values});
            if(!res.success){
                toast.error("Failed to update address. Please try again.");
                return;
            }
            toast.success("Address updated successfully.");
            dispatch(setAddress(values as ClientAddress))
            dispatch(setIsEditing(false))
            onSuccess?.()
            return;
        }


        // submit data to db
        const response = await createClientAddressAction(values);
        if(!response.success){
            // handle error
            toast.error("Failed to save address. Please try again.");
            return;
        }
        const updatedAddress: ClientAddress = {
            id: response.data?.id || `addr_${Date.now()}`,
            clientId: response.data?.clientId || '',
            ...values,
            createdAt: response.data?.createdAt ? response.data.createdAt : new Date(),
            updatedAt: response.data?.updatedAt ? response.data.updatedAt : new Date(),
        }
        dispatch(setAddress(updatedAddress))
        dispatch(setIsEditing(false))
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
                validationSchema={addressSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ isSubmitting, dirty }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField name="postalAddress" label="Postal Address" placeholder="P.O. Box..." disabled={!isEditing} />
                            <FormField name="postalCode" label="Postal Code" placeholder="00100" disabled={!isEditing} />
                            <FormField name="townCity" label="Town/City" placeholder="Nairobi" disabled={!isEditing} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="residentialAddress" label="Residential Address" placeholder="Street address" disabled={!isEditing} />
                            <FormField name="location" label="Location" placeholder="Area/Location" disabled={!isEditing} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <FormField name="estate" label="Estate" placeholder="Estate name" disabled={!isEditing} />
                            <FormField name="building" label="Building" placeholder="Building name" disabled={!isEditing} />
                            <FormField name="houseNumber" label="House Number" placeholder="House/Apt no." disabled={!isEditing} />
                            <FormField name="landmark" label="Nearest Landmark" placeholder="Nearby landmark" disabled={!isEditing} />
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
