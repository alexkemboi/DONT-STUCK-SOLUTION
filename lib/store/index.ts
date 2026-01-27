import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/ui-slice";
import filtersReducer from "./slices/filters-slice";
import authReducer from "./slices/auth-slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      filters: filtersReducer,
      auth: authReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
