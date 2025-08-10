import js from '@eslint/js'
import { defineConfig } from 'eslint/config';
import parser from '@typescript-eslint/parser';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import typescript from '@typescript-eslint/eslint-plugin';
import stylistic from "@stylistic/eslint-plugin"

export default defineConfig([

    eslintPluginUnicorn.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx'],
        ignores: ['**/node_modules/**', '**/dist/**'],
        languageOptions: {
            parser: parser,
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        plugins: {
                '@typescript-eslint': typescript,
                '@stylistic': stylistic
            },
        rules: {
            'camelcase': 'off',
            '@stylistic/indent': ['error', 'tab'],
            'no-await-in-loop': 'off',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'unicorn/filename-case': 'off',
            'unicorn/prevent-abbreviations': 'off',
            'unicorn/no-null': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error', {
                vars: 'all',
                args: 'after-used',
                ignoreRestSiblings: true
            }],
            'eqeqeq': ['error', 'always'],
        },
    },
    {
        files: ['vite.config.ts'],
        languageOptions: {
            parser: parser,
            parserOptions: {
                project: './tsconfig.node.json',
            },
        },
    }
  
])