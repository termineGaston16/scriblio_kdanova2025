import { configureStore } from "@reduxjs/toolkit";
import alertMessageSlice from "../slice/alertMessageSlice";

export const store = configureStore({
    reducer: {
        alertMessage: alertMessageSlice
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

