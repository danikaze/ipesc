const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  setupFilesAfterEnv: ['@alex_neo/jest-expect-message', '<rootDir>/jest/mocks.ts'],

  testMatch: ['**/*.(test|spec).(ts|tsx)'],
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
  collectCoverageFrom: [
    '<rootDir>/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!<rootDir>/webpack/**/*',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/webpack.config.ts'],
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: '<rootDir>/' }),
  },

  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        babelConfig: true,
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/'],
};
