import React, { useState } from "react";
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { Slot } from "expo-router";

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'mulish-regular': require('@/assets/fonts/mulish-regular.ttf'),
      'mulish-bold': require('@/assets/fonts/mulish-bold.ttf'),
    });
    setIsReady(true);
  };

  if (!isReady) {
    return <AppLoading startAsync={loadFonts} onFinish={() => setIsReady(true)} />;
  }

  return (
  <Slot />
 );
};

export default App;