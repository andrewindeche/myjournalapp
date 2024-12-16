import React, { useState, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./app/src/screens/HomeScreen";
import LoginScreen from "./app/src/screens/LoginScreen";
import RegisterScreen from "./app/src/screens/RegistrationScreen";
import ProfileScreen from "./app/src/screens/ProfileScreen";
import store from "./app/src/redux/store";
import JournalEntryScreen from "./app/src/screens/JournalEntryScreen";
import SummaryScreen from "./app/src/screens/SummaryScreen";
import LoadingScreen from "./app/src/components/LoadingScreen";
import FallbackComponent from "./app/src/components/FallbackComponent";
import { useFonts } from "expo-font";

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [fontsLoaded] = useFonts({
    "Mulish-Black": require("./assets/fonts/Mulish-Black.ttf"),
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
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
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
      </NavigationContainer>
    </Provider>
  );
};

export default App;
