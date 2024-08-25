import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import instance, { setAuthToken } from "../redux/axiosInstance";

interface ProfileState {
  username: string;
  email: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProfileState = {
  username: "",
  email: "",
  status: "idle",
  error: null,
};

export const fetchProfileInfo = createAsyncThunk<
  ProfileState,
  void,
  { rejectValue: string; state: RootState }
>("profile/fetchProfileInfo", async (_, { rejectWithValue, getState }) => {
  const state = getState() as RootState;
  const token = state.auth.token;
  setAuthToken(token);
  try {
    const response = await instance.get("profile/");
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      return rejectWithValue("Unauthorized. Failed to fetch Profile");
    }
    return rejectWithValue("Failed to fetch Profile.");
  }
});

export const deleteUserAccount = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("profile/deleteUserAccount", async (_, { rejectWithValue, getState }) => {
  const state: RootState = getState() as RootState;
  const token = state.auth.token;
  setAuthToken(token);
  try {
    await instance.delete("profile/delete/");
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updateUsername = createAsyncThunk<ProfileState, string>(
  "profile/updateUsername",
  async (newUsername: string, { rejectWithValue, getState }) => {
    const state: RootState = getState() as RootState;
    const token = state.auth.token;
    setAuthToken(token);
    try {
      const response = await instance.patch("profile/", {
        username: newUsername,
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue("Unauthorized. Error updating username.");
      }
      return rejectWithValue("Error updating username.");
    }
  },
);

export const updatePassword = createAsyncThunk<
  { message: string },
  { old_password: string; new_password: string; confirm_new_password: string },
  { rejectValue: string }
>(
  "profile/updatePassword",
  async (
    { old_password, new_password, confirm_new_password },
    { rejectWithValue, getState },
  ) => {
    const state: RootState = getState() as RootState;
    const token = state.auth.token;
    setAuthToken(token);
    try {
      const response = await instance.put("password-change/", {
        old_password,
        new_password,
        confirm_new_password,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfileState(state) {
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileInfo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfileInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.error = null;
      })
      .addCase(fetchProfileInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateUsername.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUsername.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.username = action.payload.username;
        state.error = null;
      })
      .addCase(updateUsername.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updatePassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(
        updatePassword.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "Failed to update password";
        },
      )
      .addCase(deleteUserAccount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.status = "succeeded";
        state.username = "";
        state.email = "";
        state.error = null;
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetProfileState } = profileSlice.actions;

export default profileSlice.reducer;
