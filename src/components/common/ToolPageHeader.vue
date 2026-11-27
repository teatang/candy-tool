<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Star } from 'lucide-vue-next'
import { getToolById } from '@/config/tools'
import { useAppStore } from '@/stores/app'
import ToolIcon from './ToolIcon.vue'
import Button from '@/components/ui/button/Button.vue'
import Badge from '@/components/ui/badge/Badge.vue'

const props = defineProps<{
  /** 当前工具的唯一 ID */
  toolId: string
}>()

const { t } = useI18n()
const appStore = useAppStore()

const toolMeta = computed(() => getToolById(props.toolId))
const isFav = computed(() => appStore.isFavorite(props.toolId))
</script>

<template>
  <!-- 所有工具页面的统一头部横幅：包含渐变图标、工具名称、简介与收藏按钮 -->
  <div
    class="animate-candy-pop mb-6 flex flex-col gap-4 rounded-2xl border bg-card/80 p-5 shadow-xs backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
  >
    <div class="flex items-start gap-4 sm:items-center">
      <div
        v-if="toolMeta"
        :class="[
          'flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md transition-transform duration-300 hover:scale-105',
          toolMeta.gradient,
        ]"
      >
        <ToolIcon :name="toolMeta.icon" class="size-6" />
      </div>
      <div class="min-w-0 space-y-1">
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-xl font-bold tracking-tight sm:text-2xl">
            {{ t(`tools.${toolId}.name`) }}
          </h1>
          <Badge v-if="toolMeta" variant="candy">
            {{ t(`categories.${toolMeta.category}.name`) }}
          </Badge>
        </div>
        <p class="text-sm text-muted-foreground">
          {{ t(`tools.${toolId}.shortDesc`) }}
        </p>
      </div>
    </div>

    <div class="flex shrink-0 items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        class="gap-1.5"
        :title="isFav ? t('common.unfavorite') : t('common.favorite')"
        @click="appStore.toggleFavorite(toolId)"
      >
        <Star
          :class="[
            'size-4 transition-colors',
            isFav ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground',
          ]"
        />
        <span>{{ isFav ? t('common.unfavorite') : t('common.favorite') }}</span>
      </Button>
    </div>
  </div>
</template>
