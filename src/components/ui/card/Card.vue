<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <!-- 卡片容器组件 -->
  <div
    :class="
      cn(
        'rounded-2xl border bg-card/85 text-card-foreground shadow-sm backdrop-blur-md transition-all duration-300',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
