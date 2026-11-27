<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '@/lib/utils'
import { buttonVariants, type ButtonVariants } from './index'

interface Props extends PrimitiveProps {
  /** 按钮外观变体 */
  variant?: ButtonVariants['variant']
  /** 按钮尺寸 */
  size?: ButtonVariants['size']
  /** 额外 CSS 类名 */
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})
</script>

<template>
  <!-- 基于 Reka UI Primitive 封装的 shadcn-vue 按钮组件 -->
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
