//  Configuración de Vite

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue'; // Importamos el plugin.
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true // Habilita el service worker en desarrollo
            },
            manifest: {
                name: 'RhinoFit',
                short_name: 'RhinoFit',
                description: 'Plataforma de entrenamiento personalizado',
                theme_color: '#00A3FF', // Color celeste de la app
                icons: [
                    {
                        src: '/icons/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/icons/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ],
                start_url: '/',
                display: 'standalone',
                background_color: '#000000'
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/firebasestorage\.googleapis\.com/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'firebase-storage',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 días
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/firestore\.googleapis\.com/,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'firestore-data',
                            networkTimeoutSeconds: 5,
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    }
                ]
            }
        })
    ],
    build: {
        target: 'es2015',
        cssCodeSplit: true,
        chunkSizeWarningLimit: 2000,
        rollupOptions: {
            output: {
                manualChunks: {
                    'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage']
                }
            }
        }
    },
    server: {
        historyApiFallback: true,
    },
    base: '/'
});