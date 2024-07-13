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
    successMessage : null,
  };

  export const registerUser = createAsyncThunk(
    'registration/registerUser',
    async (userData: { username: string; email: string; password: string; confirm_password: string; }, { rejectWithValue }) => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/register/', {
          username: userData.username,
          email: userData.email,
          password: userData.password,
          confirm_password: userData.confirm_password,
        });
        return response.data;
      } catch (error: any) {
        if (error.response.status === 400) {
          return rejectWithValue("Please enter valid credentials");
        }
        return rejectWithValue(error.response.data.errors || "An unknown error occurred.");
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
      },
    },
    extraReducers: (builder) => {
        builder
          .addCase(registerUser.pending, (state) => {
            state.status = 'loading';
            state.error = null;
            state.successMessage = null;
          })
          .addCase(registerUser.fulfilled, (state) => {
            state.status = 'succeeded';
            state.error = null;
            state.successMessage = "Successfully created account."; 
          })
          .addCase(registerUser.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
            state.successMessage = null;
          });
      },
    });

    export const { setFullName, setEmail, setPassword,setConfirmPassword, reset } = registrationSlice.actions;

    export default registrationSlice.reducer;