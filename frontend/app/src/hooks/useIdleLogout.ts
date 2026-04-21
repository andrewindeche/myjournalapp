import { useEffect, useRef, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

export const useIdleLogout = (timeoutMs: number = IDLE_TIMEOUT_MS) => {
  const dispatch = useDispatch();
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isIdle = useRef(false);

  const clearIdleTimer = useCallback(() => {
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
  }, []);

  const handleLogout = useCallback(async () => {
    clearIdleTimer();
    isIdle.current = true;
    try {
      await AsyncStorage.removeItem("authToken");
    } catch {}
    dispatch(logout());
  }, [dispatch, clearIdleTimer]);

  const resetIdleTimer = useCallback(() => {
    clearIdleTimer();
    isIdle.current = false;
    if (appState.current === "active") {
      idleTimer.current = setTimeout(handleLogout, timeoutMs);
    }
  }, [clearIdleTimer, handleLogout, timeoutMs]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        resetIdleTimer();
      } else if (appState.current === "active" && nextAppState.match(/inactive|background/)) {
        clearIdleTimer();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    resetIdleTimer();

    return () => {
      clearIdleTimer();
      subscription.remove();
    };
  }, [clearIdleTimer, resetIdleTimer]);

  useEffect(() => {
    const interactionEvents = ["touchStart", "touchEnd", "scroll", "press", "keyPress"];

    const onInteraction = () => {
      if (appState.current === "active") {
        resetIdleTimer();
      }
    };

    interactionEvents.forEach((event) => {
      const listener = () => onInteraction();
      if (event.includes("key")) {
        /* keyboard events if needed */
      }
    });

    return () => {};
  }, [resetIdleTimer]);

  return { resetIdleTimer, isIdle: isIdle.current };
};