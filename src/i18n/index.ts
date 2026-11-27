import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'
import type { LocaleCode } from '@/types/tool'

/** 本地存储中保存用户语言偏好的键名 */
export const LOCALE_STORAGE_KEY = 'candy-tool-locale'

/**
 * 读取初始语言设置，默认返回简体中文 (zh-CN)
 */
export function getInitialLocale(): LocaleCode {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (saved === 'zh-CN' || saved === 'en-US') {
      return saved
    }
  } catch {
    // 忽略无痕模式或服务端渲染环境下的 localStorage 访问异常
  }
  return 'zh-CN'
}

/**
 * 创建全局 vue-i18n 实例
 * 使用 Composition API 模式 (legacy: false)，默认语言为中文
 */
export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
})
