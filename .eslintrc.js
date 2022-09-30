module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime'
    ],
    settings: {
        react: {
            version: 'detect'
        }
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['tsconfig.json'],
    },
    ignorePatterns: ['node_modules', 'build', 'dist', 'coverage', 'public', 'src/setupTests.js'],
    root: true,
};