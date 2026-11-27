import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAppStore } from '@/stores/app'

describe('全局状态管理 useAppStore 测试', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('默认语言为简体中文，并支持切换中英文', () => {
    const store = useAppStore()
    expect(store.locale).toBe('zh-CN')

    store.toggleLocale()
    expect(store.locale).toBe('en-US')

    store.setLocale('zh-CN')
    expect(store.locale).toBe('zh-CN')
  })

  it('支持切换日间、夜间与跟随系统主题模式', () => {
    const store = useAppStore()
    store.setThemeMode('dark')
    expect(store.themeMode).toBe('dark')
    expect(store.isDark).toBe(true)

    store.setThemeMode('light')
    expect(store.themeMode).toBe('light')
    expect(store.isDark).toBe(false)

    store.cycleThemeMode()
    expect(store.themeMode).toBe('dark')
  })

  it('支持收藏工具与记录最近使用工具（上限 5 条）', () => {
    const store = useAppStore()
    store.toggleFavorite('json')
    expect(store.isFavorite('json')).toBe(true)
    store.toggleFavorite('json')
    expect(store.isFavorite('json')).toBe(false)

    ;['base64', 'url', 'json', 'html', 'sql', 'regex'].forEach((id) => {
      store.recordRecentTool(id)
    })
    expect(store.recentTools).toEqual(['regex', 'sql', 'html', 'json', 'url'])
  })
})
