<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Copy, Eraser, KeyRound, Sparkles } from 'lucide-vue-next'
import {
  computeAllHashes,
  computeHmac,
  HASH_ALGORITHMS,
  HMAC_ALGORITHMS,
} from '@/utils/tools/cryptoTool'
import { useClipboardCopy } from '@/composables/useClipboardCopy'
import ToolPageHeader from '@/components/common/ToolPageHeader.vue'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import Input from '@/components/ui/input/Input.vue'
import Switch from '@/components/ui/switch/Switch.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import Badge from '@/components/ui/badge/Badge.vue'

const { t } = useI18n()
const { copyText } = useClipboardCopy()

const inputText = ref('Candy Tool 糖果工具')
const hmacKey = ref('')
const uppercase = ref(false)

/** 实时计算全量哈希摘要 */
const hashResults = computed(() => {
  if (!inputText.value) return null
  return computeAllHashes(inputText.value, uppercase.value)
})

/** 当输入 HMAC 密钥时实时计算 HMAC 签名 */
const hmacResults = computed(() => {
  if (!inputText.value || !hmacKey.value) return null
  return HMAC_ALGORITHMS.map((algo) => ({
    algorithm: algo,
    value: computeHmac(inputText.value, hmacKey.value, algo, uppercase.value),
  }))
})

function handleSample() {
  inputText.value = 'Hello Candy Tool! 2026'
  hmacKey.value = 'candy-secret-key'
}

function handleClear() {
  inputText.value = ''
  hmacKey.value = ''
}
</script>

<template>
  <div class="space-y-6">
    <ToolPageHeader tool-id="crypto" />

    <Card class="p-5 sm:p-6 space-y-5">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="sm" @click="handleSample">
            <Sparkles class="size-4" />
            <span>{{ t('common.sample') }}</span>
          </Button>
          <Button variant="ghost" size="sm" @click="handleClear">
            <Eraser class="size-4" />
            <span>{{ t('common.clear') }}</span>
          </Button>
        </div>

        <label class="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
          <Switch :model-value="uppercase" @update:model-value="uppercase = $event" />
          <span>{{ t('tools.crypto.uppercase') }}</span>
        </label>
      </div>

      <div class="space-y-2">
        <span class="text-sm font-semibold">{{ t('common.input') }}</span>
        <Textarea
          v-model="inputText"
          class="min-h-[120px] font-mono text-xs sm:text-sm"
          :placeholder="t('tools.crypto.inputPlaceholder')"
        />
      </div>

      <div class="space-y-2">
        <label class="flex items-center gap-1.5 text-sm font-semibold">
          <KeyRound class="size-4 text-primary" />
          <span>{{ t('tools.crypto.hmacKeyLabel') }}</span>
        </label>
        <Input
          v-model="hmacKey"
          class="font-mono text-sm"
          :placeholder="t('tools.crypto.hmacKeyPlaceholder')"
        />
      </div>
    </Card>

    <!-- 标准哈希结果列表 -->
    <Card class="p-5 sm:p-6 space-y-3">
      <h3 class="text-base font-semibold">{{ t('tools.crypto.hashResults') }}</h3>
      <div class="space-y-2.5">
        <div
          v-for="algo in HASH_ALGORITHMS"
          :key="algo"
          class="flex flex-col gap-2 rounded-xl border bg-background/60 p-3.5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-center gap-3 min-w-0">
            <Badge variant="candy" class="w-20 justify-center shrink-0 font-mono">
              {{ algo }}
            </Badge>
            <code class="truncate font-mono text-xs sm:text-sm">
              {{ hashResults ? hashResults[algo] : '—' }}
            </code>
          </div>
          <Button
            variant="outline"
            size="sm"
            class="shrink-0 self-end sm:self-auto"
            :disabled="!hashResults"
            @click="hashResults && copyText(hashResults[algo])"
          >
            <Copy class="size-3.5" />
            <span>{{ t('common.copy') }}</span>
          </Button>
        </div>
      </div>
    </Card>

    <!-- HMAC 签名结果列表（输入密钥后显示） -->
    <Card v-if="hmacResults" class="animate-candy-pop p-5 sm:p-6 space-y-3">
      <h3 class="text-base font-semibold">{{ t('tools.crypto.hmacResults') }}</h3>
      <div class="space-y-2.5">
        <div
          v-for="item in hmacResults"
          :key="item.algorithm"
          class="flex flex-col gap-2 rounded-xl border bg-background/60 p-3.5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-center gap-3 min-w-0">
            <Badge variant="default" class="w-28 justify-center shrink-0 font-mono">
              {{ item.algorithm }}
            </Badge>
            <code class="truncate font-mono text-xs sm:text-sm">
              {{ item.value }}
            </code>
          </div>
          <Button
            variant="outline"
            size="sm"
            class="shrink-0 self-end sm:self-auto"
            @click="copyText(item.value)"
          >
            <Copy class="size-3.5" />
            <span>{{ t('common.copy') }}</span>
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>
