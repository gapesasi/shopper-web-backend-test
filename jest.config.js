/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testPathIgnorePatterns: [
      "/node_modules/"
    ]
  };
  