<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Copy, Pause, Play, RefreshCw } from 'lucide-vue-next'
import {
  dateToTimestamp,
  formatDateTime,
  formatRelativeTime,
  timestampToDate,
  type TimestampUnit,
} from '@/utils/tools/timestampTool'
import { useAppStore } from '@/stores/app'
import { useClipboardCopy } from '@/composables/useClipboardCopy'
import ToolPageHeader from '@/components/common/ToolPageHeader.vue'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import Input from '@/components/ui/input/Input.vue'
import Badge from '@/components/ui/badge/Badge.vue'

const { t } = useI18n()
const appStore = useAppStore()
const { copyText } = useClipboardCopy()

// 实时时钟状态
const nowMs = ref(Date.now())
const isPaused = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const nowSeconds = computed(() => Math.floor(nowMs.value / 1000))

// 时间戳 -> 日期输入状态
const tsInput = ref(String(Math.floor(Date.now() / 1000)))
const tsUnit = ref<TimestampUnit>('auto')

const tsResult = computed(() => timestampToDate(tsInput.value, tsUnit.value))
const tsRelative = computed(() => {
  if (!tsResult.value.ok || tsResult.value.milliseconds === undefined) return ''
  return formatRelativeTime(tsResult.value.milliseconds, nowMs.value, appStore.locale)
})

// 日期 -> 时间戳输入状态
const dateInput = ref(formatDateTime(new Date(), false, false))
const dateResult = computed(() => dateToTimestamp(dateInput.value))

