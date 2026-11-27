<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  Candy,
  ChevronDown,
  Home,
  Search,
  Star,
  X,
} from 'lucide-vue-next'
import { TOOL_CATEGORIES, TOOLS, getToolById } from '@/config/tools'
import { useAppStore } from '@/stores/app'
import type { ToolCategoryId } from '@/types/tool'
import ToolIcon from '@/components/common/ToolIcon.vue'
import Input from '@/components/ui/input/Input.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const searchInputRef = ref<InstanceType<typeof Input> | null>(null)

/** 记录每个分类的展开/折叠状态，默认全部展开 */
const expandedCategories = ref<Record<ToolCategoryId, boolean>>({
  encoding: true,
  string: true,
  dev: true,
})

function toggleCategory(catId: ToolCategoryId) {
  expandedCategories.value[catId] = !expandedCategories.value[catId]
}

/** 根据搜索关键词过滤后的工具列表 */
const filteredTools = computed(() => {
  const q = appStore.searchQuery.trim().toLowerCase()
  if (!q) return TOOLS

  return TOOLS.filter((tool) => {
    const name = t(`tools.${tool.id}.name`).toLowerCase()
    const desc = t(`tools.${tool.id}.shortDesc`).toLowerCase()
    const matchKeyword = tool.keywords.some((kw) => kw.toLowerCase().includes(q))
    return name.includes(q) || desc.includes(q) || matchKeyword || tool.id.includes(q)
  })
})

/** 按分类分组后的工具结果 */
const categorizedTools = computed(() => {
  return TOOL_CATEGORIES.map((category) => ({
    ...category,
    tools: filteredTools.value.filter((tool) => tool.category === category.id),
  })).filter((group) => group.tools.length > 0)
})

