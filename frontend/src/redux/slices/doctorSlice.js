import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

const initialState = {
  doctor: null,
  loading: false,
  error: null,
};

// Thunk: Fetch or create doctor profile
export const fetchDoctorProfile = createAsyncThunk('doctor/fetchProfile', async (_, { getState }) => {
  const state = getState();
  const userId = state.auth.user.id;

  try {
    // Try GET first
    const response = await api.get('/doctors/my-profile');  // Assume backend endpoint
    console.log(response.data);
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      // Create if not found
      const createResponse = await api.post('/doctors', {
        bio: 'New doctor profile. Please update your details.',
        specializations: ['General Physician'],
        experience: 0,
        consultationFee: 100,
      });
      return createResponse.data;
    }
    throw err;
  }
});


export const fetchDoctorStats = createAsyncThunk(
  'doctor/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/doctors/stats'); // 👈 IMPORTANT URL
      console.log(res)
      return res.data;
    } catch (err) {
      console.log(err)
      return rejectWithValue(err.response?.data || 'Error');
    }
  }
);

const doctorSlice = createSlice({
  name: 'doctor',
  initialState: {
    stats: {
      totalAppointments: 0,
      todaysAppointments: 0,
      totalPatients: 0,
      monthlyEarnings: 0,
    },
    statsLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.doctor = action.payload;
      })
      .addCase(fetchDoctorStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctorStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDoctorStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      });
  },
});

export default doctorSlice.reducer;