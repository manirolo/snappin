import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ['react', 'react-dom', 'react/jsx-runtime']
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react/jsx-runtime']
    }
  }),
  dev: {
    server: {
      port: 3001
    }
  },
  manifest: {
    name: "Snappin",
    permissions: ['storage', "tabs", "scripting", 'cookies'],
    host_permissions: ["<all_urls>"],
    // Clerk needs this for OAuth popup
    externally_connectable: {
      matches: ['https://*.clerk.accounts.dev/*', 'https://*.snappinapp.com/*']
    }
  }
});
