import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/ui-slice";
import filtersReducer from "./slices/filters-slice";
import authReducer from "./slices/auth-slice";
import clientReducer from "./slices/client-slice"; // Import the new client slice

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      filters: filtersReducer,
      auth: authReducer,
      client: clientReducer, // Add the client reducer
    },
    devTools: process.env.NODE_ENV !== "production",
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
