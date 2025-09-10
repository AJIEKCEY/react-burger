import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite';

export default defineConfig({
	e2e: {
		baseUrl: 'http://localhost:5173/react-burger/',
		viewportWidth: 1280,
		viewportHeight: 1000,
		setupNodeEvents(on) {
			// implement node event listeners here
			on('file:preprocessor', vitePreprocessor());
		},
	},

	component: {
		devServer: {
			framework: 'react',
			bundler: 'vite',
		},
	},
});
