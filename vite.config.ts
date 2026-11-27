import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

/**
 * 根据环境变量 BASE_PATH 计算站点部署基础路径
 * - 本地开发或 Docker 根路径部署时默认使用 '/'
 * - GitHub Pages 子路径部署（如 BASE_PATH=candy-tool）时自动规范化为 '/candy-tool/'
 */
function resolveBasePath(): string {
  const raw = process.env.BASE_PATH?.trim()
  if (!raw || raw === '/') return '/'
  const trimmed = raw.replace(/^\/+|\/+$/g, '')
  return `/${trimmed}/`
}

/**
 * Vite 构建与开发服务器配置
 * 集成 Vue 3 与 Tailwind CSS v4 插件，并配置 @ 路径别名与动态 base 路径
 */
export default defineConfig({
  base: resolveBasePath(),
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
