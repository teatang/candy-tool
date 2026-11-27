import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { i18n } from '@/i18n'

/**
 * 糖果工具路由配置表
 * 所有工具页面均采用路由懒加载以优化首屏体积与加载速度
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  // 编码工具
  {
    path: '/tools/base64',
    name: 'base64',
    meta: { toolId: 'base64' },
    component: () => import('@/views/tools/Base64ToolView.vue'),
  },
  {
    path: '/tools/url',
    name: 'url',
    meta: { toolId: 'url' },
    component: () => import('@/views/tools/UrlToolView.vue'),
  },
  {
    path: '/tools/json',
    name: 'json',
    meta: { toolId: 'json' },
    component: () => import('@/views/tools/JsonToolView.vue'),
  },
  {
    path: '/tools/html',
    name: 'html',
    meta: { toolId: 'html' },
    component: () => import('@/views/tools/HtmlToolView.vue'),
  },
  {
    path: '/tools/sql',
    name: 'sql',
    meta: { toolId: 'sql' },
    component: () => import('@/views/tools/SqlToolView.vue'),
  },
  // 字符串工具
  {
    path: '/tools/regex',
    name: 'regex',
    meta: { toolId: 'regex' },
    component: () => import('@/views/tools/RegexToolView.vue'),
  },
  {
    path: '/tools/mermaid',
    name: 'mermaid',
    meta: { toolId: 'mermaid' },
    component: () => import('@/views/tools/MermaidToolView.vue'),
  },
  // 开发工具
  {
    path: '/tools/timestamp',
    name: 'timestamp',
    meta: { toolId: 'timestamp' },
    component: () => import('@/views/tools/TimestampToolView.vue'),
  },
  {
    path: '/tools/uuid',
    name: 'uuid',
    meta: { toolId: 'uuid' },
    component: () => import('@/views/tools/UuidToolView.vue'),
  },
  {
    path: '/tools/crypto',
    name: 'crypto',
    meta: { toolId: 'crypto' },
    component: () => import('@/views/tools/CryptoToolView.vue'),
  },
  // 兜底重定向回首页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

/**
 * 全局后置路由守卫：
 * 1. 更新浏览器标签页标题
 * 2. 自动记录最近使用工具
 */
router.afterEach((to) => {
  const toolId = to.meta?.toolId as string | undefined
  const t = i18n.global.t

  if (typeof document !== 'undefined') {
    if (toolId) {
      document.title = `${t(`tools.${toolId}.name`)} - ${t('app.name')}`
    } else {
      document.title = `${t('app.name')} - ${t('app.enName')}`
    }
  }

  if (toolId) {
    try {
      const store = useAppStore()
      store.recordRecentTool(toolId)
    } catch {
      // Pinia 尚未挂载时忽略
    }
  }
})
