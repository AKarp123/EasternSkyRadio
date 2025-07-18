import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    return {
        plugins: [
            react(),
            svgr(),
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
