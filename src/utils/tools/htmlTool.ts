import { html as beautifyHtml } from 'js-beautify'

/**
 * HTML 格式化与压缩工具模块
 */

/**
 * 格式化并美化 HTML 代码
 *
 * @param input - 原始 HTML 字符串
 * @param indentSize - 缩进空格数，默认 2
 * @returns 排版美化后的 HTML 字符串
 */
export function formatHtml(input: string, indentSize = 2): string {
  const trimmed = input.trim()
  if (!trimmed) return ''

  return beautifyHtml(trimmed, {
    indent_size: indentSize,
    indent_char: ' ',
    max_preserve_newlines: 1,
    preserve_newlines: true,
    indent_inner_html: true,
    wrap_line_length: 0,
    end_with_newline: false,
  })
}

/**
 * 压缩 HTML 代码，去除标签间多余空白、换行及可选注释
 *
 * @param input - 原始 HTML 字符串
 * @param removeComments - 是否移除 HTML 注释 (<!-- ... -->)，默认 true
 * @returns 压缩后的紧凑 HTML 字符串
 */
export function minifyHtml(input: string, removeComments = true): string {
  let output = input.trim()
  if (!output) return ''

  // 暂存 <pre> 和 <textarea> 标签内容，避免破坏其中的格式空白
  const preservedBlocks: string[] = []
  output = output.replace(/<(pre|textarea)(\b[^>]*)?>[\s\S]*?<\/\1>/gi, (match) => {
    const token = `__CANDY_PRESERVE_${preservedBlocks.length}__`
    preservedBlocks.push(match)
    return token
  })

  if (removeComments) {
    // 移除标准 HTML 注释（保留 IE 条件注释）
    output = output.replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
  }

  // 折叠连续空白字符为单个空格，并去除标签及占位符间的无意义空白
  output = output
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/>\s+(__CANDY_PRESERVE_\d+__)/g, '>$1')
    .replace(/(__CANDY_PRESERVE_\d+__)\s+</g, '$1<')
    .replace(/\s+>/g, '>')
    .replace(/<\s+/g, '<')
    .trim()

  // 还原被保护的 <pre> / <textarea> 代码块
  preservedBlocks.forEach((block, index) => {
    output = output.replace(`__CANDY_PRESERVE_${index}__`, block)
  })

  return output
}
