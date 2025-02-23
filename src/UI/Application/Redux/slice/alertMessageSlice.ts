import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Estado inicial
const initialState = null as string | null;

const alertMessageSlice = createSlice({
    name: 'alertMessage',
    initialState,
    reducers: {
        cleanMessage: (): null => null,
        addMessage: (_state, action: PayloadAction<string>): string => action.payload
    }
})

export const { cleanMessage, addMessage } = alertMessageSlice.actions;
export default alertMessageSlice.reducer;