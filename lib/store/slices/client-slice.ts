import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ClientProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  isProfileComplete: boolean;
}

interface LoanApplication {
  id: string;
  amount: number;
  purpose: string;
  status: "pending" | "approved" | "rejected" | "disbursed";
  dateApplied: string;
}

interface Disbursement {
  id: string;
  loanId: string;
  amount: number;
  date: string;
  status: "pending" | "completed" | "failed";
}

interface ClientState {
  profile: ClientProfile;
  loanApplications: LoanApplication[];
  disbursements: Disbursement[];
}

const initialState: ClientState = {
  profile: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    address: "123 Main St",
    city: "Anytown",
    country: "USA",
    zipCode: "12345",
    isProfileComplete: false, // Will be updated by profile form
  },
  loanApplications: [
    {
      id: "loan-1",
      amount: 5000,
      purpose: "Business Expansion",
      status: "approved",
      dateApplied: "2023-01-15",
    },
    {
      id: "loan-2",
      amount: 2000,
      purpose: "Personal Emergency",
      status: "pending",
      dateApplied: "2023-03-01",
    },
  ],
  disbursements: [
    {
      id: "dis-1",
      loanId: "loan-1",
      amount: 5000,
      date: "2023-01-20",
      status: "completed",
    },
  ],
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<ClientProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
      // Simple logic to check if profile is complete for dummy data
      state.profile.isProfileComplete = !!(
        state.profile.firstName &&
        state.profile.lastName &&
        state.profile.email &&
        state.profile.phone &&
        state.profile.address &&
        state.profile.city &&
        state.profile.country &&
        state.profile.zipCode
      );
    },
    addLoanApplication: (state, action: PayloadAction<LoanApplication>) => {
      state.loanApplications.push(action.payload);
    },
    updateLoanApplicationStatus: (
      state,
      action: PayloadAction<{ id: string; status: LoanApplication["status"] }>
    ) => {
      const index = state.loanApplications.findIndex(
        (loan) => loan.id === action.payload.id
      );
      if (index !== -1) {
        state.loanApplications[index].status = action.payload.status;
      }
    },
    addDisbursement: (state, action: PayloadAction<Disbursement>) => {
      state.disbursements.push(action.payload);
    },
  },
});

export const {
  updateProfile,
  addLoanApplication,
  updateLoanApplicationStatus,
  addDisbursement,
} = clientSlice.actions;

export default clientSlice.reducer;

