<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeftRight, Copy, Eraser, Sparkles } from 'lucide-vue-next'
import { decodeBase64, encodeBase64 } from '@/utils/tools/base64'
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
const urlSafe = ref(false)
const errorMessage = ref('')
const lastAction = ref<'encode' | 'decode'>('encode')

const inputBytes = computed(() => new TextEncoder().encode(inputText.value).length)
const outputBytes = computed(() => new TextEncoder().encode(outputText.value).length)

/** 执行编码 */
function handleEncode() {
  lastAction.value = 'encode'
  errorMessage.value = ''
  outputText.value = encodeBase64(inputText.value, urlSafe.value)
}

/** 执行解码 */
function handleDecode() {
  lastAction.value = 'decode'
  errorMessage.value = ''
  try {
    outputText.value = decodeBase64(inputText.value, urlSafe.value)
  } catch {
    outputText.value = ''
    errorMessage.value = t('tools.base64.invalidBase64')
  }
}

/** 切换 URL-Safe 选项时自动按最近一次动作重新计算 */
function handleUrlSafeChange(val: boolean) {
  urlSafe.value = val
  if (!inputText.value) return
  if (lastAction.value === 'encode') handleEncode()
  else handleDecode()
}

/** 交换输入与输出框内容 */
function handleSwap() {
  const prevOut = outputText.value
  outputText.value = inputText.value
  inputText.value = prevOut
  errorMessage.value = ''
}

function handleSample() {
  inputText.value = '你好，糖果工具 Candy Tool! 🍬 Welcome to 2026.'
  handleEncode()
}

function handleClear() {
  inputText.value = ''
  outputText.value = ''
  errorMessage.value = ''
}
</script>

<template>
  <div>
    <ToolPageHeader tool-id="base64" />

    <Card class="p-5 sm:p-6 space-y-5">
      <!-- 顶部工具栏与选项开关 -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div class="flex flex-wrap items-center gap-2">
          <Button variant="candy" @click="handleEncode">
            {{ t('common.encode') }}
          </Button>
          <Button variant="default" @click="handleDecode">
            {{ t('common.decode') }}
          </Button>
          <Button variant="outline" size="sm" @click="handleSwap">
            <ArrowLeftRight class="size-4" />
            <span>{{ t('common.swap') }}</span>
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

        <label class="flex items-center gap-2.5 text-sm font-medium cursor-pointer select-none">
          <Switch :model-value="urlSafe" @update:model-value="handleUrlSafeChange" />
          <span>{{ t('tools.base64.urlSafe') }}</span>
        </label>
      </div>

      <!-- 错误提示条 -->
      <div
        v-if="errorMessage"
        class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive"
      >
        {{ errorMessage }}
      </div>

      <!-- 双栏输入输出面板 -->
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ToolPaneColumn :title="t('common.input')">
          <template #badge>
            <Badge variant="secondary">
              {{ inputText.length }} {{ t('common.characters') }} · {{ inputBytes }} {{ t('common.bytes') }}
            </Badge>
          </template>
          <Textarea
            v-model="inputText"
            class="min-h-[240px] flex-1 font-mono text-xs sm:text-sm leading-relaxed"
            :placeholder="t('tools.base64.inputPlaceholder')"
          />
        </ToolPaneColumn>

        <ToolPaneColumn :title="t('common.output')">
          <template #badge>
            <Badge variant="secondary">
              {{ outputText.length }} {{ t('common.characters') }} · {{ outputBytes }} {{ t('common.bytes') }}
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
            class="min-h-[240px] flex-1 bg-muted/40 font-mono text-xs sm:text-sm leading-relaxed"
            :placeholder="t('tools.base64.outputPlaceholder')"
          />
        </ToolPaneColumn>
      </div>
    </Card>
  </div>
</template>
