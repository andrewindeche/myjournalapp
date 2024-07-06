import React, { useState } from "react";
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

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
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  </NavigationContainer>
 );
};

export default App;