export default {
  displayName: 'HimalayanWheels Backend Tests',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'models/**/*.js',
    'controllers/**/*.js',
    'routes/**/*.js',
    '!node_modules/**',
  ],
  testMatch: ['**/__tests__/**/*.test.js'],
  bail: 0,
  verbose: true,
  testTimeout: 10000,
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
