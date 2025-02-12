module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.js"],
  testTimeout: 30000,
  testMatch: ["**/*.test.js"],
  transform: {
      "^.+\\.js$": "babel-jest"
  },
  transformIgnorePatterns: [],
  moduleNameMapper: {
      "camunda-external-task-client-js": "<rootDir>/node_modules/camunda-external-task-client-js"
  },
  injectGlobals: true
};
