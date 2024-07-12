import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import registrationReducer from "../redux/RegistrationSlice";
import loginReducer from "../redux/LoginSlice";
import profileReducer from "../redux/ProfileSlice";
import authReducer from "../redux/authSlice";
import journalEntriesReducer from "../redux/JournalEntrySlice";

const store = configureStore({
  reducer: {
    registration: registrationReducer,
    login: loginReducer,
    profile: profileReducer,
    auth: authReducer,
    entries: journalEntriesReducer,
  },
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
