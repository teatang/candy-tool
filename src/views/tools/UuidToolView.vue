<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Copy, RefreshCw } from 'lucide-vue-next'
import { generateUuidBatch, type UuidVersion } from '@/utils/tools/uuidTool'
import { useClipboardCopy } from '@/composables/useClipboardCopy'
import ToolPageHeader from '@/components/common/ToolPageHeader.vue'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import Input from '@/components/ui/input/Input.vue'
import Switch from '@/components/ui/switch/Switch.vue'
import Badge from '@/components/ui/badge/Badge.vue'

const { t } = useI18n()
const { copyText } = useClipboardCopy()

const version = ref<UuidVersion>('v4')
const count = ref(5)
const uppercase = ref(false)
const hyphens = ref(true)
const braces = ref(false)
const uuids = ref<string[]>([])

function regenerate() {
  uuids.value = generateUuidBatch({
    version: version.value,
    count: count.value,
    uppercase: uppercase.value,
    hyphens: hyphens.value,
    braces: braces.value,
  })
}

watch([version, count, uppercase, hyphens, braces], regenerate, { immediate: true })

function copyAll() {
  copyText(uuids.value.join('\n'))
}
</script>

<template>
  <div>
    <ToolPageHeader tool-id="uuid" />

    <Card class="p-5 sm:p-6 space-y-5">
      <!-- 配置与控制栏 -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-1 rounded-xl border bg-muted/60 p-1 text-xs">
            <button
              v-for="ver in ['v4', 'v7', 'nil'] as const"
              :key="ver"
              type="button"
              :class="[
                'rounded-lg px-3 py-1.5 font-semibold uppercase transition-all cursor-pointer',
                version === ver
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              ]"
              @click="version = ver"
            >
              UUID {{ ver }}
            </button>
          </div>

          <div class="flex items-center gap-2 text-sm">
            <span class="text-muted-foreground">{{ t('tools.uuid.countLabel') }}:</span>
            <Input
              v-model.number="count"
              type="number"
              min="1"
              max="100"
              class="w-20 font-mono text-center"
            />
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <Button variant="candy" @click="regenerate">
            <RefreshCw class="size-4" />
            <span>{{ t('tools.uuid.regenerate') }}</span>
          </Button>
          <Button variant="outline" :disabled="uuids.length === 0" @click="copyAll">
            <Copy class="size-4" />
            <span>{{ t('tools.uuid.copyAll') }}</span>
          </Button>
        </div>
      </div>

      <!-- 格式开关与版本说明 -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-5">
          <label class="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
            <Switch :model-value="uppercase" @update:model-value="uppercase = $event" />
            <span>{{ t('tools.uuid.uppercase') }}</span>
          </label>
          <label class="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
            <Switch :model-value="hyphens" @update:model-value="hyphens = $event" />
            <span>{{ t('tools.uuid.hyphens') }}</span>
          </label>
          <label class="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
            <Switch :model-value="braces" @update:model-value="braces = $event" />
            <span>{{ t('tools.uuid.braces') }}</span>
          </label>
        </div>

        <Badge variant="candy">
          {{ t(`tools.uuid.${version}Desc`) }}
        </Badge>
      </div>

      <!-- 生成结果列表 -->
      <div class="space-y-2">
        <div
          v-for="(item, index) in uuids"
          :key="`${index}-${item}`"
          class="group flex items-center justify-between gap-3 rounded-xl border bg-background/60 px-4 py-2.5 transition-colors hover:border-primary/40 hover:bg-muted/40"
        >
          <div class="flex items-center gap-3 min-w-0">
            <span class="w-6 shrink-0 font-mono text-xs text-muted-foreground">
              #{{ index + 1 }}
            </span>
            <code class="truncate font-mono text-xs sm:text-sm font-medium">
              {{ item }}
            </code>
          </div>
          <Button variant="ghost" size="icon-sm" @click="copyText(item)">
            <Copy class="size-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>
