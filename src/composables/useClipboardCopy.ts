import { useClipboard } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'

/**
 * 封装剪贴板复制逻辑，复制成功后自动触发全局 Toast 提示
 */
export function useClipboardCopy() {
  const { copy } = useClipboard()
  const { t } = useI18n()
  const appStore = useAppStore()

  /**
   * 复制文本到系统剪贴板
   *
   * @param text - 待复制的字符串
   */
  async function copyText(text: string) {
    if (!text) return
    try {
      await copy(text)
      appStore.showToast(t('common.copied'), 'success')
    } catch {
      // 兼容不支持 Clipboard API 的降级方案
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      appStore.showToast(t('common.copied'), 'success')
    }
  }

  return { copyText }
}
