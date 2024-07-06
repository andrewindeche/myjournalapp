import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface RegistrationState {
    fullName: string;
    email: string;
    password: string;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }

  const initialState: RegistrationState = {
    fullName: '',
    email: '',
    password: '',
    status: 'idle',
    error: null,
  };

  export const registerUser = createAsyncThunk(
    'registration/registerUser',
    async (userData: { fullName: string; email: string; password: string }, { rejectWithValue }) => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/register/', {
          username: userData.fullName,
          email: userData.email,
          password: userData.password,
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
        state.fullName = action.payload;
      },
      setEmail: (state, action: PayloadAction<string>) => {
        state.email = action.payload;
      },
      setPassword: (state, action: PayloadAction<string>) => {
        state.password = action.payload;
      },
      reset: (state) => {
        state.fullName = '';
        state.email = '';
        state.password = '';
        state.status = 'idle';
        state.error = null;
      },
    },
    extraReducers: (builder) => {
        builder
          .addCase(registerUser.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(registerUser.fulfilled, (state) => {
            state.status = 'succeeded';
          })
          .addCase(registerUser.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
          });
      },
    });

    export const { setFullName, setEmail, setPassword, reset } = registrationSlice.actions;

    export default registrationSlice.reducer;