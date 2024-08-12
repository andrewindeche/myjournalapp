const config = {
  testRunner: "jest",
  runnerConfig: "e2e/jest.config.js",
  configurations: {
    "ios.simulator": {
      type: "ios.simulator",
      device: {
        type: "iPhone 11",
      },
    },
    "android.emulator": {
      type: "android.emulator",
      device: {
        avdName: "Pixel_3a_API_30_x86",
      },
    },
  },
};

export default config;
