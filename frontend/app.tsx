import React, { useState } from "react";
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { Slot } from "expo-router";

const fetchFonts = async () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  await Font.loadAsync({
    'mulish-regular': require('./assets/fonts/Mulish-Regular.ttf'),
  });
};


const App: React.FC = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={(error) => console.error('Font loading error:', error)}
      />
    );
  }
  return (
  <Slot />;
 )
}

export default App;