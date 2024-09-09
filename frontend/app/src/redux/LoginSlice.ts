import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { setToken } from "./authSlice";

interface LoginState {
  username: string;
  password: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: LoginState = {
  username: "",
  password: "",
  status: "idle",
  error: null,
};

export const loginUser = createAsyncThunk(
  "login/loginUser",
  async (
    { username, password }: { username: string; password: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password,
      });
      const token = response.data.access;
      dispatch(setToken(token));
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue("Please enter correct credentials.");
      } else {
        return rejectWithValue("Login failed. Please try again.");
      }
    }
  },
);

export const googleLogin = createAsyncThunk(
  "login/googleLogin",
  async (idToken: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/google-login/",
        {
          id_token: idToken,
        },
      );
      const token = response.data.access;
      dispatch(setToken(token));
      return response.data;
    } catch (error: any) {
      return rejectWithValue("Google login failed. Please try again.");
    }
  },
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },

    logout: (state) => {
      state.username = "";
      state.password = "";
      state.status = "idle";
      state.error = null;
    },

    reset: (state) => {
      state.username = "";
      state.password = "";
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setUsername, setPassword, logout, reset } = loginSlice.actions;

export default loginSlice.reducer;
