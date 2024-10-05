import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    socialTasks: [],
    premiumTasks: [],
   
}

const dataSlice = createSlice({
    name: 'data',
    initialState,

    reducers: {
        setSocialTasks: (state, action) => {
            state.socialTasks = action.payload
        },
        setPremiumTasks: (state, action) => {
            state.premiumTasks = action.payload
        },
        
    }
})



export const { setSocialTasks, setPremiumTasks } = dataSlice.actions;

export default dataSlice.reducer;