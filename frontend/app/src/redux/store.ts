import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import registrationReducer from '../redux/RegistrationSlice';
import loginReducer from '../redux/LoginSlice';
import profileReducer from '../redux/ProfileSlice';
import authReducer from '../redux/AuthSlice';

const store = configureStore({
    reducer: {
      registration: registrationReducer,
      login: loginReducer,
      profile: profileReducer,
      auth: authReducer,
    },
  });
  
  setupListeners(store.dispatch);
  
  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;
  
  export default store;