import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        target: 'es2020',
        sourcemap: process.env.NODE_ENV !== 'production',
        // Optimize chunk splitting for better caching
        rollupOptions: {
            output: {
                manualChunks: {
                    // Vendor chunks for better caching
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'leaflet-vendor': ['leaflet', 'react-leaflet'],
                },
            },
        },
        // Increase chunk size warning limit (default is 500kb)
        chunkSizeWarningLimit: 600,
        // Use esbuild for minification (faster and more reliable than terser)
        minify: 'esbuild',
    },
    // Esbuild options for production
    esbuild: {
        drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
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
