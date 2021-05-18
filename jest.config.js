module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: './results',
  setupFilesAfterEnv: ['./tests/jest.setup.ts'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './results',
        outputName: 'junit.xml',
      },
    ],
  ],
};
