module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coveragePathIgnorePatterns: ['\\.module\\.ts', '<rootDir>/main.ts'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  setupFiles: ['../jest-setup.js'],
};
