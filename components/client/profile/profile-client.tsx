'use client'

import React, { use, useEffect } from "react"

import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, MapPin, Building2, Calendar, CreditCard, User, Briefcase, Users, Plus, Edit2, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setActiveSection, setAddress, setBankDetails, setClient, setEmployment, setIsEditing, setReferees } from '@/lib/store/slices/profile-slice'
import { PersonalInfoForm } from './personal-info-form'
import { AddressForm } from './address-form'
import { EmploymentForm } from './employment-form'
import { RefereeForm } from './referee-form'
import { BankDetails as BankDetailsForm } from './bank-details'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { BankDetail, Client, ClientAddress, EmploymentDetail, Referee } from "@/lib/types"

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'personal', label: 'Personal' },
    { id: 'address', label: 'Address' },
    { id: 'employment', label: 'Employment' },
    { id: 'referees', label: 'Referees' },
    { id: 'bank', label: 'Bank Details' },
] as const

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
    if (!value) return null
    return (
        <div className="flex items-start gap-3 py-1">
            <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="min-w-0">
                <span className="text-muted-foreground text-sm">{label}:</span>
                <span className="text-foreground text-sm ml-2">{value}</span>
            </div>
        </div>
    )
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="py-4 border-b border-border last:border-b-0">
            <h3 className="text-sm font-medium text-foreground mb-3">{title}</h3>
            <div className="space-y-1">{children}</div>
        </div>
    )
}

