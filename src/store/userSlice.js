import { createSlice } from "@reduxjs/toolkit";


const initialState={
    userInfo:{}
}


const userSlice = createSlice({
    name:'user',
    initialState,

    reducers:{
        login:(state,action)=>{
            state.userInfo=action.payload
        },
    }
  
})


export const{login} = userSlice.actions;
export default userSlice.reducer