export default {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageProvider: "v8",
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
};
