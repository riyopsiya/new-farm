import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice'
import dataReducer from './dataSlice'

const store=configureStore({
    reducer:{
        user:userReducer,
        tasks:dataReducer
    }
})


export default store;