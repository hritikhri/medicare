import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk('user/fetchProfile', async () => {
  const response = await api.get('/users/fetch/profile'); // Assume endpoint
  return response.data;
});

export const updateProfile = createAsyncThunk('user/updateProfile', async (data) => {
  console.log(data)
  const response = await api.put('/users/update/profile', data);
  return response.data;
});

export const updateProfilePic= createAsyncThunk('user/updateProfilePic',async(data)=>{
  console.log(data)
  const response = await api.put('/user/update/profilepic',data);
  return response.data;
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export default userSlice.reducer;