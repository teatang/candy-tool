<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  ArrowRight,
  Braces,
  Candy,
  Globe,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  Zap,
} from 'lucide-vue-next'
import { TOOL_CATEGORIES, TOOLS } from '@/config/tools'
import { useAppStore } from '@/stores/app'
import type { ToolCategoryId } from '@/types/tool'
import ToolIcon from '@/components/common/ToolIcon.vue'
import Button from '@/components/ui/button/Button.vue'
import Badge from '@/components/ui/badge/Badge.vue'
import Card from '@/components/ui/card/Card.vue'

const { t } = useI18n()
const router = useRouter()
const appStore = useAppStore()

/** 首页工具矩阵当前选中的分类过滤项 */
const activeCategory = ref<'all' | ToolCategoryId>('all')

const featureCards = [
  {
    key: 'fast',
    icon: Zap,
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    key: 'ui',
    icon: Sparkles,
    gradient: 'from-pink-500 to-purple-500',
  },
  {
    key: 'responsive',
    icon: Smartphone,
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    key: 'bilingual',
    icon: Globe,
    gradient: 'from-emerald-500 to-teal-500',
  },
]

const visibleCategories = computed(() => {
  if (activeCategory.value === 'all') return TOOL_CATEGORIES
  return TOOL_CATEGORIES.filter((cat) => cat.id === activeCategory.value)
})

