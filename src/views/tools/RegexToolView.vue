<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Copy, Eraser } from 'lucide-vue-next'
import { REGEX_PRESETS, testRegex } from '@/utils/tools/regexTool'
import { useClipboardCopy } from '@/composables/useClipboardCopy'
import ToolPageHeader from '@/components/common/ToolPageHeader.vue'
import ToolPaneColumn from '@/components/common/ToolPaneColumn.vue'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import Input from '@/components/ui/input/Input.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import Badge from '@/components/ui/badge/Badge.vue'

const { t } = useI18n()
const { copyText } = useClipboardCopy()

const pattern = ref(REGEX_PRESETS[0].pattern)
const selectedFlags = ref<string[]>(['g'])
const testText = ref(REGEX_PRESETS[0].sample)
const replacePattern = ref('$1 [at] $2')

const availableFlags = [
  { flag: 'g', label: 'g (global)' },
  { flag: 'i', label: 'i (ignoreCase)' },
  { flag: 'm', label: 'm (multiline)' },
  { flag: 's', label: 's (dotAll)' },
  { flag: 'u', label: 'u (unicode)' },
]

const flagsString = computed(() => selectedFlags.value.join(''))

/** 实时计算正则匹配、高亮分段与替换预览结果 */
const regexResult = computed(() => {
  return testRegex(pattern.value, flagsString.value, testText.value, replacePattern.value)
})

function toggleFlag(flag: string) {
  const idx = selectedFlags.value.indexOf(flag)
  if (idx >= 0) {
    selectedFlags.value.splice(idx, 1)
  } else {
    selectedFlags.value.push(flag)
  }
}

function applyPreset(presetKey: string) {
  const found = REGEX_PRESETS.find((p) => p.key === presetKey)
  if (!found) return
  pattern.value = found.pattern
  selectedFlags.value = found.flags.split('')
  testText.value = found.sample
}

function handleClear() {
  pattern.value = ''
  testText.value = ''
  replacePattern.value = ''
}
</script>

<template>
  <div class="space-y-6">
    <ToolPageHeader tool-id="regex" />

    <Card class="p-5 sm:p-6 space-y-5">
      <!-- 常用正则模板快速填充 -->
      <div class="flex flex-wrap items-center gap-2 border-b pb-4">
        <span class="text-xs font-semibold text-muted-foreground uppercase">
          {{ t('tools.regex.presetsLabel') }}:
        </span>
        <Button
          v-for="preset in REGEX_PRESETS"
          :key="preset.key"
          variant="outline"
          size="sm"
          class="text-xs"
          @click="applyPreset(preset.key)"
        >
          {{ t(`tools.regex.presets.${preset.key}`) }}
        </Button>
        <Button variant="ghost" size="sm" class="ml-auto" @click="handleClear">
          <Eraser class="size-4" />
          <span>{{ t('common.clear') }}</span>
        </Button>
      </div>

      <!-- 正则表达式输入与修饰符选择 -->
      <div class="space-y-3">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div class="relative flex-1">
            <span class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-mono text-sm text-primary">
              /
            </span>
            <Input
              v-model="pattern"
              class="pl-6 pr-16 font-mono text-sm"
              :placeholder="t('tools.regex.patternLabel')"
            />
            <span class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-xs text-muted-foreground">
              /{{ flagsString }}
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-1.5">
            <button
              v-for="item in availableFlags"
              :key="item.flag"
              type="button"
              :title="item.label"
              :class="[
                'rounded-lg border px-2.5 py-1.5 font-mono text-xs font-semibold transition-all cursor-pointer',
                selectedFlags.includes(item.flag)
                  ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                  : 'border-input bg-background text-muted-foreground hover:text-foreground',
              ]"
              @click="toggleFlag(item.flag)"
            >
              {{ item.flag }}
            </button>
          </div>
        </div>

        <div
          v-if="!regexResult.valid"
          class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive"
        >
          {{ t('tools.regex.invalidRegex') }}: {{ regexResult.error }}
        </div>
      </div>

      <!-- 测试文本与实时高亮预览 -->
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ToolPaneColumn :title="t('tools.regex.testTextLabel')">
          <Textarea
            v-model="testText"
            class="min-h-[200px] flex-1 font-mono text-xs sm:text-sm leading-relaxed"
          />
        </ToolPaneColumn>

        <ToolPaneColumn :title="t('tools.regex.matchesTitle')">
          <template #badge>
            <Badge variant="candy">
              {{ t('tools.regex.matchCount', { count: regexResult.matches.length }) }}
            </Badge>
          </template>
          <div
            class="min-h-[200px] flex-1 rounded-xl border bg-muted/35 px-3.5 py-2.5 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-all"
          >
            <template v-for="(seg, idx) in regexResult.segments" :key="idx">
              <mark
                v-if="seg.isMatch"
                class="rounded bg-pink-500/25 px-0.5 text-pink-700 ring-1 ring-pink-500/40 dark:bg-pink-500/35 dark:text-pink-200"
              >{{ seg.text }}</mark>
              <span v-else>{{ seg.text }}</span>
            </template>
            <span v-if="!testText" class="text-muted-foreground">
              {{ t('tools.regex.noMatches') }}
            </span>
          </div>
        </ToolPaneColumn>
      </div>

      <!-- 替换模板与结果预览 -->
      <div class="grid grid-cols-1 gap-5 border-t pt-5 lg:grid-cols-2">
        <ToolPaneColumn :title="t('tools.regex.replaceLabel')">
          <Input v-model="replacePattern" class="min-h-9 font-mono text-sm" />
        </ToolPaneColumn>

        <ToolPaneColumn :title="t('tools.regex.replaceResult')">
          <template #actions>
            <Button
              variant="outline"
              size="sm"
              :disabled="!regexResult.replacedText"
              @click="copyText(regexResult.replacedText || '')"
            >
              <Copy class="size-3.5" />
              <span>{{ t('common.copy') }}</span>
            </Button>
          </template>
          <div class="flex min-h-9 items-center rounded-xl border bg-muted/40 px-3.5 py-1.5 font-mono text-xs sm:text-sm break-all">
            {{ regexResult.replacedText }}
          </div>
        </ToolPaneColumn>
      </div>
    </Card>

    <!-- 匹配项及捕获组明细列表 -->
    <Card class="p-5 sm:p-6 space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold">{{ t('tools.regex.matchesTitle') }}</h3>
        <Badge variant="secondary">{{ regexResult.matches.length }}</Badge>
      </div>

      <div v-if="regexResult.matches.length > 0" class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div
          v-for="(m, idx) in regexResult.matches"
          :key="idx"
          class="rounded-xl border bg-background/60 p-3.5 space-y-2"
        >
          <div class="flex items-center justify-between text-xs text-muted-foreground">
            <span class="font-semibold text-primary">#{{ idx + 1 }}</span>
            <span>index: {{ m.index }} - {{ m.endIndex }}</span>
          </div>
          <div class="rounded-lg bg-muted/60 px-2.5 py-1.5 font-mono text-xs break-all">
            {{ m.value }}
          </div>
          <div v-if="m.groups.length > 0" class="flex flex-wrap gap-1.5 pt-1">
            <Badge v-for="(grp, gIdx) in m.groups" :key="gIdx" variant="outline" class="font-mono">
              {{ t('tools.regex.groupLabel') }} {{ gIdx + 1 }}: {{ grp }}
            </Badge>
          </div>
        </div>
      </div>
      <div v-else class="rounded-xl border border-dashed py-6 text-center text-sm text-muted-foreground">
        {{ t('tools.regex.noMatches') }}
      </div>
    </Card>
  </div>
</template>
