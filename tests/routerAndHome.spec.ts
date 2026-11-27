import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { i18n } from '@/i18n'
import { router } from '@/router'
import { TOOLS } from '@/config/tools'
import HomeView from '@/views/HomeView.vue'

describe('首页渲染与路由配置集成测试', () => {
  beforeEach(async () => {
    window.scrollTo = () => {}
    localStorage.clear()
    setActivePinia(createPinia())
    i18n.global.locale.value = 'zh-CN'
    await router.push('/')
    await router.isReady()
  })

  it('首页默认显示中文标题与全部工具卡片', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [i18n, router],
      },
    })
    expect(wrapper.text()).toContain('多彩糖果')
    expect(wrapper.text()).toContain('工具矩阵')
    expect(wrapper.text()).toContain('Base64 编解码')
    expect(wrapper.text()).toContain('Mermaid 图表编辑器')
  })

  it('切换到英文后首页文案动态变为英文', async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [i18n, router],
      },
    })
    i18n.global.locale.value = 'en-US'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Sweet Candy')
    expect(wrapper.text()).toContain('Tool Matrix')
  })

  it('注册的 10 个核心工具均存在于路由表中', () => {
    expect(TOOLS).toHaveLength(10)
    const routePaths = router.getRoutes().map((r) => r.path)
    for (const tool of TOOLS) {
      expect(routePaths).toContain(tool.path)
    }
  })
})
