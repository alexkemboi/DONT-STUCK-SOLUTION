'use client'

import { useState } from 'react'
import { Formik, Form } from 'formik'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Edit2, X, ArrowLeft, ArrowRight, User } from 'lucide-react'
import { FormField } from '@/components/forms/form-field'
import { FormSelect } from '@/components/forms/form-select'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { guarantorSchema } from '@/lib/validations'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import {
    addGuarantor,
    updateGuarantor,
    removeGuarantor,
    nextStep,
    prevStep,
} from '@/lib/store/slices/loan-application-slice'
import type { GuarantorFormValues } from '@/lib/types'
import { toast } from 'sonner'

const relationshipOptions = [
    { value: 'Spouse', label: 'Spouse' },
    { value: 'Parent', label: 'Parent' },
    { value: 'Sibling', label: 'Sibling' },
    { value: 'Friend', label: 'Friend' },
    { value: 'Colleague', label: 'Colleague' },
    { value: 'Business Partner', label: 'Business Partner' },
    { value: 'Other', label: 'Other' },
]

const emptyGuarantor: GuarantorFormValues = {
    fullName: '',
    phone: '',
    email: '',
    idNumber: '',
    relationship: '',
}

export function GuarantorsForm() {
    const dispatch = useAppDispatch()
    const { guarantors } = useAppSelector((state) => state.loanApplication)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const handleAddSubmit = (values: GuarantorFormValues, { resetForm }: { resetForm: () => void }) => {
        dispatch(
            addGuarantor({
                id: crypto.randomUUID(),
                ...values,
            })
        )
        resetForm()
        setShowForm(false)
        toast.success('Guarantor added')
    }

    const handleEditSubmit = (values: GuarantorFormValues) => {
        if (!editingId) return
        dispatch(
            updateGuarantor({
                id: editingId,
                ...values,
            })
        )
        setEditingId(null)
        toast.success('Guarantor updated')
    }

    const handleRemove = (id: string) => {
        dispatch(removeGuarantor(id))
        toast.success('Guarantor removed')
    }

    const handleContinue = () => {
        if (guarantors.length === 0) {
            toast.error('Please add at least one guarantor')
            return
        }
        dispatch(nextStep())
    }

    const editingGuarantor = editingId
        ? guarantors.find((g) => g.id === editingId)
        : null

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground">Guarantors</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Add at least one guarantor for your loan application
                </p>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {guarantors.map((guarantor) => (
                        <motion.div
                            key={guarantor.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            layout
                        >
                            {editingId === guarantor.id ? (
                                <Card className="border-foreground/20">
                                    <CardContent className="pt-5">
                                        <Formik
                                            initialValues={{
                                                fullName: guarantor.fullName,
                                                phone: guarantor.phone,
                                                email: guarantor.email,
                                                idNumber: guarantor.idNumber,
                                                relationship: guarantor.relationship,
                                            }}
                                            validationSchema={guarantorSchema}
                                            onSubmit={handleEditSubmit}
                                        >
                                            {({ isSubmitting }) => (
                                                <Form className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <FormField
                                                            name="fullName"
                                                            label="Full Name"
                                                            placeholder="Enter full name"
                                                        />
                                                        <FormField
                                                            name="phone"
                                                            label="Phone Number"
                                                            placeholder="+254..."
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <FormField
                                                            name="email"
                                                            label="Email (Optional)"
                                                            type="email"
                                                            placeholder="email@example.com"
                                                        />
                                                        <FormField
                                                            name="idNumber"
                                                            label="ID Number (Optional)"
                                                            placeholder="Enter ID number"
                                                        />
                                                    </div>
                                                    <FormSelect
                                                        name="relationship"
                                                        label="Relationship"
                                                        options={relationshipOptions}
                                                        placeholder="Select relationship"
                                                    />
                                                    <div className="flex justify-end gap-2 pt-2">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setEditingId(null)}
                                                        >
                                                            <X className="h-4 w-4 mr-1" />
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            type="submit"
                                                            size="sm"
                                                            disabled={isSubmitting}
                                                        >
                                                            Save
                                                        </Button>
                                                    </div>
                                                </Form>
                                            )}
                                        </Formik>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="border-border/50">
                                    <CardContent className="py-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    {guarantor.fullName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {guarantor.phone}
                                                    {guarantor.relationship &&
                                                        ` \u00B7 ${guarantor.relationship}`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setEditingId(guarantor.id)}
                                            >
                                                <Edit2 className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                                onClick={() => handleRemove(guarantor.id)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {showForm ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="border-dashed border-foreground/20">
                            <CardContent className="pt-5">
                                <Formik
                                    initialValues={emptyGuarantor}
                                    validationSchema={guarantorSchema}
                                    onSubmit={handleAddSubmit}
                                >
                                    {({ isSubmitting }) => (
                                        <Form className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    name="fullName"
                                                    label="Full Name"
                                                    placeholder="Enter full name"
                                                />
                                                <FormField
                                                    name="phone"
                                                    label="Phone Number"
                                                    placeholder="+254..."
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    name="email"
                                                    label="Email (Optional)"
                                                    type="email"
                                                    placeholder="email@example.com"
                                                />
                                                <FormField
                                                    name="idNumber"
                                                    label="ID Number (Optional)"
                                                    placeholder="Enter ID number"
                                                />
                                            </div>
                                            <FormSelect
                                                name="relationship"
                                                label="Relationship"
                                                options={relationshipOptions}
                                                placeholder="Select relationship"
                                            />
                                            <div className="flex justify-end gap-2 pt-2">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setShowForm(false)}
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    disabled={isSubmitting}
                                                >
                                                    Add Guarantor
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full border-dashed gap-2"
                        onClick={() => setShowForm(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Add Guarantor
                    </Button>
                )}
            </div>

            <div className="flex justify-between pt-6 mt-6 border-t border-border/50">
                <Button
                    type="button"
                    variant="ghost"
                    className="gap-2"
                    onClick={() => dispatch(prevStep())}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
                <Button type="button" className="gap-2" onClick={handleContinue}>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </motion.div>
    )
}
