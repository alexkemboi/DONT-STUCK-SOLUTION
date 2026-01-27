import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DateRange {
  from: string | null;
  to: string | null;
}

interface FiltersState {
  loans: {
    status: string;
    search: string;
    dateRange: DateRange;
  };
  clients: {
    status: string;
    search: string;
  };
  disbursements: {
    method: string;
    dateRange: DateRange;
  };
  investors: {
    search: string;
  };
  recovery: {
    status: string;
    agentId: string;
  };
}

const initialState: FiltersState = {
  loans: {
    status: "all",
    search: "",
    dateRange: { from: null, to: null },
  },
  clients: {
    status: "all",
    search: "",
  },
  disbursements: {
    method: "all",
    dateRange: { from: null, to: null },
  },
  investors: {
    search: "",
  },
  recovery: {
    status: "all",
    agentId: "all",
  },
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setLoanFilters: (
      state,
      action: PayloadAction<Partial<FiltersState["loans"]>>
    ) => {
      state.loans = { ...state.loans, ...action.payload };
    },
    setClientFilters: (
      state,
      action: PayloadAction<Partial<FiltersState["clients"]>>
    ) => {
      state.clients = { ...state.clients, ...action.payload };
    },
    setDisbursementFilters: (
      state,
      action: PayloadAction<Partial<FiltersState["disbursements"]>>
    ) => {
      state.disbursements = { ...state.disbursements, ...action.payload };
    },
    setInvestorFilters: (
      state,
      action: PayloadAction<Partial<FiltersState["investors"]>>
    ) => {
      state.investors = { ...state.investors, ...action.payload };
    },
    setRecoveryFilters: (
      state,
      action: PayloadAction<Partial<FiltersState["recovery"]>>
    ) => {
      state.recovery = { ...state.recovery, ...action.payload };
    },
    resetAllFilters: () => initialState,
  },
});

export const {
  setLoanFilters,
  setClientFilters,
  setDisbursementFilters,
  setInvestorFilters,
  setRecoveryFilters,
  resetAllFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