/** 已收藏的工具元数据列表 */
const favoriteTools = computed(() => {
  return appStore.favorites
    .map((id) => getToolById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
})

/** 导航到指定路径，并在移动端自动关闭抽屉 */
function navigateTo(path: string) {
  router.push(path)
  appStore.setMobileMenuOpen(false)
}

/** 快捷键 Ctrl/Cmd + K 聚焦侧边栏搜索框 */
function handleKeyDown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    if (appStore.sidebarCollapsed) {
      appStore.toggleSidebar()
    }
    const el = searchInputRef.value?.$el as HTMLInputElement | undefined
    el?.focus()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <!-- 移动端半透明遮罩层 -->
  <Transition name="page-fade">
    <div
      v-if="appStore.mobileMenuOpen"
      class="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
      @click="appStore.setMobileMenuOpen(false)"
    />
  </Transition>

  <!-- 左侧边栏：桌面端支持折叠宽度，移动端为滑出式抽屉 -->
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl transition-all duration-300 ease-out lg:static lg:z-auto',
      appStore.mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      appStore.sidebarCollapsed ? 'lg:w-[76px]' : 'w-72',
    ]"
  >
    <!-- 顶部品牌 Logo 区域 -->
    <div class="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border px-4">
      <button
        type="button"
        class="group flex items-center gap-3 text-left cursor-pointer"
        @click="navigateTo('/')"
      >
        <div
          class="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 text-white shadow-md shadow-pink-500/20 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105"
        >
          <Candy class="size-5" />
        </div>
        <div v-if="!appStore.sidebarCollapsed" class="min-w-0">
          <div class="truncate text-base font-bold tracking-tight">
            {{ t('app.name') }}
          </div>
          <div class="truncate text-[11px] font-medium text-muted-foreground">
            {{ t('app.enName') }}
          </div>
        </div>
      </button>

      <!-- 移动端关闭抽屉按钮 -->
      <button
        type="button"
        class="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden cursor-pointer"
        @click="appStore.setMobileMenuOpen(false)"
      >
        <X class="size-5" />
      </button>
    </div>

    <!-- 搜索过滤输入框（收起侧边栏时隐藏） -->
    <div v-if="!appStore.sidebarCollapsed" class="px-3 pt-3 pb-2">
      <div class="relative">
        <Search class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref="searchInputRef"
          v-model="appStore.searchQuery"
          :placeholder="t('app.searchPlaceholder')"
          class="pl-9 pr-8 bg-background/70"
        />
        <button
          v-if="appStore.searchQuery"
          type="button"
          class="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
          @click="appStore.searchQuery = ''"
        >
          <X class="size-3.5" />
        </button>
      </div>
    </div>

    <!-- 侧边栏滚动导航区 -->
    <nav class="flex-1 space-y-4 overflow-y-auto px-3 py-3">
      <!-- 首页入口 -->
      <button
        type="button"
        :class="[
          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer',
          route.path === '/'
            ? 'bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-cyan-500/10 text-primary shadow-xs ring-1 ring-primary/25'
            : 'text-sidebar-foreground/80 hover:bg-accent/70 hover:text-foreground',
          appStore.sidebarCollapsed ? 'justify-center px-0' : '',
        ]"
        :title="t('app.home')"
        @click="navigateTo('/')"
      >
        <Home class="size-4 shrink-0" />
        <span v-if="!appStore.sidebarCollapsed">{{ t('app.home') }}</span>
      </button>

      <!-- 我的收藏快捷区 -->
      <div v-if="favoriteTools.length > 0 && !appStore.searchQuery" class="space-y-1">
        <div
          v-if="!appStore.sidebarCollapsed"
          class="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
        >
          <Star class="size-3.5 fill-amber-400 text-amber-400" />
          <span>{{ t('app.favorites') }}</span>
        </div>
        <button
          v-for="tool in favoriteTools"
          :key="`fav-${tool.id}`"
          type="button"
          :class="[
            'group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200 cursor-pointer',
            route.path === tool.path
              ? 'bg-primary/12 font-semibold text-primary ring-1 ring-primary/20'
              : 'text-sidebar-foreground/80 hover:bg-accent/60 hover:text-foreground',
            appStore.sidebarCollapsed ? 'justify-center px-0' : '',
          ]"
          :title="t(`tools.${tool.id}.name`)"
          @click="navigateTo(tool.path)"
        >
          <div
            :class="[
              'flex size-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-xs transition-transform duration-200 group-hover:scale-110',
              tool.gradient,
            ]"
          >
            <ToolIcon :name="tool.icon" class="size-3.5" />
          </div>
          <span v-if="!appStore.sidebarCollapsed" class="truncate">
            {{ t(`tools.${tool.id}.name`) }}
          </span>
        </button>
      </div>

      <!-- 按分类分组的工具导航 -->
      <div v-if="categorizedTools.length > 0" class="space-y-3">
        <div v-for="group in categorizedTools" :key="group.id" class="space-y-1">
          <!-- 分类标题（可点击展开/折叠） -->
          <button
            v-if="!appStore.sidebarCollapsed"
            type="button"
            class="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground cursor-pointer"
            @click="toggleCategory(group.id)"
          >
            <span class="flex items-center gap-1.5">
              <ToolIcon :name="group.icon" class="size-3.5 text-primary/80" />
              {{ t(`categories.${group.id}.name`) }}
            </span>
            <ChevronDown
              :class="[
                'size-3.5 transition-transform duration-200',
                expandedCategories[group.id] ? 'rotate-0' : '-rotate-90',
              ]"
            />
          </button>
          <div v-else class="mx-auto my-2 h-px w-8 bg-border" />

          <!-- 分类下属工具列表 -->
          <div
            v-show="appStore.sidebarCollapsed || expandedCategories[group.id] || Boolean(appStore.searchQuery)"
            class="space-y-1"
          >
            <button
              v-for="tool in group.tools"
              :key="tool.id"
              type="button"
              :class="[
                'group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200 cursor-pointer',
                route.path === tool.path
                  ? 'bg-primary/12 font-semibold text-primary shadow-xs ring-1 ring-primary/25'
                  : 'text-sidebar-foreground/80 hover:bg-accent/70 hover:text-foreground',
                appStore.sidebarCollapsed ? 'justify-center px-0' : '',
              ]"
              :title="t(`tools.${tool.id}.name`)"
              @click="navigateTo(tool.path)"
            >
              <div
                :class="[
                  'flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-xs transition-transform duration-200 group-hover:scale-110',
                  tool.gradient,
                ]"
              >
                <ToolIcon :name="tool.icon" class="size-3.5" />
              </div>
              <span v-if="!appStore.sidebarCollapsed" class="truncate">
                {{ t(`tools.${tool.id}.name`) }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- 搜索无结果提示 -->
      <div
        v-else-if="!appStore.sidebarCollapsed"
        class="rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground"
      >
        <p>{{ t('app.noResults') }}</p>
        <button
          type="button"
          class="mt-2 font-medium text-primary hover:underline cursor-pointer"
          @click="appStore.searchQuery = ''"
        >
          {{ t('app.resetSearch') }}
        </button>
      </div>
    </nav>
  </aside>
</template>
