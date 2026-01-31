'use client'

import { Formik, Form } from 'formik'
import { motion } from 'framer-motion'
import { FormField } from '@/components/forms/form-field'
import { Button } from '@/components/ui/button'
import { addressSchema } from '@/lib/validations'
import type { AddressFormValues, ClientAddress } from '@/lib/types'
import { createClientAddressAction, updateAddressAction } from '@/app/actions/client'
import { toast } from 'sonner'

interface AddressFormProps {
    addresses?: ClientAddress[];
    isReadOnly?: boolean;
    onSuccess?: () => void
}

export function AddressForm({ addresses, isReadOnly = false, onSuccess }: AddressFormProps) {
    const address = addresses?.[0];

    const initialValues: AddressFormValues = {
        id: address?.id || '',
        clientId: address?.clientId || '',
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
            const res= await updateAddressAction({id: values.id, data: values});
            if(!res.success){
                toast.error("Failed to update address. Please try again.");
                return;
            }
            toast.success("Address updated successfully.");
            onSuccess?.()
            return;
        }

        const response = await createClientAddressAction(values);
        if(!response.success){
            toast.error("Failed to save address. Please try again.");
            return;
        }
        toast.success("Address saved successfully.");
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
                            <FormField name="postalAddress" label="Postal Address" placeholder="P.O. Box..." disabled={isReadOnly} />
                            <FormField name="postalCode" label="Postal Code" placeholder="00100" disabled={isReadOnly} />
                            <FormField name="townCity" label="Town/City" placeholder="Nairobi" disabled={isReadOnly} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="residentialAddress" label="Residential Address" placeholder="Street address" disabled={isReadOnly} />
                            <FormField name="location" label="Location" placeholder="Area/Location" disabled={isReadOnly} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <FormField name="estate" label="Estate" placeholder="Estate name" disabled={isReadOnly} />
                            <FormField name="building" label="Building" placeholder="Building name" disabled={isReadOnly} />
                            <FormField name="houseNumber" label="House Number" placeholder="House/Apt no." disabled={isReadOnly} />
                            <FormField name="landmark" label="Nearest Landmark" placeholder="Nearby landmark" disabled={isReadOnly} />
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
