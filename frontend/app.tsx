import React, { useState, useEffect  } from "react";
import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './app/src/screens/HomeScreen';
import LoginScreen from './app/src/screens/LoginScreen';
import ErrorBoundary from './app/src/screens/ErrorBoundary';
import RegisterScreen from './app/src/screens/RegistrationScreen'

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      try {
        await Font.loadAsync({
          'mulish-regular': require('@/assets/fonts/Mulish-Regular.ttf'),
          'mulish-bold': require('@/assets/fonts/Mulish-Bold.ttf'),
        });
      } catch (e) {
        console.error("Font loading error:", e);
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync(); // Hide splash screen once fonts are loaded
      }
    };

    loadResources();
  }, []);


  const loadFonts = async () => {
    await Font.loadAsync({
      'mulish-regular': require('@/assets/fonts/Mulish-Regular.ttf'),
      'mulish-bold': require('@/assets/fonts/Mulish-Bold.ttf'),
    });
    setIsReady(true);
  };

  const onError = (error: Error) => {
    console.error("AppLoading Error:", error);
  };

  if (!isReady) {
    return <AppLoading startAsync={loadFonts} onFinish={() => setIsReady(true)} onError={onError}/>;
  }

  return (
    <ErrorBoundary>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Login" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </ErrorBoundary>
  );
};

export default App;
