<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  Languages,
  Menu,
  Monitor,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
} from 'lucide-vue-next'
import { useAppStore } from '@/stores/app'
import type { ThemeMode } from '@/types/tool'
import Button from '@/components/ui/button/Button.vue'

const { t } = useI18n()
const route = useRoute()
const appStore = useAppStore()

const currentTitle = computed(() => {
  const toolId = route.meta?.toolId as string | undefined
  if (toolId) {
    return t(`tools.${toolId}.name`)
  }
  return t('app.home')
})

const themeOptions: Array<{ mode: ThemeMode; icon: typeof Sun; labelKey: string }> = [
  { mode: 'light', icon: Sun, labelKey: 'theme.light' },
  { mode: 'dark', icon: Moon, labelKey: 'theme.dark' },
  { mode: 'system', icon: Monitor, labelKey: 'theme.system' },
]
</script>

<template>
  <!-- 顶部导航栏：侧边栏折叠控制、当前位置展示、日夜/系统主题切换与语言切换 -->
  <header
    class="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-background/75 px-4 backdrop-blur-xl sm:px-6"
  >
    <div class="flex items-center gap-3 min-w-0">
      <!-- 移动端抽屉触发按钮 -->
      <Button
        variant="ghost"
        size="icon-sm"
        class="lg:hidden"
        :aria-label="t('app.openMenu')"
        @click="appStore.setMobileMenuOpen(true)"
      >
        <Menu class="size-5" />
      </Button>

      <!-- 桌面端侧边栏展开/收起按钮 -->
      <Button
        variant="ghost"
        size="icon-sm"
        class="hidden lg:inline-flex"
        :title="appStore.sidebarCollapsed ? t('app.expandSidebar') : t('app.collapseSidebar')"
        @click="appStore.toggleSidebar()"
      >
        <PanelLeftOpen v-if="appStore.sidebarCollapsed" class="size-4" />
        <PanelLeftClose v-else class="size-4" />
      </Button>

      <div class="flex items-center gap-2 min-w-0">
        <span class="truncate text-sm font-semibold sm:text-base">
          {{ currentTitle }}
        </span>
      </div>
    </div>

    <div class="flex items-center gap-2 sm:gap-3">
      <!-- 日间 / 夜间 / 跟随系统 三态主题切换器 -->
      <div
        class="flex items-center rounded-xl border bg-muted/60 p-1"
        role="group"
        :aria-label="t('theme.label')"
      >
        <button
          v-for="opt in themeOptions"
          :key="opt.mode"
          type="button"
          :title="t(opt.labelKey)"
          :class="[
            'flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-all duration-200 cursor-pointer',
            appStore.themeMode === opt.mode
              ? 'bg-background text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground',
          ]"
          @click="appStore.setThemeMode(opt.mode)"
        >
          <component :is="opt.icon" class="size-3.5" />
          <span class="hidden md:inline">{{ t(opt.labelKey) }}</span>
        </button>
      </div>

      <!-- 中英文语言切换按钮 -->
      <Button
        variant="outline"
        size="sm"
        class="gap-1.5 rounded-xl px-2.5 sm:px-3"
        :title="t('locale.label')"
        @click="appStore.toggleLocale()"
      >
        <Languages class="size-4 text-primary" />
        <span class="text-xs font-semibold">
          {{ appStore.locale === 'zh-CN' ? '中文' : 'EN' }}
        </span>
      </Button>
    </div>
  </header>
</template>
