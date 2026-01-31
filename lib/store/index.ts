import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/ui-slice";
import filtersReducer from "./slices/filters-slice";
import authReducer from "./slices/auth-slice";
import clientReducer from "./slices/client-slice";
import profileReducer from "./slices/profile-slice";
import loanApplicationReducer from "./slices/loan-application-slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      filters: filtersReducer,
      auth: authReducer,
      client: clientReducer,
      profile: profileReducer,
      loanApplication: loanApplicationReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
