<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  /** 面板标题 */
  title: string
  /** 额外容器类名（如栅格跨度 lg:col-span-5） */
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <!-- 统一双栏工具面板列容器：固定 min-h-8 标题行与 flex-col 弹性伸缩，确保左右输入输出框顶部与底部严格对齐 -->
  <div :class="cn('flex flex-col gap-2', props.class)">
    <div class="flex min-h-8 items-center justify-between gap-2">
      <div class="flex items-center gap-2 min-w-0">
        <span class="text-sm font-semibold truncate">{{ title }}</span>
        <slot name="badge" />
      </div>
      <div class="flex shrink-0 items-center gap-1.5">
        <slot name="actions" />
      </div>
    </div>
    <div class="flex flex-1 flex-col">
      <slot />
    </div>
  </div>
</template>
