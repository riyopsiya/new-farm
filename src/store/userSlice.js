import { createSlice } from "@reduxjs/toolkit";


const initialState={
     //userInfo is telegram details of the user and userData is the data of user from appwrite
    userInfo:{},
    userData:{}
   
}


const userSlice = createSlice({
    name:'user',
    initialState,

    reducers:{
        login:(state,action)=>{
            state.userInfo=action.payload
        },
        setUserData:(state,action)=>{
            state.userData=action.payload
        },
     
      
    }
  
})


export const{login,setUserData} = userSlice.actions;
export default userSlice.reducer