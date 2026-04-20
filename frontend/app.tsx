import React, { useState, useEffect, useLayoutEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { Provider, useSelector, useDispatch } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./app/src/screens/HomeScreen";
import LoginScreen from "./app/src/screens/LoginScreen";
import RegisterScreen from "./app/src/screens/RegistrationScreen";
import ProfileScreen from "./app/src/screens/ProfileScreen";
import ForgotPasswordScreen from "./app/src/screens/ForgotPasswordScreen";
import store, { RootState } from "./app/src/redux/store";
import { loadToken } from "./app/src/redux/authSlice";
import JournalEntryScreen from "./app/src/screens/JournalEntryScreen";
import SummaryScreen from "./app/src/screens/SummaryScreen";
import LoadingScreen from "./app/src/components/LoadingScreen";
import FallbackComponent from "./app/src/components/FallbackComponent";
import { useFonts } from "expo-font";

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth?.token);
  const status = useSelector((state: RootState) => state.auth?.status);

  useLayoutEffect(() => {
    dispatch(loadToken());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded" && !token) {
      // User logged out, stay on Login or Home
    }
  }, [status, token]);

  const initialRoute = token ? "Home" : "Login";

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Summary" component={SummaryScreen} />
      <Stack.Screen name="JournalEntry" component={JournalEntryScreen} />
      <Stack.Screen name="Fallback" component={FallbackComponent} />
      <Stack.Screen
        name="NotFound"
        component={FallbackComponent}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [fontsLoaded] = useFonts({
    "Mulish-Black": require("./assets/fonts/Mulish-Black.ttf"),
    "Mulish-Bold": require("./assets/fonts/Mulish-Bold.ttf"),
    "Mulish-Regular": require("./assets/fonts/Mulish-Regular.ttf"),
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        /* empty */
      } finally {
        setLoading(false);
        SplashScreen.hideAsync();
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || loading) {
    return <LoadingScreen />;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
