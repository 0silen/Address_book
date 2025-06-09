import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // 🔑 导入 path 模块用于路径解析

// Vite 配置
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5109/',
        changeOrigin: true,
      }
    },
  },
  resolve: {
    alias: {

      '@': path.resolve(__dirname, './src'),
    },
  },
});