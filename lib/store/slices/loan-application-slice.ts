import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GuarantorEntry {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  idNumber: string;
  relationship: string;
}

interface LoanApplicationState {
  currentStep: number;
  loanDetails: {
    purpose: string;
    amountRequested: number;
    repaymentPeriod: number;
  };
  guarantors: GuarantorEntry[];
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;
  submittedLoanId: string | null;
}

const initialState: LoanApplicationState = {
  currentStep: 0,
  loanDetails: {
    purpose: "",
    amountRequested: 0,
    repaymentPeriod: 1,
  },
  guarantors: [],
  isSubmitting: false,
  submitSuccess: false,
  submitError: null,
  submittedLoanId: null,
};

const loanApplicationSlice = createSlice({
  name: "loanApplication",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < 2) {
        state.currentStep += 1;
      }
    },
    prevStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    },
    setLoanDetails: (
      state,
      action: PayloadAction<LoanApplicationState["loanDetails"]>
    ) => {
      state.loanDetails = action.payload;
    },
    addGuarantor: (state, action: PayloadAction<GuarantorEntry>) => {
      state.guarantors.push(action.payload);
    },
    updateGuarantor: (state, action: PayloadAction<GuarantorEntry>) => {
      const index = state.guarantors.findIndex(
        (g) => g.id === action.payload.id
      );
      if (index !== -1) {
        state.guarantors[index] = action.payload;
      }
    },
    removeGuarantor: (state, action: PayloadAction<string>) => {
      state.guarantors = state.guarantors.filter(
        (g) => g.id !== action.payload
      );
    },
    setIsSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setSubmitSuccess: (
      state,
      action: PayloadAction<{ loanId: string }>
    ) => {
      state.submitSuccess = true;
      state.submittedLoanId = action.payload.loanId;
      state.submitError = null;
      state.isSubmitting = false;
    },
    setSubmitError: (state, action: PayloadAction<string>) => {
      state.submitError = action.payload;
      state.isSubmitting = false;
    },
    resetLoanApplication: () => initialState,
  },
});

export const {
  setCurrentStep,
  nextStep,
  prevStep,
  setLoanDetails,
  addGuarantor,
  updateGuarantor,
  removeGuarantor,
  setIsSubmitting,
  setSubmitSuccess,
  setSubmitError,
  resetLoanApplication,
} = loanApplicationSlice.actions;

export default loanApplicationSlice.reducer;
