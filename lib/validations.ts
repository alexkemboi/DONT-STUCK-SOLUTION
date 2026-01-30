import * as Yup from 'yup'

export const personalInfoSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    surname: Yup.string().required('Surname is required').min(2, 'Surname must be at least 2 characters'),
    otherNames: Yup.string().required('Other names are required').min(2, 'Must be at least 2 characters'),
    dateOfBirth: Yup.string().required('Date of birth is required'),
    maritalStatus: Yup.string().required('Marital status is required'),
    nationality: Yup.string().required('Nationality is required'),
    dependents: Yup.number().min(0, 'Cannot be negative').required('Number of dependents is required'),
    idPassportNo: Yup.string().required('ID/Passport number is required'),
    kraPin: Yup.string(),
    phoneWork: Yup.string(),
    phoneMobile: Yup.string().required('Mobile phone is required').matches(/^[0-9+]+$/, 'Invalid phone number'),
    phoneAlternative: Yup.string(),
    emailPersonal: Yup.string().email('Invalid email format'),
    emailOfficial: Yup.string().email('Invalid email format'),
})

export const addressSchema = Yup.object({
    postalAddress: Yup.string(),
    postalCode: Yup.string(),
    townCity: Yup.string().required('Town/City is required'),
    residentialAddress: Yup.string(),
    location: Yup.string(),
    estate: Yup.string(),
    building: Yup.string(),
    houseNumber: Yup.string(),
    landmark: Yup.string(),
})

export const employmentSchema = Yup.object({
    employerName: Yup.string().required('Employer name is required'),
    jobTitle: Yup.string().required('Job title is required'),
    department: Yup.string(),
    dateJoined: Yup.string(),
    periodWorked: Yup.string(),
    employmentType: Yup.string().required('Employment type is required'),
    contractExpiry: Yup.string(),
    onNotice: Yup.boolean(),
    netSalary: Yup.number().required('Net salary is required').positive('Salary must be positive'),
    branchLocation: Yup.string(),
    roadStreet: Yup.string(),
    building: Yup.string(),
    floorOffice: Yup.string(),
    telephone: Yup.string(),
})

export const refereeSchema = Yup.object({
    surname: Yup.string().required('Surname is required'),
    otherNames: Yup.string().required('Other names are required'),
    relationship: Yup.string().required('Relationship is required'),
    idPassportNo: Yup.string(),
    employerName: Yup.string(),
    locationStation: Yup.string(),
    phoneWork: Yup.string(),
    phoneMobile: Yup.string().required('Mobile phone is required').matches(/^[0-9+]+$/, 'Invalid phone number'),
    isRelative: Yup.boolean(),
})

export const bankDetailSchema = Yup.object({
    bankName: Yup.string().required('Bank name is required'),
    branch: Yup.string().required('Branch is required'),
    accountName: Yup.string().required('Account name is required'),
    accountNumber: Yup.string().required('Account number is required'),
    proofDocumentUrl: Yup.string().url('Invalid URL format'),
})

export const loanApplicationSchema = Yup.object({
    purpose: Yup.string().required('Loan purpose is required').min(10, 'Please provide more details'),
    amountRequested: Yup.number()
        .required('Amount is required')
        .positive('Amount must be positive')
        .min(1000, 'Minimum loan amount is 1,000'),
    repaymentPeriod: Yup.number()
        .required('Repayment period is required')
        .min(1, 'Minimum period is 1 month')
        .max(60, 'Maximum period is 60 months'),
})
