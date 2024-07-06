import * as Font from 'expo-font';

const useCustomFonts = async () => {
  await Font.loadAsync({
    'mulish-regular': require('@/assets/fonts/Mulish-Regular.ttf'),
    'mulish-bold': require('@/assets/fonts/Mulish-Bold.ttf'),
  });
};

export default useCustomFonts;
