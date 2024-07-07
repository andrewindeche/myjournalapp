import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface RegistrationState {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    successMessage: string | null;
  }

  const initialState: RegistrationState = {
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    status: 'idle',
    error: null,
    successMessage: null,
  };
  
  const API_URL = 'http://127.0.0.1:8000/api/register/';

  export const registerUser = createAsyncThunk(
    'registration/registerUser',
    async (userData: { username: string; email: string; password: string; confirm_password: string }, thunkAPI) => {
      try {
        const response = await axios.post(API_URL, userData);
        return response.data; 
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data); 
      }
    }
  );

  const registrationSlice = createSlice({
    name: 'registration',
    initialState,
    reducers: {
      setUserName: (state, action: PayloadAction<string>) => {
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
      setSuccessMessage: (state, action: PayloadAction<string>) => {
        state.successMessage = action.payload;
      },
      setError: (state, action: PayloadAction<string>) => {
        state.error = action.payload;
      },
      reset: (state) => {
        state.username = '';
        state.email = '';
        state.password = '';
        state.confirm_password = '';
        state.status = 'idle';
        state.error = null;
        state.successMessage = null;
      },
    },
    extraReducers: (builder) => {
        builder
          .addCase(registerUser.pending, (state) => {
            state.status = 'loading';
            state.error = null;
            state.successMessage = null;
          })
          .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
            state.status = 'succeeded';
            state.successMessage = 'Successfully created account';
            state.error = null;
          })
          .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
            state.status = 'failed';
            state.error = action.payload as string;
          });
      },
    });

    export const {
      setUserName,
      setEmail,
      setPassword,
      setConfirmPassword,
      setSuccessMessage,
      setError,
      reset,
    } = registrationSlice.actions;

    export default registrationSlice.reducer;
    