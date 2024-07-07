import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface RegistrationState {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface RegistrationPayload {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

const initialState: RegistrationState = {
  username: '',
  email: '',
  password: '',
  confirm_password: '',
  status: 'idle',
  error: null,
};

export const registerUser = createAsyncThunk(
  'registration/registerUser',
  async (userData: RegistrationPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        confirm_password: userData.confirm_password,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setFullName: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setConfirmPassword: (state, action: PayloadAction<string>) => {
      state.confirm_password = action.payload;
    },
    reset: (state) => {
      state.username = '';
      state.email = '';
      state.password = '';
      state.confirm_password = '';
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setFullName, setEmail, setPassword, setConfirmPassword, reset } = registrationSlice.actions;

export default registrationSlice.reducer;
