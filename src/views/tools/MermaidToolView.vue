<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDebounceFn } from '@vueuse/core'
import mermaid from 'mermaid'
import { Download, Image as ImageIcon, RotateCcw, ZoomIn, ZoomOut } from 'lucide-vue-next'
import { MERMAID_TEMPLATES, normalizeMermaidCode } from '@/utils/tools/mermaidTool'
import { useAppStore } from '@/stores/app'
import ToolPageHeader from '@/components/common/ToolPageHeader.vue'
import ToolPaneColumn from '@/components/common/ToolPaneColumn.vue'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'

const { t } = useI18n()
const appStore = useAppStore()

const code = ref(MERMAID_TEMPLATES[0].code)
const renderedSvg = ref('')
const renderError = ref('')
const zoomScale = ref(1)

let renderCounter = 0

/** 初始化或重新渲染 Mermaid SVG 图表 */
async function renderDiagram() {
  const source = normalizeMermaidCode(code.value)
  if (!source) {
    renderedSvg.value = ''
    renderError.value = ''
    return
  }

  try {
    mermaid.initialize({
      startOnLoad: false,
      theme: appStore.isDark ? 'dark' : 'default',
      securityLevel: 'loose',
    })
    renderCounter += 1
    const { svg } = await mermaid.render(`candy-mermaid-${renderCounter}`, source)
    renderedSvg.value = svg
    renderError.value = ''
  } catch (err) {
    renderError.value = err instanceof Error ? err.message : String(err)
  }
}

const debouncedRender = useDebounceFn(renderDiagram, 280)

watch(code, () => {
  debouncedRender()
})

watch(
  () => appStore.isDark,
  () => {
    renderDiagram()
  },
)

onMounted(() => {
  renderDiagram()
})

function selectTemplate(key: string) {
  const tpl = MERMAID_TEMPLATES.find((item) => item.key === key)
  if (tpl) {
    code.value = tpl.code
  }
}

function adjustZoom(delta: number) {
  zoomScale.value = Math.min(Math.max(Number((zoomScale.value + delta).toFixed(2)), 0.4), 2.5)
}

/** 导出当前渲染的 SVG 文件 */
function exportSvg() {
  if (!renderedSvg.value) return
  const blob = new Blob([renderedSvg.value], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `candy-diagram-${Date.now()}.svg`
  link.click()
  URL.revokeObjectURL(url)
}

/** 将 SVG 绘制到 Canvas 并导出 PNG 图片 */
function exportPng() {
  if (!renderedSvg.value) return
  const svgBlob = new Blob([renderedSvg.value], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)
  const img = new Image()
  img.onload = () => {
    const scale = 2
    const canvas = document.createElement('canvas')
    canvas.width = (img.width || 800) * scale
    canvas.height = (img.height || 600) * scale
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = appStore.isDark ? '#18181b' : '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0)
      canvas.toBlob((pngBlob) => {
        if (!pngBlob) return
        const pngUrl = URL.createObjectURL(pngBlob)
        const link = document.createElement('a')
        link.href = pngUrl
        link.download = `candy-diagram-${Date.now()}.png`
        link.click()
        URL.revokeObjectURL(pngUrl)
      }, 'image/png')
    }
    URL.revokeObjectURL(url)
  }
  img.src = url
}
</script>

<template>
  <div>
    <ToolPageHeader tool-id="mermaid" />

    <Card class="p-5 sm:p-6 space-y-5">
      <!-- 顶部模板切换与导出操作栏 -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="mr-1 text-xs font-semibold text-muted-foreground uppercase">
            {{ t('tools.mermaid.templatesLabel') }}:
          </span>
          <Button
            v-for="tpl in MERMAID_TEMPLATES"
            :key="tpl.key"
            variant="outline"
            size="sm"
            class="text-xs"
            @click="selectTemplate(tpl.key)"
          >
            {{ t(`tools.mermaid.templates.${tpl.key}`) }}
          </Button>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" :disabled="!renderedSvg" @click="exportSvg">
            <Download class="size-3.5" />
            <span>{{ t('tools.mermaid.exportSvg') }}</span>
          </Button>
          <Button variant="candy" size="sm" :disabled="!renderedSvg" @click="exportPng">
            <ImageIcon class="size-3.5" />
            <span>{{ t('tools.mermaid.exportPng') }}</span>
          </Button>
        </div>
      </div>

      <!-- 双栏代码与图表实时预览区 -->
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <ToolPaneColumn :title="t('tools.mermaid.codeLabel')" class="lg:col-span-5">
          <Textarea
            v-model="code"
            class="min-h-[420px] flex-1 font-mono text-xs sm:text-sm leading-relaxed"
          />
        </ToolPaneColumn>

        <ToolPaneColumn :title="t('tools.mermaid.previewLabel')" class="lg:col-span-7">
          <template #actions>
            <Button
              variant="outline"
              size="icon-sm"
              :title="t('tools.mermaid.zoomOut')"
              @click="adjustZoom(-0.15)"
            >
              <ZoomOut class="size-3.5" />
            </Button>
            <span class="min-w-12 text-center font-mono text-xs">
              {{ Math.round(zoomScale * 100) }}%
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              :title="t('tools.mermaid.zoomIn')"
              @click="adjustZoom(0.15)"
            >
              <ZoomIn class="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              :title="t('tools.mermaid.zoomReset')"
              @click="zoomScale = 1"
            >
              <RotateCcw class="size-3.5" />
            </Button>
          </template>

          <!-- SVG 画布容器（内部包含错误提示，避免影响左右两栏对齐） -->
          <div
            class="candy-grid-bg relative flex min-h-[420px] flex-1 flex-col items-center justify-center overflow-auto rounded-xl border bg-background/70 p-4"
          >
            <div
              v-if="renderError"
              class="mb-3 w-full rounded-xl border border-destructive/30 bg-destructive/10 p-3 font-mono text-xs text-destructive"
            >
              <div class="mb-1 font-semibold">{{ t('tools.mermaid.renderError') }}</div>
              <div>{{ renderError }}</div>
            </div>
            <div
              class="transition-transform duration-200 origin-center"
              :style="{ transform: `scale(${zoomScale})` }"
              v-html="renderedSvg"
            />
          </div>
        </ToolPaneColumn>
      </div>
    </Card>
  </div>
</template>
