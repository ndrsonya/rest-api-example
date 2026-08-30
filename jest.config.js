module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testMatch: ['**/?(*.)+(spec|test).ts'],
    testPathIgnorePatterns: ['/node_modules/', '\\.integration\\.test\\.ts$'],
};
