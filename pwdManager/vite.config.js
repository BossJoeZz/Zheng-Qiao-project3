import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()], server: {
        proxy: {
            '/api': {
                target: 'http://47.116.119.15:8000/', changeOrigin: true,
            }
        }
    }
})
