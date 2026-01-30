import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
    Client,
    ClientAddress,
    EmploymentDetail,
    Referee,
    BankDetail,
    FullProfile
} from '@/lib/types'

interface ProfileState {
    client: Client | null
    address: ClientAddress | null
    employment: EmploymentDetail | null
    referees: Referee[]
    bankDetails: BankDetail | null
    isLoading: boolean
    isEditing: boolean
    activeSection: 'overview' | 'personal' | 'address' | 'employment' | 'referees' | 'bank'
}

const initialState: ProfileState = {
    client: null,
    address: null,
    employment: null,
    referees: [],
    bankDetails: null,
    isLoading: false,
    isEditing: false,
    activeSection: 'personal',
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<FullProfile>) => {
            state.client = action.payload.client
            state.address = action.payload.address
            state.employment = action.payload.employment
            state.referees = action.payload.referees
            state.bankDetails = action.payload.bankDetails
        },
        setClient: (state, action: PayloadAction<Client>) => {
            console.log('Setting client in profile slice:', action.payload);
            state.client = action.payload
        },
        setAddress: (state, action: PayloadAction<ClientAddress>) => {
            state.address = action.payload
        },
        setEmployment: (state, action: PayloadAction<EmploymentDetail>) => {
            state.employment = action.payload
        },
        setReferees: (state, action: PayloadAction<Referee[]>) => {
            state.referees = action.payload
        },
        addReferee: (state, action: PayloadAction<Referee>) => {
            state.referees.push(action.payload)
        },
        updateReferee: (state, action: PayloadAction<Referee>) => {
            const index = state.referees.findIndex(r => r.id === action.payload.id)
            if (index !== -1) {
                state.referees[index] = action.payload
            }
        },
        removeReferee: (state, action: PayloadAction<string>) => {
            state.referees = state.referees.filter(r => r.id !== action.payload)
        },
        setBankDetails: (state, action: PayloadAction<BankDetail>) => {
            state.bankDetails = action.payload
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setIsEditing: (state, action: PayloadAction<boolean>) => {
            state.isEditing = action.payload
        },
        setActiveSection: (state, action: PayloadAction<ProfileState['activeSection']>) => {
            state.activeSection = action.payload
        },
        resetProfile: () => initialState,
    },
})

export const {
    setProfile,
    setClient,
    setAddress,
    setEmployment,
    setReferees,
    addReferee,
    updateReferee,
    removeReferee,
    setBankDetails,
    setIsLoading,
    setIsEditing,
    setActiveSection,
    resetProfile,
} = profileSlice.actions

export default profileSlice.reducer