export function ProfileClient({
    bankDetailsSource,
    refereesSource,
    // employmentSource,
    addressSource,
    clientSource
}:{
    bankDetailsSource: any | null,
    refereesSource:Referee[],
    // employmentSource: any | null,
    addressSource: ClientAddress | null,
    clientSource: any | null
}) {
    useEffect(()=>{
        if (!clientSource?.data) return

        const client = {
            ...clientSource.data,
            dateOfBirth: clientSource.data.dateOfBirth
                ? new Date(clientSource.data.dateOfBirth).toISOString()
                : null
        }
        dispatch(setBankDetails(bankDetailsSource.data as BankDetail))
        dispatch(setClient(client as Client))
        dispatch(setAddress(addressSource as ClientAddress))
        dispatch(setReferees(refereesSource))
        // dispatch(setEmployment(employmentSource.data as EmploymentDetail ))
        return
    }, [clientSource, addressSource, refereesSource])

    const dispatch = useAppDispatch()
    const { activeSection, isEditing, client, address, employment, bankDetails, referees } = useAppSelector((state) => state.profile)

    const handleTabChange = (value: string) => {
        dispatch(setActiveSection(value as typeof activeSection))
        dispatch(setIsEditing(false))
    }

    const handleEditClick = () => {
        dispatch(setIsEditing(true))
    }

    const getInitials = () => {
        if (!client) return 'U'
        return `${client.surname?.charAt(0) || ''}${client.otherNames?.charAt(0) || ''}`.toUpperCase() || 'U'
    }

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return null
        try {
            return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        } catch {
            return dateStr
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <h1 className="text-xl font-semibold text-foreground">Profile</h1>
                        <Button onClick={handleEditClick} className="bg-foreground text-background hover:bg-foreground/90">
                            <Plus className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-border bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Tabs value={activeSection} onValueChange={handleTabChange} className="w-full">
                        <TabsList className="h-auto bg-transparent p-0 gap-0 justify-start w-full overflow-x-auto">
                            {sections.map((section) => (
                                <TabsTrigger
                                    key={section.id}
                                    value={section.id}
                                    className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground transition-colors"
                                >
                                    {section.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Tabs value={activeSection} onValueChange={handleTabChange} className="w-full">
                        <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Left Sidebar */}
                                    <div className="w-full lg:w-80 shrink-0">
                                        <div className="bg-card rounded-lg border border-border p-6">
                                            {/* Profile Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-16 w-16">
                                                        <AvatarFallback className="bg-amber-100 text-amber-800 text-lg font-semibold">
                                                            {getInitials()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h2 className="text-lg font-semibold text-foreground">
                                                            {client ? `${client.surname} ${client.otherNames}` : 'Your Name'}
                                                        </h2>
                                                        <p className="text-sm text-muted-foreground">
                                                            #{client?.id?.slice(-8).toUpperCase() || 'NEW USER'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button type="button" className="text-muted-foreground hover:text-foreground">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </button>
                                            </div>

                                            {/* About Section */}
                                            <SidebarSection title="About">
                                                <InfoRow icon={Phone} label="Phone" value={client?.phoneMobile} />
                                                <InfoRow icon={Mail} label="Email" value={client?.emailPersonal || client?.emailOfficial} />
                                            </SidebarSection>

                                            {/* Address Section */}
                                            <SidebarSection title="Address">
                                                <InfoRow
                                                    icon={MapPin}
                                                    label="Address"
                                                    value={address ? `${address.residentialAddress || ''}${address.building ? `, ${address.building}` : ''}`.trim() || 'Not provided' : 'Not provided'}
                                                />
                                                <InfoRow
                                                    icon={Building2}
                                                    label="City"
                                                    value={address?.townCity}
                                                />
                                                <InfoRow
                                                    icon={MapPin}
                                                    label="Postcode"
                                                    value={address?.postalCode}
                                                />
                                            </SidebarSection>

                                            {/* Personal Details Section */}
                                            <SidebarSection title="Personal Details">
                                                <InfoRow icon={Calendar} label="Date of birth" value={formatDate(client?.dateOfBirth as string)} />
                                                <InfoRow icon={User} label="National ID" value={client?.idPassportNo} />
                                                <InfoRow icon={User} label="Nationality" value={client?.nationality} />
                                                <InfoRow icon={User} label="Marital Status" value={client?.maritalStatus} />
                                            </SidebarSection>
                                        </div>
                                    </div>

                                    {/* Right Main Content */}
                                    <div className="flex-1 space-y-6">
                                        {/* Employment Information Table */}
                                        <div className="bg-card rounded-lg border border-border">
                                            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                                                <h3 className="text-base font-semibold text-foreground">Employment Information</h3>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        dispatch(setActiveSection('employment'))
                                                        dispatch(setIsEditing(true))
                                                    }}
                                                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                    Add Info
                                                </button>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                            <th className="px-6 py-3">Employer</th>
                                                            <th className="px-6 py-3">Position</th>
                                                            <th className="px-6 py-3">Department</th>
                                                            <th className="px-6 py-3">Date Joined</th>
                                                            <th className="px-6 py-3">Location</th>
                                                            <th className="px-6 py-3 w-10"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border">
                                                        {employment ? (
                                                            <tr className="text-sm">
                                                                <td className="px-6 py-4 text-foreground font-medium">{employment.employerName}</td>
                                                                <td className="px-6 py-4 text-foreground">{employment.jobTitle}</td>
                                                                <td className="px-6 py-4 text-foreground">{employment.department || '-'}</td>
                                                                <td className="px-6 py-4 text-foreground">{formatDate(employment.dateJoined as string) || '-'}</td>
                                                                <td className="px-6 py-4 text-foreground">{employment.branchLocation || '-'}</td>
                                                                <td className="px-6 py-4">
                                                                    <button type="button" className="text-muted-foreground hover:text-foreground">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground text-sm">
                                                                    No employment information added yet
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Bottom Row - Referees and Bank Details */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Referees */}
                                            <div className="bg-card rounded-lg border border-border">
                                                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                                                    <h3 className="text-base font-semibold text-foreground">Referees</h3>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            dispatch(setActiveSection('referees'))
                                                            dispatch(setIsEditing(true))
                                                        }}
                                                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                                                    >
                                                        View all
                                                    </button>
                                                </div>
                                                <div className="p-6 space-y-4">
                                                    {referees.length > 0 ? (
                                                        referees.slice(0, 3).map((referee) => (
                                                            <div key={referee.id} className="flex items-center gap-3">
                                                                <Avatar className="h-10 w-10">
                                                                    <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                                                                        {`${referee.surname?.charAt(0) || ''}${referee.otherNames?.charAt(0) || ''}`}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-foreground">
                                                                        {referee.surname} {referee.otherNames}
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {referee.relationship} - {referee.phoneMobile}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground text-center py-4">
                                                            No referees added yet
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Bank Details */}
                                            <div className="bg-card rounded-lg border border-border">
                                                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                                                    <h3 className="text-base font-semibold text-foreground">Bank Details</h3>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            dispatch(setActiveSection('bank'))
                                                            dispatch(setIsEditing(true))
                                                        }}
                                                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                                                    >
                                                        View all
                                                    </button>
                                                </div>
                                                <div className="p-6 space-y-4">
                                                    {bankDetails ? (
                                                        <div className="space-y-3">
                                                            <div>
                                                                <p className="text-lg font-semibold text-foreground">{bankDetails.bankName}</p>
                                                                <p className="text-sm text-muted-foreground">{bankDetails.branch}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Account Name</p>
                                                                <p className="text-sm font-medium text-foreground">{bankDetails.accountName}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Account Number</p>
                                                                <p className="text-sm font-medium text-foreground">{bankDetails.accountNumber}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground text-center py-4">
                                                            No bank details added yet
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </TabsContent>

                        {/* Personal Tab */}
                        <TabsContent value="personal" className="mt-0 focus-visible:outline-none">
                            <motion.div
                                key="personal"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="bg-card rounded-lg border border-border p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
                                            <p className="text-sm text-muted-foreground mt-1">Your basic personal details</p>
                                        </div>
                                        {!isEditing && (
                                            <Button variant="outline" size="sm" onClick={handleEditClick}>
                                                <Edit2 className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                        )}
                                    </div>
                                    <PersonalInfoForm client={client as Client} />    
                                </div>
                            </motion.div>
                        </TabsContent>

                        {/* Address Tab */}
                        <TabsContent value="address" className="mt-0 focus-visible:outline-none">
                            <motion.div
                                key="address"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="bg-card rounded-lg border border-border p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-lg font-semibold text-foreground">Address Information</h2>
                                            <p className="text-sm text-muted-foreground mt-1">Your residential and postal addresses</p>
                                        </div>
                                        {!isEditing && (
                                            <Button variant="outline" size="sm" onClick={handleEditClick}>
                                                <Edit2 className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                        )}
                                    </div>
                                    <AddressForm />
                                </div>
                            </motion.div>
                        </TabsContent>

                        {/* Employment Tab */}
                        <TabsContent value="employment" className="mt-0 focus-visible:outline-none">
                            <motion.div
                                key="employment"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="bg-card rounded-lg border border-border p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-lg font-semibold text-foreground">Employment Details</h2>
                                            <p className="text-sm text-muted-foreground mt-1">Your current employment information</p>
                                        </div>
                                        {!isEditing && (
                                            <Button variant="outline" size="sm" onClick={handleEditClick}>
                                                <Edit2 className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                        )}
                                    </div>
                                    <EmploymentForm />
                                </div>
                            </motion.div>
                        </TabsContent>

                        {/* Referees Tab */}
                        <TabsContent value="referees" className="mt-0 focus-visible:outline-none">
                            <motion.div
                                key="referees"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="bg-card rounded-lg border border-border p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-lg font-semibold text-foreground">Referees & Next of Kin</h2>
                                            <p className="text-sm text-muted-foreground mt-1">People who can vouch for you</p>
                                        </div>
                                        {!isEditing && (
                                            <Button variant="outline" size="sm" onClick={handleEditClick}>
                                                <Edit2 className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                        )}
                                    </div>
                                    <RefereeForm />
                                </div>
                            </motion.div>
                        </TabsContent>

                        {/* Bank Details Tab */}
                        <TabsContent value="bank" className="mt-0 focus-visible:outline-none">
                            <motion.div
                                key="bank"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="bg-card rounded-lg border border-border p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-lg font-semibold text-foreground">Bank Details</h2>
                                            <p className="text-sm text-muted-foreground mt-1">Your bank account for disbursements</p>
                                        </div>
                                        {!isEditing && (
                                            <Button variant="outline" size="sm" onClick={handleEditClick}>
                                                <Edit2 className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                        )}
                                    </div>
                                    <BankDetailsForm />
                                </div>
                            </motion.div>
                        </TabsContent>
                 
                </Tabs>
            </div>
        </div>
    )
}
