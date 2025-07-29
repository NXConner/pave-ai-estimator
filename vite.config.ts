import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    open: true, // Auto-open browser in development
    hmr: {
      overlay: true
    }
  },
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // JSX runtime optimization
      jsxImportSource: "@emotion/react"
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Target modern browsers for smaller bundle size
    target: "es2020",
    // Enable source maps for production debugging
    sourcemap: mode === 'development',
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for third-party libraries
          vendor: [
            'react',
            'react-dom',
            'react-router-dom'
          ],
          // UI components chunk
          ui: [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-button',
            '@radix-ui/react-card',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
          ],
          // Maps and external services
          maps: [
            '@googlemaps/js-api-loader',
            'leaflet',
            'react-leaflet'
          ],
          // Supabase and data
          data: [
            '@supabase/supabase-js',
            '@tanstack/react-query'
          ],
          // Charts and visualization
          charts: [
            'recharts',
            'embla-carousel-react'
          ],
          // Utilities
          utils: [
            'date-fns',
            'zod',
            'clsx',
            'class-variance-authority',
            'tailwind-merge'
          ]
        },
        // Optimize asset file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    // Asset optimization
    assetsInlineLimit: 4096, // 4kb
    cssCodeSplit: true,
    // Report compressed size
    reportCompressedSize: true,
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    // Pre-bundle dependencies for faster dev server startup
    include: [
      'react',
      'react-dom',
      '@googlemaps/js-api-loader',
      '@supabase/supabase-js',
      '@tanstack/react-query',
      'recharts',
      'date-fns'
    ],
    exclude: [
      '@huggingface/transformers' // Large ML library - load on demand
    ]
  },
  // CSS optimization
  css: {
    devSourcemap: mode === 'development',
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  // Enable tree shaking
  esbuild: {
    treeShaking: true,
    legalComments: 'none'
  },
  // Preview server configuration
  preview: {
    port: 3000,
    open: true
  }
}));
