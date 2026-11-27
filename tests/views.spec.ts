import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { i18n } from '@/i18n'
import zhCN from '@/i18n/locales/zh-CN'
import enUS from '@/i18n/locales/en-US'
import Base64ToolView from '@/views/tools/Base64ToolView.vue'
import UrlToolView from '@/views/tools/UrlToolView.vue'
import JsonToolView from '@/views/tools/JsonToolView.vue'
import HtmlToolView from '@/views/tools/HtmlToolView.vue'
import SqlToolView from '@/views/tools/SqlToolView.vue'
import RegexToolView from '@/views/tools/RegexToolView.vue'
import TimestampToolView from '@/views/tools/TimestampToolView.vue'
import UuidToolView from '@/views/tools/UuidToolView.vue'
import CryptoToolView from '@/views/tools/CryptoToolView.vue'

/**
 * 递归收集语言包中所有叶子文案的键路径
 */
function collectLocaleKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = []
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      keys.push(...collectLocaleKeys(v as Record<string, unknown>, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

describe('i18n 文案编译与工具页面渲染回归测试', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('中英文语言包所有文案键均可正常编译无语法错误', () => {
    const zhKeys = collectLocaleKeys(zhCN as unknown as Record<string, unknown>)
    const enKeys = collectLocaleKeys(enUS as unknown as Record<string, unknown>)

    expect(zhKeys).toEqual(enKeys)

    for (const locale of ['zh-CN', 'en-US'] as const) {
      i18n.global.locale.value = locale
      for (const key of zhKeys) {
        const result = i18n.global.t(key, { n: 2, line: 1, col: 1, count: 3 })
        expect(typeof result).toBe('string')
        if (key !== 'home.heroTitleSuffix') {
          expect(result.length).toBeGreaterThan(0)
        }
      }
    }
  })

  it('UuidToolView 在中英文模式下均可正常渲染并正确显示花括号文案', async () => {
    i18n.global.locale.value = 'zh-CN'
    const wrapper = mount(UuidToolView, {
      global: { plugins: [i18n] },
    })
    expect(wrapper.text()).toContain('包裹花括号 ({})')

    i18n.global.locale.value = 'en-US'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Wrap in braces ({})')
  })

  it('所有常规工具视图组件均可无报错挂载渲染', () => {
    i18n.global.locale.value = 'zh-CN'
    const views = [
      Base64ToolView,
      UrlToolView,
      JsonToolView,
      HtmlToolView,
      SqlToolView,
      RegexToolView,
      TimestampToolView,
      UuidToolView,
      CryptoToolView,
    ]
    for (const ViewComponent of views) {
      const wrapper = mount(ViewComponent, {
        global: { plugins: [i18n] },
      })
      expect(wrapper.html().length).toBeGreaterThan(0)
      wrapper.unmount()
    }
  })
})