onMounted(() => {
  timer = setInterval(() => {
    if (!isPaused.value) {
      nowMs.value = Date.now()
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function setNowTimestamp() {
  const current = Date.now()
  tsInput.value = tsUnit.value === 'ms' ? String(current) : String(Math.floor(current / 1000))
}

function setNowDate() {
  dateInput.value = formatDateTime(new Date(), false, false)
}
</script>

<template>
  <div class="space-y-6">
    <ToolPageHeader tool-id="timestamp" />

    <!-- 实时 Unix 时间戳看板 -->
    <Card class="overflow-hidden p-5 sm:p-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <div class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span class="relative flex size-2.5">
              <span
                v-if="!isPaused"
                class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
              />
              <span
                :class="[
                  'relative inline-flex size-2.5 rounded-full',
                  isPaused ? 'bg-amber-500' : 'bg-emerald-500',
                ]"
              />
            </span>
            <span>{{ t('tools.timestamp.currentLabel') }}</span>
          </div>
          <div class="flex flex-wrap items-baseline gap-4 pt-1">
            <button
              type="button"
              class="font-mono text-2xl font-bold tracking-tight text-primary hover:underline sm:text-3xl cursor-pointer"
              @click="copyText(String(nowSeconds))"
            >
              {{ nowSeconds }}
            </button>
            <Badge variant="secondary" class="font-mono">
              {{ t('tools.timestamp.seconds') }}
            </Badge>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" @click="copyText(String(nowSeconds))">
            <Copy class="size-3.5" />
            <span>{{ t('tools.timestamp.seconds') }}</span>
          </Button>
          <Button variant="outline" size="sm" @click="copyText(String(nowMs))">
            <Copy class="size-3.5" />
            <span>{{ t('tools.timestamp.milliseconds') }}</span>
          </Button>
          <Button variant="default" size="sm" @click="isPaused = !isPaused">
            <Play v-if="isPaused" class="size-3.5" />
            <Pause v-else class="size-3.5" />
            <span>{{ isPaused ? t('tools.timestamp.resume') : t('tools.timestamp.pause') }}</span>
          </Button>
        </div>
      </div>
    </Card>

    <!-- 双向转换双栏卡片 -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- 时间戳转日期 -->
      <Card class="p-5 sm:p-6 space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <h3 class="text-base font-semibold">{{ t('tools.timestamp.tsToDateTitle') }}</h3>
          <Button variant="ghost" size="sm" @click="setNowTimestamp">
            <RefreshCw class="size-3.5" />
            <span>{{ t('tools.timestamp.nowBtn') }}</span>
          </Button>
        </div>

        <div class="flex flex-col gap-2 sm:flex-row">
          <Input v-model="tsInput" class="font-mono" placeholder="1700000000" />
          <select
            v-model="tsUnit"
            class="h-9 rounded-xl border border-input bg-background px-3 text-xs font-medium outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="auto">Auto (s / ms)</option>
            <option value="s">{{ t('tools.timestamp.seconds') }}</option>
            <option value="ms">{{ t('tools.timestamp.milliseconds') }}</option>
          </select>
        </div>

        <div
          v-if="!tsResult.ok"
          class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive"
        >
          {{ t('tools.timestamp.invalidTs') }}
        </div>

        <div v-else class="space-y-2.5 text-sm">
          <div class="flex items-center justify-between rounded-xl bg-muted/50 px-3.5 py-2.5">
            <span class="text-xs text-muted-foreground">{{ t('tools.timestamp.localTz') }}</span>
            <div class="flex items-center gap-2 font-mono text-xs sm:text-sm font-medium">
              <span>{{ tsResult.localString }}</span>
              <Button variant="ghost" size="icon-sm" @click="copyText(tsResult.localString || '')">
                <Copy class="size-3.5" />
              </Button>
            </div>
          </div>

          <div class="flex items-center justify-between rounded-xl bg-muted/50 px-3.5 py-2.5">
            <span class="text-xs text-muted-foreground">{{ t('tools.timestamp.utcTz') }}</span>
            <div class="flex items-center gap-2 font-mono text-xs sm:text-sm font-medium">
              <span>{{ tsResult.utcString }}</span>
              <Button variant="ghost" size="icon-sm" @click="copyText(tsResult.utcString || '')">
                <Copy class="size-3.5" />
              </Button>
            </div>
          </div>

          <div class="flex items-center justify-between rounded-xl bg-muted/50 px-3.5 py-2.5">
            <span class="text-xs text-muted-foreground">{{ t('tools.timestamp.isoFormat') }}</span>
            <div class="flex items-center gap-2 font-mono text-xs font-medium">
              <span>{{ tsResult.isoString }}</span>
              <Button variant="ghost" size="icon-sm" @click="copyText(tsResult.isoString || '')">
                <Copy class="size-3.5" />
              </Button>
            </div>
          </div>

          <div class="flex min-h-12 items-center justify-between rounded-xl bg-muted/50 px-3.5 py-2">
            <span class="text-xs text-muted-foreground">{{ t('tools.timestamp.relativeTime') }}</span>
            <Badge variant="candy">{{ tsRelative }}</Badge>
          </div>
        </div>
      </Card>

      <!-- 日期转时间戳 -->
      <Card class="p-5 sm:p-6 space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <h3 class="text-base font-semibold">{{ t('tools.timestamp.dateToTsTitle') }}</h3>
          <Button variant="ghost" size="sm" @click="setNowDate">
            <RefreshCw class="size-3.5" />
            <span>{{ t('tools.timestamp.nowBtn') }}</span>
          </Button>
        </div>

        <Input
          v-model="dateInput"
          class="font-mono"
          placeholder="2026-11-27 14:30:00"
        />

        <div
          v-if="!dateResult.ok"
          class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive"
        >
          {{ t('tools.timestamp.invalidDate') }}
        </div>

        <div v-else class="space-y-2.5 text-sm">
          <div class="flex items-center justify-between rounded-xl bg-muted/50 px-3.5 py-2.5">
            <span class="text-xs text-muted-foreground">{{ t('tools.timestamp.seconds') }}</span>
            <div class="flex items-center gap-2 font-mono text-sm font-semibold text-primary">
              <span>{{ dateResult.seconds }}</span>
              <Button variant="ghost" size="icon-sm" @click="copyText(String(dateResult.seconds))">
                <Copy class="size-3.5" />
              </Button>
            </div>
          </div>

          <div class="flex items-center justify-between rounded-xl bg-muted/50 px-3.5 py-2.5">
            <span class="text-xs text-muted-foreground">{{ t('tools.timestamp.milliseconds') }}</span>
            <div class="flex items-center gap-2 font-mono text-sm font-semibold">
              <span>{{ dateResult.milliseconds }}</span>
              <Button variant="ghost" size="icon-sm" @click="copyText(String(dateResult.milliseconds))">
                <Copy class="size-3.5" />
              </Button>
            </div>
          </div>

          <div class="flex items-center justify-between rounded-xl bg-muted/50 px-3.5 py-2.5">
            <span class="text-xs text-muted-foreground">{{ t('tools.timestamp.isoFormat') }}</span>
            <div class="flex items-center gap-2 font-mono text-xs font-medium">
              <span>{{ dateResult.isoString }}</span>
              <Button variant="ghost" size="icon-sm" @click="copyText(dateResult.isoString || '')">
                <Copy class="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
