module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    extends: ['eslint:recommended', 'prettier'],
    parserOptions: {
        project: ['./tsconfig.json', './tests/tsconfig.test.json']
    },
    ignorePatterns: ['node_modules/'],
    rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        'import/prefer-default-export': 0,
        'import/no-cycle': 0,
        'no-restricted-syntax': [
            'error',
            {
                selector: 'ForInStatement',
                message:
                    'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.'
            },
            {
                selector: 'LabeledStatement',
                message:
                    'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.'
            },
            {
                selector: 'WithStatement',
                message:
                    '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.'
            }
        ],
        eqeqeq: ['error', 'always'],
        'no-constant-condition': 'off',
        'no-duplicate-imports': 'error',
        'no-undef': 0,
        'no-unreachable-loop': 'error',
        'sort-imports': 'error'
    }
};