function scrollToTools() {
  const el = document.getElementById('tool-matrix')
  el?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="space-y-12 pb-8">
    <!-- =========================================================
         Hero 炫酷动效首屏横幅
         ========================================================= -->
    <section
      class="candy-grid-bg animate-candy-pop relative overflow-hidden rounded-3xl border bg-card/65 p-6 shadow-sm backdrop-blur-xl sm:p-10 lg:p-14"
    >
      <!-- 漂浮装饰糖果微件（桌面端显示） -->
      <div
        class="animate-candy-float pointer-events-none absolute top-8 right-10 hidden size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25 lg:flex"
      >
        <Candy class="size-8" />
      </div>
      <div
        class="animate-candy-float-reverse pointer-events-none absolute right-28 bottom-10 hidden size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 lg:flex"
      >
        <Braces class="size-6" />
      </div>
      <div
        class="animate-candy-float pointer-events-none absolute top-1/2 right-6 hidden size-10 -translate-y-1/2 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-purple-500/20 xl:flex"
        style="animation-delay: 1.5s"
      >
        <Shield class="size-5" />
      </div>

      <div class="relative z-10 max-w-3xl space-y-6">
        <!-- 顶部亮点徽章 -->
        <Badge variant="candy" class="gap-1.5 px-3.5 py-1 text-xs font-semibold">
          <Sparkles class="size-3.5" />
          <span>{{ t('home.badge') }}</span>
        </Badge>

        <!-- 渐变流光大标题 -->
        <h1 class="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.12]">
          <span>{{ t('home.heroTitlePrefix') }}</span>
          <span
            class="animate-candy-gradient mx-1.5 inline-block bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent"
          >
            {{ t('home.heroTitleHighlight') }}
          </span>
          <span>{{ t('home.heroTitleSuffix') }}</span>
        </h1>

        <p class="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {{ t('home.heroSubtitle') }}
        </p>

        <!-- 行动按钮组 -->
        <div class="flex flex-wrap items-center gap-3 pt-1">
          <Button variant="candy" size="lg" class="gap-2" @click="scrollToTools">
            <span>{{ t('home.exploreBtn') }}</span>
            <ArrowRight class="size-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            class="gap-2 bg-background/70 backdrop-blur-sm"
            @click="router.push('/tools/json')"
          >
            <Braces class="size-4 text-cyan-500" />
            <span>{{ t('home.quickStartBtn') }}</span>
          </Button>
        </div>

        <!-- 数据亮点条 -->
        <div class="grid max-w-lg grid-cols-3 gap-4 border-t border-border/60 pt-6">
          <div>
            <div class="text-2xl font-bold text-foreground sm:text-3xl">{{ TOOLS.length }}+</div>
            <div class="text-xs text-muted-foreground">{{ t('home.stats.toolsCount') }}</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-foreground sm:text-3xl">100%</div>
            <div class="text-xs text-muted-foreground">{{ t('home.stats.localPrivacy') }}</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-foreground sm:text-3xl">MIT</div>
            <div class="text-xs text-muted-foreground">{{ t('home.stats.openSource') }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- =========================================================
         核心特性卡片区（交错入场动画 + 悬停抬升）
         ========================================================= -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card
        v-for="(item, idx) in featureCards"
        :key="item.key"
        class="animate-candy-pop group p-5 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
        :style="{ animationDelay: `${idx * 80}ms` }"
      >
        <div
          :class="[
            'mb-4 flex size-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3',
            item.gradient,
          ]"
        >
          <component :is="item.icon" class="size-5" />
        </div>
        <h3 class="mb-1.5 text-base font-semibold">
          {{ t(`home.features.${item.key}.title`) }}
        </h3>
        <p class="text-sm leading-relaxed text-muted-foreground">
          {{ t(`home.features.${item.key}.desc`) }}
        </p>
      </Card>
    </section>

    <!-- =========================================================
         分类工具矩阵展示区
         ========================================================= -->
    <section id="tool-matrix" class="space-y-6 scroll-mt-20">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">
            {{ t('home.sectionToolsTitle') }}
          </h2>
          <p class="mt-1 text-sm text-muted-foreground">
            {{ t('home.sectionToolsSubtitle') }}
          </p>
        </div>

        <!-- 分类过滤药丸切换 -->
        <div class="flex flex-wrap gap-1.5 rounded-xl border bg-muted/60 p-1">
          <button
            type="button"
            :class="[
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer',
              activeCategory === 'all'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            ]"
            @click="activeCategory = 'all'"
          >
            {{ t('app.allTools') }}
          </button>
          <button
            v-for="cat in TOOL_CATEGORIES"
            :key="cat.id"
            type="button"
            :class="[
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer',
              activeCategory === cat.id
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            ]"
            @click="activeCategory = cat.id"
          >
            {{ t(`categories.${cat.id}.name`) }}
          </button>
        </div>
      </div>

      <!-- 按分类渲染工具卡片网格 -->
      <div class="space-y-8">
        <div v-for="category in visibleCategories" :key="category.id" class="space-y-4">
          <div class="flex items-center gap-2.5">
            <div class="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ToolIcon :name="category.icon" class="size-4" />
            </div>
            <div>
              <h3 class="text-lg font-bold">{{ t(`categories.${category.id}.name`) }}</h3>
              <p class="text-xs text-muted-foreground">{{ t(`categories.${category.id}.desc`) }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              v-for="tool in TOOLS.filter((item) => item.category === category.id)"
              :key="tool.id"
              class="group relative flex cursor-pointer flex-col justify-between overflow-hidden p-5 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              @click="router.push(tool.path)"
            >
              <!-- 悬停顶部渐变光条 -->
              <div
                :class="[
                  'absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                  tool.gradient,
                ]"
              />

              <div class="space-y-3">
                <div class="flex items-start justify-between gap-2">
                  <div
                    :class="[
                      'flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3',
                      tool.gradient,
                    ]"
                  >
                    <ToolIcon :name="tool.icon" class="size-5" />
                  </div>

                  <!-- 收藏星标按钮（阻止冒泡，避免触发跳转） -->
                  <button
                    type="button"
                    class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent cursor-pointer"
                    :title="appStore.isFavorite(tool.id) ? t('common.unfavorite') : t('common.favorite')"
                    @click.stop="appStore.toggleFavorite(tool.id)"
                  >
                    <Star
                      :class="[
                        'size-4 transition-colors',
                        appStore.isFavorite(tool.id)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted-foreground/60 group-hover:text-muted-foreground',
                      ]"
                    />
                  </button>
                </div>

                <div>
                  <h4 class="text-base font-semibold transition-colors group-hover:text-primary">
                    {{ t(`tools.${tool.id}.name`) }}
                  </h4>
                  <p class="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {{ t(`tools.${tool.id}.shortDesc`) }}
                  </p>
                </div>
              </div>

              <div class="mt-4 flex items-center justify-between pt-2 text-xs font-medium text-primary">
                <span>{{ t('common.openTool') }}</span>
                <ArrowRight class="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
