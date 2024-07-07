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

  export const updateUsername = createAsyncThunk(
    'profile/updateUsername',
    async (newUsername: string, { rejectWithValue }) => {
      try {
        const response = await axios.patch('http://127.0.0.1:8000/api/profile/update/username/', { username: newUsername });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
      resetProfileState(state) {
        state.status = 'idle';
        state.error = null;
      },
    },

    extraReducers: (builder) => {
        builder
          .addCase(fetchProfileInfo.pending, (state) => {
            state.status = 'loading';
            state.error = null;
          })
          .addCase(fetchProfileInfo.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.profileImage = action.payload.profileImage;
            state.error = null;
          })
          .addCase(fetchProfileInfo.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
          })
          .addCase(updateUsername.pending, (state) => {
            state.status = 'loading';
            state.error = null;
          })
          .addCase(updateUsername.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.username = action.payload.username;
            state.error = null;
          })
          .addCase(updateUsername.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
          });
      },
    });

    export const { resetProfileState } = profileSlice.actions;

export default profileSlice.reducer;