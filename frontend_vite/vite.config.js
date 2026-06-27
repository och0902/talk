import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react()],
   server: {
      // port: 3000,
      port: 4500,
      proxy: {
         '/api': {
            target: 'http://localhost:4510',
            // target: 'http://talk.ystory52.com:4510',
         },
      },
   },
})
