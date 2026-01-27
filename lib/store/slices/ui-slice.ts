import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  type: string | null;
  data: unknown;
}

interface UIState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  modal: ModalState;
  selectedRows: string[];
  isLoading: boolean;
}

const initialState: UIState = {
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
  selectedRows: [],
  isLoading: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleMobileSidebar: (state) => {
      state.sidebarMobileOpen = !state.sidebarMobileOpen;
    },
    setMobileSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarMobileOpen = action.payload;
    },
    openModal: (state, action: PayloadAction<{ type: string; data?: unknown }>) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data ?? null,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null,
      };
    },
    setSelectedRows: (state, action: PayloadAction<string[]>) => {
      state.selectedRows = action.payload;
    },
    clearSelectedRows: (state) => {
      state.selectedRows = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleMobileSidebar,
  setMobileSidebarOpen,
  openModal,
  closeModal,
  setSelectedRows,
  clearSelectedRows,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
