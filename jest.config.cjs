module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: [
        './indexer',
        './postgraphile',
    ],
    // exclude: [
    //     'frontend'
    // ],
    moduleDirectories: [
        'node_modules',
        'indexer',
        'postgraphile',
    ],
    testPathIgnorePatterns: ["<rootDir>/frontend"]
};
