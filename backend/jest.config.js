module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.spec.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/swagger.json',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  testTimeout: 10000,
  setupFilesAfterEnv: ['./jest.setup.js']
};
