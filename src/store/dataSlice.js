import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    socialTasks: [],
    premiumTasks: [],
    userdetails:{},
}

const dataSlice = createSlice({
    name: 'tasks',
    initialState,

    reducers: {
        setSocialTasks: (state, action) => {
            state.socialTasks = action.payload
        },
        setPremiumTasks: (state, action) => {
            state.premiumTasks = action.payload
        },
        setdetail:(state,action)=>{
            state.userdetails=action.payload
        },
        
        
    }
})



export const { setSocialTasks, setPremiumTasks ,setdetail} = dataSlice.actions;

export default dataSlice.reducer;