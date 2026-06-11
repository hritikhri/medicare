import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import appointmentReducer from './slices/appointmentSlice.js';
import userReducer from './slices/userSlice.js';
import doctotReducer from './slices/doctorSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    appointments: appointmentReducer,
    user: userReducer,
    doctor: doctotReducer,
  },
}); 
