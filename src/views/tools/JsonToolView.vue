<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { AlertCircle, CheckCircle2, Copy, Eraser, Minimize2, Sparkles, Wand2 } from 'lucide-vue-next'
import { formatJson, minifyJson, validateJson } from '@/utils/tools/jsonTool'
import { useClipboardCopy } from '@/composables/useClipboardCopy'
import ToolPageHeader from '@/components/common/ToolPageHeader.vue'
import ToolPaneColumn from '@/components/common/ToolPaneColumn.vue'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import Switch from '@/components/ui/switch/Switch.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import Badge from '@/components/ui/badge/Badge.vue'

const { t } = useI18n()
const { copyText } = useClipboardCopy()

const inputText = ref('')
const outputText = ref('')
const indent = ref<2 | 4 | 'tab'>(2)
const sortKeys = ref(false)
const statusState = ref<{ ok: boolean; message: string; line?: number; column?: number } | null>(null)

const lineCount = computed(() => (outputText.value ? outputText.value.split('\n').length : 0))

function handleFormat() {
  const res = formatJson(inputText.value, { indent: indent.value, sortKeys: sortKeys.value })
  if (res.ok) {
    outputText.value = res.result
    statusState.value = inputText.value.trim()
      ? { ok: true, message: t('tools.json.validTip') }
      : null
  } else {
    outputText.value = ''
    statusState.value = {
      ok: false,
      message: res.error || t('common.invalid'),
      line: res.line,
      column: res.column,
    }
  }
}

function handleMinify() {
  const res = minifyJson(inputText.value)
  if (res.ok) {
    outputText.value = res.result
    statusState.value = inputText.value.trim()
      ? { ok: true, message: t('tools.json.validTip') }
      : null
  } else {
    outputText.value = ''
    statusState.value = {
      ok: false,
      message: res.error || t('common.invalid'),
      line: res.line,
      column: res.column,
    }
  }
}

function handleValidate() {
  const res = validateJson(inputText.value)
  if (res.valid) {
    statusState.value = { ok: true, message: t('tools.json.validTip') }
  } else {
    statusState.value = {
      ok: false,
      message: res.error || t('common.invalid'),
      line: res.line,
      column: res.column,
    }
  }
}

function handleSample() {
  inputText.value =
    '{"name":"糖果工具","version":"1.0.0","features":["Base64","JSON","Mermaid","Crypto"],"config":{"theme":"system","dark":true,"count":10}}'
  handleFormat()
}

function handleClear() {
  inputText.value = ''
  outputText.value = ''
  statusState.value = null
}
</script>

<template>
  <div>
    <ToolPageHeader tool-id="json" />

    <Card class="p-5 sm:p-6 space-y-5">
      <!-- 操作按钮与格式化选项 -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div class="flex flex-wrap items-center gap-2">
          <Button variant="candy" @click="handleFormat">
            <Wand2 class="size-4" />
            <span>{{ t('common.format') }}</span>
          </Button>
          <Button variant="default" @click="handleMinify">
            <Minimize2 class="size-4" />
            <span>{{ t('common.minify') }}</span>
          </Button>
          <Button variant="outline" @click="handleValidate">
            <CheckCircle2 class="size-4" />
            <span>{{ t('common.validate') }}</span>
          </Button>
          <Button variant="ghost" size="sm" @click="handleSample">
            <Sparkles class="size-4" />
            <span>{{ t('common.sample') }}</span>
          </Button>
          <Button variant="ghost" size="sm" @click="handleClear">
            <Eraser class="size-4" />
            <span>{{ t('common.clear') }}</span>
          </Button>
        </div>

        <div class="flex flex-wrap items-center gap-4">
          <!-- 缩进选择 -->
          <div class="flex items-center gap-1 rounded-xl border bg-muted/60 p-1 text-xs">
            <button
              v-for="opt in [2, 4, 'tab'] as const"
              :key="String(opt)"
              type="button"
              :class="[
                'rounded-lg px-2.5 py-1 font-medium transition-all cursor-pointer',
                indent === opt
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              ]"
              @click="indent = opt"
            >
              {{ opt === 'tab' ? t('tools.json.tab') : t('tools.json.spaces', { n: opt }) }}
            </button>
          </div>

          <label class="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
            <Switch :model-value="sortKeys" @update:model-value="sortKeys = $event" />
            <span>{{ t('tools.json.sortKeys') }}</span>
          </label>
        </div>
      </div>

      <!-- 语法校验结果状态条 -->
      <div
        v-if="statusState"
        :class="[
          'flex flex-wrap items-center gap-2 rounded-xl border px-4 py-2.5 text-sm',
          statusState.ok
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
            : 'border-destructive/30 bg-destructive/10 text-destructive',
        ]"
      >
        <CheckCircle2 v-if="statusState.ok" class="size-4 shrink-0" />
        <AlertCircle v-else class="size-4 shrink-0" />
        <span class="font-medium">{{ statusState.message }}</span>
        <Badge v-if="!statusState.ok && statusState.line" variant="destructive">
          {{ t('tools.json.lineCol', { line: statusState.line, col: statusState.column ?? 1 }) }}
        </Badge>
      </div>

      <!-- 双栏 JSON 编辑区 -->
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ToolPaneColumn :title="t('common.input')">
          <Textarea
            v-model="inputText"
            class="min-h-[340px] flex-1 font-mono text-xs sm:text-sm leading-relaxed"
            :placeholder="t('tools.json.inputPlaceholder')"
          />
        </ToolPaneColumn>

        <ToolPaneColumn :title="t('common.output')">
          <template #badge>
            <Badge v-if="lineCount > 0" variant="secondary">
              {{ lineCount }} {{ t('common.lines') }}
            </Badge>
          </template>
          <template #actions>
            <Button
              variant="outline"
              size="sm"
              :disabled="!outputText"
              @click="copyText(outputText)"
            >
              <Copy class="size-3.5" />
              <span>{{ t('common.copy') }}</span>
            </Button>
          </template>
          <Textarea
            v-model="outputText"
            readonly
            class="min-h-[340px] flex-1 bg-muted/40 font-mono text-xs sm:text-sm leading-relaxed"
            :placeholder="t('tools.json.outputPlaceholder')"
          />
        </ToolPaneColumn>
      </div>
    </Card>
  </div>
</template>
