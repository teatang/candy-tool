import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { usePreferredDark } from '@vueuse/core'
import { i18n, LOCALE_STORAGE_KEY } from '@/i18n'
import type { LocaleCode, ThemeMode } from '@/types/tool'

/** 主题模式持久化存储键名 */
const THEME_STORAGE_KEY = 'candy-tool-theme'
/** 收藏工具列表存储键名 */
const FAVORITES_STORAGE_KEY = 'candy-tool-favorites'
/** 最近使用工具列表存储键名 */
const RECENT_STORAGE_KEY = 'candy-tool-recent'

/**
 * 全局应用状态 Store (Pinia)
 * 负责管理：
 * 1. 日间 / 夜间 / 跟随系统 主题模式切换及 DOM class 同步
 * 2. 中英文国际化语言切换
 * 3. 桌面端侧边栏折叠状态与移动端抽屉菜单开关
 * 4. 搜索关键词、收藏工具与最近使用记录
 * 5. 全局轻量 Toast 提示消息
 */
export const useAppStore = defineStore('app', () => {
  // 系统暗黑模式响应式监听
  const prefersDark = usePreferredDark()

  // 当前选择的主题模式，默认跟随系统
  const themeMode = ref<ThemeMode>(loadInitialTheme())

  // 当前语言，默认简体中文
  const locale = ref<LocaleCode>(i18n.global.locale.value as LocaleCode)

  // 桌面端左侧边栏是否收起
  const sidebarCollapsed = ref(false)

  // 移动端抽屉侧边栏是否打开
  const mobileMenuOpen = ref(false)

  // 工具搜索关键词
  const searchQuery = ref('')

  // 收藏的工具 ID 列表
  const favorites = ref<string[]>(loadStringArray(FAVORITES_STORAGE_KEY))

  // 最近使用的工具 ID 列表（最多保留 5 个）
  const recentTools = ref<string[]>(loadStringArray(RECENT_STORAGE_KEY))

  // 全局 Toast 消息提示状态
  const toastMessage = ref<{ id: number; text: string; type: 'success' | 'error' } | null>(null)
  let toastTimer: ReturnType<typeof setTimeout> | null = null

  /**
   * 实际生效的暗黑状态（综合用户设置与系统偏好）
   */
  const isDark = computed(() => {
    if (themeMode.value === 'dark') return true
    if (themeMode.value === 'light') return false
    return prefersDark.value
  })

  /**
   * 监听实际暗黑状态变化，同步更新 html 根元素上的 .dark 类名与 color-scheme
   */
  watch(
    isDark,
    (dark) => {
      if (typeof document !== 'undefined') {
        const root = document.documentElement
        root.classList.toggle('dark', dark)
        root.style.colorScheme = dark ? 'dark' : 'light'
      }
    },
    { immediate: true },
  )

  /**
   * 切换主题模式
   *
   * @param mode - 目标主题：light | dark | system
   */
  function setThemeMode(mode: ThemeMode) {
    themeMode.value = mode
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode)
    } catch {
      // 忽略存储异常
    }
  }

  /**
   * 循环切换主题：日间 -> 夜间 -> 跟随系统
   */
  function cycleThemeMode() {
    const order: ThemeMode[] = ['light', 'dark', 'system']
    const nextIndex = (order.indexOf(themeMode.value) + 1) % order.length
    setThemeMode(order[nextIndex])
  }

  /**
   * 切换界面语言并持久化
   *
   * @param nextLocale - 目标语言代码
   */
  function setLocale(nextLocale: LocaleCode) {
    locale.value = nextLocale
    i18n.global.locale.value = nextLocale
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale)
      if (typeof document !== 'undefined') {
        document.documentElement.lang = nextLocale
      }
    } catch {
      // 忽略存储异常
    }
  }

  /**
   * 在中英文之间快速切换
   */
  function toggleLocale() {
    setLocale(locale.value === 'zh-CN' ? 'en-US' : 'zh-CN')
  }

  /**
   * 切换桌面端侧边栏展开/收起状态
   */
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  /**
   * 控制移动端抽屉菜单开关
   */
  function setMobileMenuOpen(open: boolean) {
    mobileMenuOpen.value = open
  }

  /**
   * 收藏或取消收藏某个工具
   *
   * @param toolId - 工具 ID
   */
  function toggleFavorite(toolId: string) {
    const idx = favorites.value.indexOf(toolId)
    if (idx >= 0) {
      favorites.value.splice(idx, 1)
    } else {
      favorites.value.unshift(toolId)
    }
    saveStringArray(FAVORITES_STORAGE_KEY, favorites.value)
  }

  /**
   * 检查工具是否已收藏
   */
  function isFavorite(toolId: string): boolean {
    return favorites.value.includes(toolId)
  }

  /**
   * 记录最近访问的工具
   *
   * @param toolId - 工具 ID
   */
  function recordRecentTool(toolId: string) {
    const filtered = recentTools.value.filter((id) => id !== toolId)
    recentTools.value = [toolId, ...filtered].slice(0, 5)
    saveStringArray(RECENT_STORAGE_KEY, recentTools.value)
  }

  /**
   * 显示全局顶部/右下角 Toast 提示
   *
   * @param text - 提示文本
   * @param type - 提示类型：success | error
   */
  function showToast(text: string, type: 'success' | 'error' = 'success') {
    if (toastTimer) clearTimeout(toastTimer)
    toastMessage.value = { id: Date.now(), text, type }
    toastTimer = setTimeout(() => {
      toastMessage.value = null
    }, 2400)
  }

  return {
    themeMode,
    isDark,
    locale,
    sidebarCollapsed,
    mobileMenuOpen,
    searchQuery,
    favorites,
    recentTools,
    toastMessage,
    setThemeMode,
    cycleThemeMode,
    setLocale,
    toggleLocale,
    toggleSidebar,
    setMobileMenuOpen,
    toggleFavorite,
    isFavorite,
    recordRecentTool,
    showToast,
  }
})

/**
 * 从本地存储加载主题设置，默认为跟随系统
 */
function loadInitialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved
    }
  } catch {
    // 忽略异常
  }
  return 'system'
}

/**
 * 从 localStorage 安全读取字符串数组
 */
function loadStringArray(key: string): string[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : []
  } catch {
    return []
  }
}

/**
 * 安全写入字符串数组到 localStorage
 */
function saveStringArray(key: string, value: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 忽略异常
  }
}
