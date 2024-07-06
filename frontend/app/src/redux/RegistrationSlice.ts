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