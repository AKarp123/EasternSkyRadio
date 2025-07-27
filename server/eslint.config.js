import { defineConfig } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';
import parser from '@typescript-eslint/parser';
export default defineConfig([
	{
        files: ['**/*.ts'],
		plugins: {
			"@stylistic": stylistic,
		},
		rules: {
			camelcase: 'off',
			'@typescript-eslint/naming-convention': 'off',
			indent: ['error', 'tab'],
			'no-await-in-loop': 'off',
			'@stylistic/object-curly-spacing': ['error', 'always'],
			'no-console': ['warn', { allow: ['warn', 'error'] }],

		},
		languageOptions: {
			parser,
            parserOptions: {
                project: './tsconfig.json',
            },
		},
	},
]);