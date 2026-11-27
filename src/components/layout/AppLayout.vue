<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { CheckCircle2, AlertCircle } from 'lucide-vue-next'
import { useAppStore } from '@/stores/app'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'

const { t } = useI18n()
const appStore = useAppStore()
</script>

<template>
  <!-- 应用全局响应式布局外壳 -->
  <div class="relative flex min-h-screen w-full overflow-x-hidden bg-background text-foreground">
    <!-- 顶部全局装饰光晕背景 -->
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        class="animate-candy-aurora absolute -top-32 -left-24 size-96 rounded-full bg-pink-500/10 blur-3xl dark:bg-pink-500/15"
      />
      <div
        class="animate-candy-aurora absolute top-1/3 -right-24 size-[28rem] rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/15"
        style="animation-delay: -4s"
      />
      <div
        class="animate-candy-aurora absolute -bottom-32 left-1/3 size-96 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/15"
        style="animation-delay: -8s"
      />
    </div>

    <!-- 左侧分类工具导航栏 -->
    <AppSidebar />

    <!-- 右侧主内容区 -->
    <div class="flex min-w-0 flex-1 flex-col">
      <AppHeader />

      <main class="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div class="mx-auto w-full max-w-6xl">
          <router-view v-slot="{ Component, route }">
            <Transition name="page-fade" mode="out-in">
              <component :is="Component" :key="route.fullPath" />
            </Transition>
          </router-view>
        </div>
      </main>

      <!-- 页脚版权与开源提示 -->
      <footer class="border-t bg-background/50 px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
        {{ t('app.footerText') }}
      </footer>
    </div>

    <!-- 全局轻量 Toast 通知浮层 -->
    <Transition name="page-fade">
      <div
        v-if="appStore.toastMessage"
        :class="[
          'fixed right-4 bottom-5 z-50 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-lg backdrop-blur-xl',
          appStore.toastMessage.type === 'error'
            ? 'border-destructive/40 bg-destructive/15 text-destructive'
            : 'border-emerald-500/30 bg-card/95 text-foreground',
        ]"
      >
        <AlertCircle v-if="appStore.toastMessage.type === 'error'" class="size-4 text-destructive" />
        <CheckCircle2 v-else class="size-4 text-emerald-500" />
        <span>{{ appStore.toastMessage.text }}</span>
      </div>
    </Transition>
  </div>
</template>
