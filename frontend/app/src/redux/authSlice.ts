import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setToken as setTokenInManager } from "./tokenManager";

interface AuthState {
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      setTokenInManager(action.payload);
    },
    logout(state) {
      state.token = null;
      state.status = "idle";
      state.error = null;
      setTokenInManager(null);
    },
  },
});

export const { setToken, logout } = authSlice.actions;

export default authSlice.reducer;
