module.exports = {
  preset: "react-native",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./e2e/setup.js"],
  testPathIgnorePatterns: ["/node_modules/", "/e2e/"],
};
