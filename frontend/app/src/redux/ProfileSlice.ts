import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';

interface ProfileState {
    username: string;
    email: string;
    profileImage: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }

  const initialState: ProfileState = {
    username: '',
    email: '',
    profileImage: null,
    status: 'idle',
    error: null,
  };

  export const fetchProfileInfo = createAsyncThunk<ProfileState,void,{ rejectValue: string, state: RootState }>(
    'profile/fetchProfileInfo',
    async (_, { rejectWithValue, getState }) => {
      const state = getState();
      const token = state.login.token;
      if (!token) {
        return rejectWithValue('Token not available');
      }
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });
        return response.data;
      } catch (error:any) {
        console.error('Fetch profile error:', error.response?.data || error.message);
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

  export const updateProfileImage = createAsyncThunk<ProfileState, FormData>(
    'profile/updateProfileImage',
    async (formData, { rejectWithValue, getState }) => {
      const state: RootState = getState() as RootState;
      const token = state.login.token;
      console.log('Updating profile image with token:', token);
      try {
        const response = await axios.patch('http://127.0.0.1:8000/api/profile/update/profile-image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

  export const updateUsername = createAsyncThunk<ProfileState, string>(
    'profile/updateUsername',
    async (newUsername: string, { rejectWithValue, getState }) => {
      const state: RootState = getState() as RootState;
      const token = state.login.token;
      console.log('Updating profile image with token:', token);
      try {
        const response = await axios.patch('http://127.0.0.1:8000/api/profile/update/username/', { username: newUsername }, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data;
      } catch (error:any) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

  export const updatePassword = createAsyncThunk<{ message: string },{ old_password: string, new_password: string },
  { rejectValue: string }>('profile/updatePassword',
async ({ old_password, new_password }, { rejectWithValue, getState }) => {
  const state: RootState = getState() as RootState;
  const token = state.login.token;
  console.log('Updating profile image with token:', token);
  try {
    const response = await axios.put('http://127.0.0.1:8000/api/password-change/', { old_password, new_password }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
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
          })
          .addCase(updateProfileImage.pending, (state) => {
            state.status = 'loading';
            state.error = null;
          })
          .addCase(updateProfileImage.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.profileImage = action.payload.profileImage;
            state.error = null;
          })
          .addCase(updateProfileImage.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
          })
          .addCase(updatePassword.pending, (state) => {
            state.status = 'loading';
            state.error = null;
          })
          .addCase(updatePassword.fulfilled, (state) => {
            state.status = 'succeeded';
            state.error = null;
          })
          .addCase(updatePassword.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
          });
      },
    });

    export const { resetProfileState } = profileSlice.actions;

export default profileSlice.reducer;