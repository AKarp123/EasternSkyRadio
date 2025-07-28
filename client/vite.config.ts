import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	return {
		plugins: [
			react(),
			svgr(),
			eslint({
				include: ['src/**/*.{ts,tsx}', 'vite.config.*'],
				exclude: ['node_modules', 'dist', 'public'],
			}),
		],
		build: {
			sourcemap: true,
		},
		server: {
			proxy: {
				"/api": {
					target: process.env.API_URL || "http://localhost:3000",
					changeOrigin: true,
					secure: false,
					ws: true,
				},
			},
			open: true,
		},
	};
});
