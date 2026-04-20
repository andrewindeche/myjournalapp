module.exports = {
  testEnvironment: "./environment",
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
 setupFilesAfterEnv: ["./setup.ts"],
  apps: {
    "debug.build": {
      type: "android",
      binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
      build: "npx expo run:android --variant=debug",
      launchArgs: ["--no-livereload", "--no-verify-cache"],
    },
    "release.build": {
      type: "android",
      binaryPath: "android/app/build/outputs/apk/release/app-release.apk",
      build: "npx expo run:android --variant=release",
      launchArgs: [],
    },
  },
  devices: {
    simulator: {
      type: "android",
      device: {
        apiLevel: 34,
        model: "Pixel 8",
        platform: "android",
      },
    },
  },
  configurations: {
    "android.debug": {
      device: "simulator",
      app: "debug.build",
    },
    "android.release": {
      device: "simulator",
      app: "release.build",
    },
  },
};