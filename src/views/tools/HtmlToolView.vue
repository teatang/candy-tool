<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Copy, Eraser, Minimize2, Sparkles, Wand2 } from 'lucide-vue-next'
import { formatHtml, minifyHtml } from '@/utils/tools/htmlTool'
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
const indentSize = ref<2 | 4>(2)
const removeComments = ref(true)

const inputBytes = computed(() => new TextEncoder().encode(inputText.value).length)
const outputBytes = computed(() => new TextEncoder().encode(outputText.value).length)

function handleFormat() {
  outputText.value = formatHtml(inputText.value, indentSize.value)
}

function handleMinify() {
  outputText.value = minifyHtml(inputText.value, removeComments.value)
}

function handleSample() {
  inputText.value = `<div class="candy-card"><!-- 糖果卡片 --><header><h2>Candy Tool</h2></header><main><p>Sweet &amp; fast HTML formatter</p></main></div>`
  handleFormat()
}

function handleClear() {
  inputText.value = ''
  outputText.value = ''
}
</script>

<template>
  <div>
    <ToolPageHeader tool-id="html" />

    <Card class="p-5 sm:p-6 space-y-5">
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
          <div class="flex items-center gap-1 rounded-xl border bg-muted/60 p-1 text-xs">
            <button
              v-for="n in [2, 4] as const"
              :key="n"
              type="button"
              :class="[
                'rounded-lg px-2.5 py-1 font-medium transition-all cursor-pointer',
                indentSize === n
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              ]"
              @click="indentSize = n"
            >
              {{ t('tools.json.spaces', { n }) }}
            </button>
          </div>

          <label class="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
            <Switch :model-value="removeComments" @update:model-value="removeComments = $event" />
            <span>{{ t('tools.html.removeComments') }}</span>
          </label>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ToolPaneColumn :title="t('common.input')">
          <template #badge>
            <Badge variant="secondary">{{ inputBytes }} {{ t('common.bytes') }}</Badge>
          </template>
          <Textarea
            v-model="inputText"
            class="min-h-[320px] flex-1 font-mono text-xs sm:text-sm leading-relaxed"
            :placeholder="t('tools.html.inputPlaceholder')"
          />
        </ToolPaneColumn>

        <ToolPaneColumn :title="t('common.output')">
          <template #badge>
            <Badge variant="secondary">{{ outputBytes }} {{ t('common.bytes') }}</Badge>
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
            class="min-h-[320px] flex-1 bg-muted/40 font-mono text-xs sm:text-sm leading-relaxed"
            :placeholder="t('tools.html.outputPlaceholder')"
          />
        </ToolPaneColumn>
      </div>
    </Card>
  </div>
</template>
