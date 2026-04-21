import axios from "axios";
import { getToken, setToken } from "./tokenManager";
import { API_URL } from "./apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "./store";
import { logout } from "./authSlice";

const instance = axios.create({
  baseURL: `${API_URL}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleUnauthorized = async () => {
  setToken(null);
  try {
    await AsyncStorage.removeItem("authToken");
  } catch {}
  store.dispatch(logout());
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
};

instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data && config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const retryResponse = await instance(originalRequest);
          return retryResponse;
        } catch {
          await handleUnauthorized();
          return Promise.reject(error);
        }
      }
      await handleUnauthorized();
    }
    return Promise.reject(error);
  },
);

export default instance;
