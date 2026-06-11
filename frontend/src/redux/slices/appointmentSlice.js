import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

const initialState = {
  appointments: [],
  loading: false,
  error: null,
};

export const fetchAppointments = createAsyncThunk(
  'appointments/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/appointments');
      // Ensure we always return an array
      console.log(response.data)
      return Array.isArray(response.data.appointments) ? response.data.appointments : [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateStatus',
  async ({ id, status }) => {
    const response = await api.put(`/appointments/${id}/status`, { status });
    return response.data;
  }
);

export const updateAppointmentNotes = createAsyncThunk(
  'appointments/updateNotes',
  async ({ id, notes }) => {
    const response = await api.put(`/appointments/${id}/notes`, { notes });
    return response.data;
  }
);

// In extraReducers, handle fulfilled cases to update state optimistically

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => { state.loading = true; })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default appointmentSlice.reducer;