/**
 * JSON 格式化、压缩与语法检查工具模块
 */

export interface JsonProcessResult {
  /** 是否处理成功 */
  ok: boolean
  /** 成功后的 JSON 字符串 */
  result: string
  /** 失败时的错误信息 */
  error?: string
  /** 错误所在行号（从 1 开始） */
  line?: number
  /** 错误所在列号（从 1 开始） */
  column?: number
}

export interface JsonFormatOptions {
  /** 缩进空格数，或使用 'tab' 表示制表符缩进 */
  indent?: number | 'tab'
  /** 是否按对象键名字母顺序递归排序 */
  sortKeys?: boolean
}

/**
 * 递归对 JSON 对象的键名按字母升序排序
 *
 * @param value - 任意 JSON 解析后的值
 * @returns 键名排序后的新值
 */
export function sortJsonKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortJsonKeys)
  }
  if (value !== null && typeof value === 'object') {
    const sorted: Record<string, unknown> = {}
    const keys = Object.keys(value as Record<string, unknown>).sort((a, b) =>
      a.localeCompare(b),
    )
    for (const key of keys) {
      sorted[key] = sortJsonKeys((value as Record<string, unknown>)[key])
    }
    return sorted
  }
  return value
}

/**
 * 根据 JSON.parse 报错文本与原始输入计算精确行列位置
 *
 * @param errorMessage - 引擎抛出的错误文本
 * @param input - 原始 JSON 字符串
 * @returns 行号与列号（如果能够解析）
 */
function extractErrorLocation(
  errorMessage: string,
  input: string,
): { line?: number; column?: number } {
  // 匹配 V8 常见格式：... at position 42
  const posMatch = errorMessage.match(/position\s+(\d+)/i)
  if (posMatch) {
    const pos = Number(posMatch[1])
    if (!Number.isNaN(pos)) {
      const sliced = input.slice(0, Math.min(pos, input.length))
      const lines = sliced.split('\n')
      return {
        line: lines.length,
        column: lines[lines.length - 1].length + 1,
      }
    }
  }

  // 匹配 Firefox/Safari 格式：... line 3 column 5
  const lineColMatch = errorMessage.match(/line\s+(\d+)\s+column\s+(\d+)/i)
  if (lineColMatch) {
    return {
      line: Number(lineColMatch[1]),
      column: Number(lineColMatch[2]),
    }
  }

  return {}
}

/**
 * 校验 JSON 字符串语法是否正确
 *
 * @param input - 待检查的 JSON 文本
 * @returns 校验结果与错误行列信息
 */
export function validateJson(input: string): {
  valid: boolean
  error?: string
  line?: number
  column?: number
} {
  const trimmed = input.trim()
  if (!trimmed) {
    return { valid: false, error: 'Empty JSON input', line: 1, column: 1 }
  }

  try {
    JSON.parse(trimmed)
    return { valid: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const loc = extractErrorLocation(message, trimmed)
    return {
      valid: false,
      error: message,
      ...loc,
    }
  }
}

/**
 * 格式化并美化 JSON 字符串
 *
 * @param input - 原始 JSON 文本
 * @param options - 缩进与排序配置
 * @returns 包含格式化结果或精确语法错误信息的对象
 */
export function formatJson(
  input: string,
  options: JsonFormatOptions = {},
): JsonProcessResult {
  const { indent = 2, sortKeys = false } = options
  const trimmed = input.trim()

  if (!trimmed) {
    return { ok: true, result: '' }
  }

  try {
    const parsed = JSON.parse(trimmed)
    const target = sortKeys ? sortJsonKeys(parsed) : parsed
    const space = indent === 'tab' ? '\t' : indent
    return {
      ok: true,
      result: JSON.stringify(target, null, space),
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const loc = extractErrorLocation(message, trimmed)
    return {
      ok: false,
      result: '',
      error: message,
      ...loc,
    }
  }
}

/**
 * 将 JSON 字符串压缩为无空白的单行紧凑格式
 *
 * @param input - 原始 JSON 文本
 * @returns 压缩结果或错误信息
 */
export function minifyJson(input: string): JsonProcessResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return { ok: true, result: '' }
  }

  try {
    const parsed = JSON.parse(trimmed)
    return {
      ok: true,
      result: JSON.stringify(parsed),
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const loc = extractErrorLocation(message, trimmed)
    return {
      ok: false,
      result: '',
      error: message,
      ...loc,
    }
  }
}
