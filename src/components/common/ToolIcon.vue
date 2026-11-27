<script setup lang="ts">
import { computed } from 'vue'
import {
  Binary,
  Braces,
  Clock,
  Code2,
  Database,
  FileCode2,
  Fingerprint,
  GitFork,
  Link2,
  Regex,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-vue-next'

const props = defineProps<{
  /** Lucide 图标名称 */
  name: string
  /** 自定义图标样式类 */
  class?: string
}>()

/** 图标名称与组件的映射表 */
const iconMap = {
  Binary,
  Braces,
  Clock,
  Code2,
  Database,
  FileCode2,
  Fingerprint,
  GitFork,
  Link2,
  Regex,
  ShieldCheck,
  Sparkles,
  Wrench,
} as const

const iconComponent = computed(() => {
  return iconMap[props.name as keyof typeof iconMap] ?? Wrench
})
</script>

<template>
  <!-- 动态渲染对应工具或分类的 Lucide 矢量图标 -->
  <component :is="iconComponent" :class="props.class" />
</template>
