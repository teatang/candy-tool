/**
 * 时间戳转换与相对时间格式化工具模块
 */

export type TimestampUnit = 'auto' | 's' | 'ms'

export interface TimestampConversionResult {
  /** 是否转换成功 */
  ok: boolean
  /** 解析出的毫秒时间戳 */
  milliseconds?: number
  /** 秒级时间戳 */
  seconds?: number
  /** ISO 8601 标准时间字符串 */
  isoString?: string
  /** UTC 可读时间字符串 */
  utcString?: string
  /** 本地时区可读时间字符串 (YYYY-MM-DD HH:mm:ss) */
  localString?: string
  /** 错误代码 */
  error?: string
}

export interface DateConversionResult {
  /** 是否转换成功 */
  ok: boolean
  /** 秒级时间戳 */
  seconds?: number
  /** 毫秒级时间戳 */
  milliseconds?: number
  /** ISO 8601 字符串 */
  isoString?: string
  /** 错误代码 */
  error?: string
}

/**
 * 将 Date 对象格式化为直观的 YYYY-MM-DD HH:mm:ss(.SSS) 字符串
 *
 * @param date - Date 实例
 * @param useUtc - 是否按 UTC 时区输出
 * @param includeMs - 是否附带毫秒部分
 */
export function formatDateTime(date: Date, useUtc = false, includeMs = false): string {
  const pad = (num: number, len = 2) => String(num).padStart(len, '0')
  const year = useUtc ? date.getUTCFullYear() : date.getFullYear()
  const month = pad((useUtc ? date.getUTCMonth() : date.getMonth()) + 1)
  const day = pad(useUtc ? date.getUTCDate() : date.getDate())
  const hours = pad(useUtc ? date.getUTCHours() : date.getHours())
  const minutes = pad(useUtc ? date.getUTCMinutes() : date.getMinutes())
  const seconds = pad(useUtc ? date.getUTCSeconds() : date.getSeconds())

  const base = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  if (!includeMs) return base
  const ms = pad(useUtc ? date.getUTCMilliseconds() : date.getMilliseconds(), 3)
  return `${base}.${ms}`
}

/**
 * 将 Unix 时间戳转换为可读日期时间格式
 *
 * @param tsInput - 时间戳数值或字符串
 * @param unit - 单位：'auto'（自动根据位数判断）、's'（秒）、'ms'（毫秒）
 */
export function timestampToDate(
  tsInput: string | number,
  unit: TimestampUnit = 'auto',
): TimestampConversionResult {
  const raw = String(tsInput).trim()
  if (!raw || !/^-?\d+(\.\d+)?$/.test(raw)) {
    return { ok: false, error: 'INVALID_TIMESTAMP' }
  }

  const num = Number(raw)
  if (!Number.isFinite(num)) {
    return { ok: false, error: 'INVALID_TIMESTAMP' }
  }

  // 自动模式：绝对值大于等于 1e11（约 1973 年以后的毫秒位数）按毫秒处理，否则按秒处理
  let ms: number
  if (unit === 'ms') {
    ms = Math.trunc(num)
  } else if (unit === 's') {
    ms = Math.trunc(num * 1000)
  } else {
    ms = Math.abs(num) >= 1e11 ? Math.trunc(num) : Math.trunc(num * 1000)
  }

  const date = new Date(ms)
  if (Number.isNaN(date.getTime())) {
    return { ok: false, error: 'INVALID_TIMESTAMP' }
  }

  return {
    ok: true,
    milliseconds: ms,
    seconds: Math.floor(ms / 1000),
    isoString: date.toISOString(),
    utcString: formatDateTime(date, true, true),
    localString: formatDateTime(date, false, true),
  }
}

/**
 * 将日期时间字符串转换为 Unix 时间戳
 *
 * @param dateInput - 日期时间字符串（支持 ISO 8601 或 YYYY-MM-DD HH:mm:ss）
 */
export function dateToTimestamp(dateInput: string): DateConversionResult {
  const raw = dateInput.trim()
  if (!raw) {
    return { ok: false, error: 'INVALID_DATE' }
  }

  // 兼容将 "YYYY-MM-DD HH:mm:ss" 视作本地时间解析
  const normalized = /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(:\d{2})?(\.\d+)?$/.test(raw)
    ? raw.replace(/\s+/, 'T')
    : raw

  const date = new Date(normalized)
  const ms = date.getTime()
  if (Number.isNaN(ms)) {
    return { ok: false, error: 'INVALID_DATE' }
  }

  return {
    ok: true,
    milliseconds: ms,
    seconds: Math.floor(ms / 1000),
    isoString: date.toISOString(),
  }
}

/**
 * 计算并格式化相对时间描述（如 "5 分钟前" 或 "2 hours ago"）
 *
 * @param targetMs - 目标时间戳（毫秒）
 * @param nowMs - 参考当前时间戳（毫秒）
 * @param locale - 语言代码
 */
export function formatRelativeTime(
  targetMs: number,
  nowMs: number = Date.now(),
  locale: 'zh-CN' | 'en-US' = 'zh-CN',
): string {
  const diffSeconds = Math.round((targetMs - nowMs) / 1000)
  const absSeconds = Math.abs(diffSeconds)

  if (absSeconds < 5) {
    return locale === 'zh-CN' ? '刚刚' : 'just now'
  }

  const isFuture = diffSeconds > 0
  const units: Array<{ limit: number; divisor: number; zh: string; en: string }> = [
    { limit: 60, divisor: 1, zh: '秒', en: 'second' },
    { limit: 3600, divisor: 60, zh: '分钟', en: 'minute' },
    { limit: 86400, divisor: 3600, zh: '小时', en: 'hour' },
    { limit: 2592000, divisor: 86400, zh: '天', en: 'day' },
    { limit: 31536000, divisor: 2592000, zh: '个月', en: 'month' },
    { limit: Infinity, divisor: 31536000, zh: '年', en: 'year' },
  ]

  for (const unit of units) {
    if (absSeconds < unit.limit) {
      const value = Math.floor(absSeconds / unit.divisor)
      if (locale === 'zh-CN') {
        return `${value} ${unit.zh}${isFuture ? '后' : '前'}`
      }
      const plural = value > 1 ? 's' : ''
      return isFuture ? `in ${value} ${unit.en}${plural}` : `${value} ${unit.en}${plural} ago`
    }
  }
  return ''
}
