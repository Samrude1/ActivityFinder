import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, './src'),
        },
    },
    build: {
        target: 'es2020',
        sourcemap: process.env.NODE_ENV !== 'production',
        // Optimize chunk splitting for better caching
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                            return 'react-vendor';
                        }
                        if (id.includes('leaflet') || id.includes('react-leaflet')) {
                            return 'leaflet-vendor';
                        }
                        return 'vendor';
                    }
                },
            },
        },
    },
    // Preview server configuration
    preview: {
        port: 4173,
        strictPort: false,
    },
    // Development server configuration
    server: {
        port: 5173,
        strictPort: false,
        host: true, // Listen on all addresses
    },
})
