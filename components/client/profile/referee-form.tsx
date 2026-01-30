'use client'

import { useState } from 'react'
import { Formik, Form } from 'formik'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react'
import { FormField } from '@/components/forms/form-field'
import { FormCheckbox } from '@/components/forms/form-checkbox'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { refereeSchema } from '@/lib/validations'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { addReferee, updateReferee, removeReferee } from '@/lib/store/slices/profile-slice'
import type { RefereeFormValues, Referee } from '@/lib/types'
import { createRefereeAction, deleteRefereeAction, updateRefereeAction } from '@/app/actions/client'
import { toast } from 'sonner'

const emptyReferee: RefereeFormValues = {
    surname: '',
    otherNames: '',
    relationship: '',
    idPassportNo: '',
    employerName: '',
    locationStation: '',
    phoneWork: '',
    phoneMobile: '',
    isRelative: false,
}

export function RefereeForm() {
    const dispatch = useAppDispatch()
    const { client, referees, isEditing } = useAppSelector((state) => state.profile)
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const handleAddSubmit = async (values: RefereeFormValues) => {
        //
        const response = await createRefereeAction(values)


        if(!response.success){
            // Handle error (you can show a notification or message)
            toast.error(`Failed to add referee: ${response.error}`)
            return
        }
        const newReferee: Referee = {
            id:  response?.data?.id || `ref_${Date.now()}`,
            clientId: response?.data?.clientId || '',
            ...values,
            createdAt: response?.data?.createdAt.toISOString() || new Date().toISOString(),
        }
        dispatch(addReferee(newReferee))
        setShowAddForm(false)
    }

    const handleEditSubmit = async(values: RefereeFormValues, refereeId: string, createdAt: string) => {
        const response = await updateRefereeAction(refereeId, values)
        if(!response.success){
            // Handle error (you can show a notification or message)
            toast.error(`Failed to update referee: ${response.error}`)
            return
        }

        const updatedReferee: Referee = {
            id: refereeId,
            clientId: client?.id || '',
            ...values,
            createdAt,
        }
        dispatch(updateReferee(updatedReferee))
        setEditingId(null)
        toast.success('Referee updated successfully')
    }

    const handleDelete = async(id: string) => {
       

        const response = await deleteRefereeAction(id)

        if(!response.success){
            // Handle error (you can show a notification or message)
            toast.error(`Failed to delete referee: ${response.error}`)
            return
        }
        dispatch(removeReferee(id))
        toast.success('Referee deleted successfully')

    }

    const RefereeCard = ({ referee }: { referee: Referee }) => {
        const isEditingThis = editingId === referee.id

        if (isEditingThis) {
            const editValues: RefereeFormValues = {
                surname: referee.surname,
                otherNames: referee.otherNames,
                relationship: referee.relationship,
                idPassportNo: referee.idPassportNo || '',
                employerName: referee.employerName || '',
                locationStation: referee.locationStation || '',
                phoneWork: referee.phoneWork || '',
                phoneMobile: referee.phoneMobile,
                isRelative: referee.isRelative,
            }

            return (
                <Card className="border-primary/30">
                    <CardContent className="pt-4">
                        <Formik
                            initialValues={editValues}
                            validationSchema={refereeSchema}
                            onSubmit={(values) => handleEditSubmit(values, referee.id as string, referee.createdAt as string)}
                        >
                            {({ isSubmitting }) => (
                                <Form className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField name="surname" label="Surname" placeholder="Surname" />
                                        <FormField name="otherNames" label="Other Names" placeholder="Other names" />
                                        <FormField name="relationship" label="Relationship" placeholder="e.g. Brother, Friend" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField name="phoneMobile" label="Mobile Phone" placeholder="+254..." />
                                        <FormField name="phoneWork" label="Work Phone" placeholder="Optional" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField name="idPassportNo" label="ID/Passport" placeholder="Optional" />
                                        <FormField name="employerName" label="Employer" placeholder="Optional" />
                                        <FormField name="locationStation" label="Location/Station" placeholder="Optional" />
                                    </div>
                                    <FormCheckbox name="isRelative" label="This person is a relative" />
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button type="button" variant="outline" size="sm" onClick={() => setEditingId(null)}>
                                            <X className="h-4 w-4 mr-1" /> Cancel
                                        </Button>
                                        <Button type="submit" size="sm" disabled={isSubmitting}>
                                            <Check className="h-4 w-4 mr-1" /> Save
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </CardContent>
                </Card>
            )
        }

        return (
            <Card>
                <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <h4 className="font-medium text-foreground">
                                    {referee.surname} {referee.otherNames}
                                </h4>
                                {referee.isRelative && (
                                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                                        Relative
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">{referee.relationship}</p>
                            <p className="text-sm text-muted-foreground">{referee.phoneMobile}</p>
                            {referee.employerName && (
                                <p className="text-sm text-muted-foreground">Works at: {referee.employerName}</p>
                            )}
                        </div>
                        {isEditing && (
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => setEditingId(referee.id as string)}>
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(referee.id as string)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            <AnimatePresence mode="popLayout">
                {referees.map((referee) => (
                    <motion.div
                        key={referee.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <RefereeCard referee={referee} />
                    </motion.div>
                ))}
            </AnimatePresence>

            {referees.length === 0 && !showAddForm && (
                <div className="text-center py-8 text-muted-foreground">
                    <p>No referees added yet.</p>
                    {isEditing && <p className="text-sm mt-1">Click the button below to add a referee.</p>}
                </div>
            )}

            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card className="border-primary/30">
                            <CardContent className="pt-4">
                                <h4 className="font-medium text-foreground mb-4">Add New Referee</h4>
                                <Formik
                                    initialValues={emptyReferee}
                                    validationSchema={refereeSchema}
                                    onSubmit={handleAddSubmit}
                                >
                                    {({ isSubmitting }) => (
                                        <Form className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <FormField name="surname" label="Surname" placeholder="Surname" />
                                                <FormField name="otherNames" label="Other Names" placeholder="Other names" />
                                                <FormField name="relationship" label="Relationship" placeholder="e.g. Brother, Friend" />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField name="phoneMobile" label="Mobile Phone" placeholder="+254..." />
                                                <FormField name="phoneWork" label="Work Phone" placeholder="Optional" />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <FormField name="idPassportNo" label="ID/Passport" placeholder="Optional" />
                                                <FormField name="employerName" label="Employer" placeholder="Optional" />
                                                <FormField name="locationStation" label="Location/Station" placeholder="Optional" />
                                            </div>
                                            <FormCheckbox name="isRelative" label="This person is a relative" />
                                            <div className="flex justify-end gap-2 pt-2">
                                                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                                                    Cancel
                                                </Button>
                                                <Button type="submit" disabled={isSubmitting}>
                                                    Add Referee
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {isEditing && !showAddForm && (
                <Button variant="outline" onClick={() => setShowAddForm(true)} className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add Referee
                </Button>
            )}
        </motion.div>
    )
}
