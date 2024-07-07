import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ProfileState {
    username: string;
    email: string;
    profileImage: string;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }

  const initialState: ProfileState = {
    username: '',
    email: '',
    profileImage: '',
    status: 'idle',
    error: null,
  };

  export const fetchProfileInfo = createAsyncThunk(
    'profile/fetchProfileInfo',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/profile/'); 
        return response.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );