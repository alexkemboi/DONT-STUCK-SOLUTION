'use client'

import { Formik, Form } from 'formik'
import { motion } from 'framer-motion'
import { FormField } from '@/components/forms/form-field'
import { Button } from '@/components/ui/button'
import { bankDetailSchema } from '@/lib/validations'
import type { BankDetailFormValues, BankDetail } from '@/lib/types'
import { ChangeEvent, useState } from 'react'
import { createBankAction, uploadBankDocumentAction } from '@/app/actions/client'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { deleteFile, UploadResult } from '@/services/storage.service'

interface BankDetailsProps {
    bankDetails?: BankDetail;
    isReadOnly?: boolean;
    onSuccess?: () => void
}

export function BankDetails({ bankDetails, isReadOnly = false, onSuccess }: BankDetailsProps) {
    const [uploading, setUploading] = useState(false)
    const [proofDocumentUrl, setProofDocumentUrl] = useState<UploadResult | null>(null)

    const initialValues: BankDetailFormValues = {
        bankName: bankDetails?.bankName || '',
        branch: bankDetails?.branch || '',
        accountName: bankDetails?.accountName || '',
        accountNumber: bankDetails?.accountNumber || '',
        proofDocumentUrl: bankDetails?.proofDocumentUrl || '',
    }

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setUploading(true)
            const formData = new FormData()
            formData.append('file', file)
            const result = await uploadBankDocumentAction(formData)
            setUploading(false)
            if (result.success && result.data) {
                setProofDocumentUrl(result as UploadResult)
                toast.success('Document uploaded successfully')
            } else {
                toast.error(result.error || 'Failed to upload document')
            }
        }
    }

    const handleSubmit = async (values: BankDetailFormValues) => {
        if (proofDocumentUrl == null && !bankDetails?.proofDocumentUrl) {
            toast.error('Please upload a proof document')
            return;
        }
        
        const finalValues = {
            ...values,
            proofDocumentUrl: proofDocumentUrl?.data?.url || bankDetails?.proofDocumentUrl,
        };

        const response = await createBankAction(finalValues)
        if (response.success == false) {
            toast.error(response.error || 'Failed to create bank details')
            return;
        }
        toast.success('Bank details saved successfully')
        onSuccess?.()
    }

    const handleRemoveDocument = async() => {
        try {
            const result = await deleteFile(proofDocumentUrl?.data?.publicId as string)
            if (result.success) {
                setProofDocumentUrl(null)
            } else {
                toast.error('Failed to remove document')
            }
        }catch(error){
            toast.error('Failed to remove document')
            return;
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={bankDetailSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, dirty, setFieldValue }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="bankName" label="Bank Name" placeholder="e.g. Equity Bank" disabled={isReadOnly} />
                            <FormField name="branch" label="Branch" placeholder="e.g. Westlands Branch" disabled={isReadOnly} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="accountName" label="Account Name" placeholder="Full account name" disabled={isReadOnly} />
                            <FormField name="accountNumber" label="Account Number" placeholder="Enter account number" disabled={isReadOnly} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="proofDocument" className="block text-sm font-medium text-gray-700">
                                    Proof Document
                                </label>
                                <input
                                    id="proofDocument"
                                    name="proofDocument"
                                    type="file"
                                    onChange={handleFileChange}
                                    disabled={isReadOnly || uploading}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                />
                                {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                                {(proofDocumentUrl || bankDetails?.proofDocumentUrl) && !uploading && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <a href={proofDocumentUrl?.data?.url || bankDetails?.proofDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 mt-1">
                                            View uploaded document
                                        </a>
                                        {!isReadOnly && (
                                            <button
                                               onClick={() => handleRemoveDocument()}
                                                className="text-sm text-red-500 hover:text-red-700">
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {!isReadOnly && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-end gap-3 pt-4"
                            >
                                <Button type="submit" disabled={isSubmitting || !dirty || uploading}>
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
