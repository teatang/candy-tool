<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Copy, Eraser, Minimize2, Sparkles, Wand2 } from 'lucide-vue-next'
import { formatSql, minifySql, type SqlLanguage } from '@/utils/tools/sqlTool'
import { useClipboardCopy } from '@/composables/useClipboardCopy'
import ToolPageHeader from '@/components/common/ToolPageHeader.vue'
import ToolPaneColumn from '@/components/common/ToolPaneColumn.vue'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import Switch from '@/components/ui/switch/Switch.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'

const { t } = useI18n()
const { copyText } = useClipboardCopy()

const inputText = ref('')
const outputText = ref('')
const dialect = ref<SqlLanguage>('sql')
const uppercaseKeywords = ref(true)
const errorMessage = ref('')

const dialects: Array<{ value: SqlLanguage; label: string }> = [
  { value: 'sql', label: 'Standard SQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'tsql', label: 'SQL Server (T-SQL)' },
]

function handleFormat() {
  errorMessage.value = ''
  try {
    outputText.value = formatSql(inputText.value, {
      language: dialect.value,
      keywordCase: uppercaseKeywords.value ? 'upper' : 'lower',
      tabWidth: 2,
    })
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : String(err)
  }
}

function handleMinify() {
  errorMessage.value = ''
  outputText.value = minifySql(inputText.value)
}

function handleSample() {
  inputText.value =
    "select u.id, u.username, count(o.id) as order_count from users u left join orders o on u.id = o.user_id where u.status = 'active' and u.created_at >= '2026-01-01' group by u.id, u.username order by order_count desc limit 20;"
  handleFormat()
}

function handleClear() {
  inputText.value = ''
  outputText.value = ''
  errorMessage.value = ''
}
</script>

<template>
  <div>
    <ToolPageHeader tool-id="sql" />

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
          <div class="flex items-center gap-2 text-sm">
            <span class="text-muted-foreground">{{ t('tools.sql.dialectLabel') }}:</span>
            <select
              v-model="dialect"
              class="h-9 rounded-xl border border-input bg-background px-3 text-xs font-medium outline-none focus:ring-2 focus:ring-ring"
            >
              <option v-for="d in dialects" :key="d.value" :value="d.value">
                {{ d.label }}
              </option>
            </select>
          </div>

          <label class="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
            <Switch :model-value="uppercaseKeywords" @update:model-value="uppercaseKeywords = $event" />
            <span>{{ t('tools.sql.uppercaseKeywords') }}</span>
          </label>
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive"
      >
        {{ errorMessage }}
      </div>

      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ToolPaneColumn :title="t('common.input')">
          <Textarea
            v-model="inputText"
            class="min-h-[320px] flex-1 font-mono text-xs sm:text-sm leading-relaxed"
            :placeholder="t('tools.sql.inputPlaceholder')"
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
            class="min-h-[320px] flex-1 bg-muted/40 font-mono text-xs sm:text-sm leading-relaxed"
            :placeholder="t('tools.sql.outputPlaceholder')"
          />
        </ToolPaneColumn>
      </div>
    </Card>
  </div>
</template>
