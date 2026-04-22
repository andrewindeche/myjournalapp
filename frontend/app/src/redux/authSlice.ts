import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { setToken as setTokenInManager } from "./tokenManager";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isDarkMode: boolean;
}

const initialState: AuthState = {
  token: null,
  status: "idle",
  error: null,
  isDarkMode: false,
};

export const loadTheme = createAsyncThunk("auth/loadTheme", async () => {
  const theme = await AsyncStorage.getItem("isDarkMode");
  return theme === "true";
});

export const loadToken = createAsyncThunk("auth/loadToken", async () => {
  const savedToken = await AsyncStorage.getItem("authToken");
  return savedToken;
});

export const saveTheme = createAsyncThunk(
  "auth/saveTheme",
  async (isDarkMode: boolean) => {
    await AsyncStorage.setItem("isDarkMode", String(isDarkMode));
    return isDarkMode;
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.status = "succeeded";
      setTokenInManager(action.payload);
    },
    logout(state) {
      state.token = null;
      state.status = "idle";
      state.error = null;
      setTokenInManager(null);
    },
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.isDarkMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTheme.fulfilled, (state, action) => {
        state.isDarkMode = action.payload;
      })
      .addCase(saveTheme.fulfilled, (state, action) => {
        state.isDarkMode = action.payload;
      })
      .addCase(loadToken.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload;
          state.status = "succeeded";
        }
      });
  },
});

export const { setToken, logout, setDarkMode } = authSlice.actions;

export default authSlice.reducer;