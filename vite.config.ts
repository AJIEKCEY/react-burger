import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: 'react-burger/',
	build: {
		outDir: 'dist',
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@components': path.resolve(__dirname, './src/components'),
			'@services': path.resolve(__dirname, './src/services'),
			'@pages': path.resolve(__dirname, './src/pages'),
			'@utils': path.resolve(__dirname, './src/utils'),
			'@types': path.resolve(__dirname, './src/types'),
			'@hooks': path.resolve(__dirname, './src/hooks'),
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.js'],
	},
	server: {
		open: true,
	},
});
