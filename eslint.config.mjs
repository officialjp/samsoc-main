import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
	eslint.configs.recommended,
	tseslint.configs.recommended,
	globalIgnores([
		'node_modules/',
		'node_modules/*', // ignore its content
		'.next/',
		'.next/*',
		'next-env.d.ts',
	]),
);
