<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeftRight, Copy, Eraser, Sparkles } from 'lucide-vue-next'
import { decodeUrl, encodeUrl, parseUrlParams, type UrlEncodeMode } from '@/utils/tools/urlCodec'
import { useClipboardCopy } from '@/composables/useClipboardCopy'
import ToolPageHeader from '@/components/common/ToolPageHeader.vue'
import ToolPaneColumn from '@/components/common/ToolPaneColumn.vue'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import Badge from '@/components/ui/badge/Badge.vue'

const { t } = useI18n()
const { copyText } = useClipboardCopy()

const inputText = ref('')
const outputText = ref('')
const mode = ref<UrlEncodeMode>('component')
const errorMessage = ref('')

/** 自动解析输入文本或解码结果中的 Query 参数 */
const parsedParams = computed(() => {
  const fromInput = parseUrlParams(inputText.value)
  if (fromInput.length > 0) return fromInput
  return parseUrlParams(outputText.value)
})

function handleEncode() {
  errorMessage.value = ''
  outputText.value = encodeUrl(inputText.value, mode.value)
}

function handleDecode() {
  errorMessage.value = ''
  try {
    outputText.value = decodeUrl(inputText.value, mode.value)
  } catch {
    outputText.value = ''
    errorMessage.value = t('tools.url.invalidUrl')
  }
}

function handleSwap() {
  const tmp = outputText.value
  outputText.value = inputText.value
  inputText.value = tmp
  errorMessage.value = ''
}

function handleSample() {
  inputText.value = 'https://candytool.dev/search?q=糖果工具 & 效率&theme=dark&page=1#top'
  handleEncode()
}

function handleClear() {
  inputText.value = ''
  outputText.value = ''
  errorMessage.value = ''
}
</script>

<template>
  <div class="space-y-6">
    <ToolPageHeader tool-id="url" />

    <Card class="p-5 sm:p-6 space-y-5">
      <!-- 顶部操作栏 -->
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

        <!-- 编码模式切换 -->
        <div class="flex items-center gap-1 rounded-xl border bg-muted/60 p-1 text-xs">
          <button
            type="button"
            :class="[
              'rounded-lg px-2.5 py-1.5 font-medium transition-all cursor-pointer',
              mode === 'component'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            ]"
            @click="mode = 'component'"
          >
            {{ t('tools.url.componentMode') }}
          </button>
          <button
            type="button"
            :class="[
              'rounded-lg px-2.5 py-1.5 font-medium transition-all cursor-pointer',
              mode === 'full'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            ]"
            @click="mode = 'full'"
          >
            {{ t('tools.url.fullUriMode') }}
          </button>
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive"
      >
        {{ errorMessage }}
      </div>

      <!-- 输入输出文本域 -->
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ToolPaneColumn :title="t('common.input')">
          <Textarea
            v-model="inputText"
            class="min-h-[200px] flex-1 font-mono text-xs sm:text-sm"
            :placeholder="t('tools.url.inputPlaceholder')"
          />
        </ToolPaneColumn>

        <ToolPaneColumn :title="t('common.output')">
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
            class="min-h-[200px] flex-1 bg-muted/40 font-mono text-xs sm:text-sm"
            :placeholder="t('tools.url.outputPlaceholder')"
          />
        </ToolPaneColumn>
      </div>
    </Card>

    <!-- Query 查询参数自动解析面板 -->
    <Card class="p-5 sm:p-6 space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold">{{ t('tools.url.queryParams') }}</h3>
        <Badge variant="candy">{{ parsedParams.length }}</Badge>
      </div>

      <div v-if="parsedParams.length > 0" class="overflow-x-auto rounded-xl border">
        <table class="w-full text-left text-sm">
          <thead class="bg-muted/60 text-xs uppercase text-muted-foreground">
            <tr>
              <th class="px-4 py-2.5 font-semibold">{{ t('tools.url.paramKey') }}</th>
              <th class="px-4 py-2.5 font-semibold">{{ t('tools.url.paramValue') }}</th>
              <th class="w-16 px-4 py-2.5 text-right" />
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="(item, idx) in parsedParams" :key="`${item.key}-${idx}`" class="hover:bg-muted/30">
              <td class="px-4 py-2.5 font-mono text-xs font-semibold text-primary">
                {{ item.key }}
              </td>
              <td class="px-4 py-2.5 font-mono text-xs break-all">
                {{ item.value }}
              </td>
              <td class="px-4 py-2.5 text-right">
                <Button variant="ghost" size="icon-sm" @click="copyText(item.value)">
                  <Copy class="size-3.5" />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="rounded-xl border border-dashed py-6 text-center text-sm text-muted-foreground">
        {{ t('tools.url.noParams') }}
      </div>
    </Card>
  </div>
</template>
