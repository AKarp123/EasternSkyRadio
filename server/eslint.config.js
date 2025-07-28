import { defineConfig } from 'eslint/config';
import parser from '@typescript-eslint/parser';
import unicorn from 'eslint-plugin-unicorn';
import typescript from '@typescript-eslint/eslint-plugin';
export default defineConfig([
    unicorn.configs.recommended,
	{
        files: ['**/*.ts'],

        plugins: {
            '@typescript-eslint': typescript,
        },
        rules: {
            'camelcase': 'off',
            'indent': ['error', 'tab'],
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
            
            
        },
		languageOptions: {
			parser,
            parserOptions: {
                project: './tsconfig.json',
            },
		},
	},
]);