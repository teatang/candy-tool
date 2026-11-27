import { NIL as NIL_UUID, v4 as uuidv4, v7 as uuidv7 } from 'uuid'

/**
 * UUID 批量生成与格式化工具模块
 */

export type UuidVersion = 'v4' | 'v7' | 'nil'

export interface UuidGenerateOptions {
  /** UUID 版本类型 */
  version: UuidVersion
  /** 生成数量（1 ~ 100） */
  count: number
  /** 是否转为大写字母 */
  uppercase?: boolean
  /** 是否保留连字符 '-' */
  hyphens?: boolean
  /** 是否包裹花括号 '{}' */
  braces?: boolean
}

/**
 * 根据指定配置批量生成 UUID 列表
 *
 * @param options - UUID 版本、数量与格式选项
 * @returns 格式化后的 UUID 字符串数组
 */
export function generateUuidBatch(options: UuidGenerateOptions): string[] {
  const {
    version = 'v4',
    count = 5,
    uppercase = false,
    hyphens = true,
    braces = false,
  } = options

  // 限制单次批量数量在 1 到 100 之间，保证页面流畅
  const safeCount = Math.min(Math.max(Math.trunc(count) || 1, 1), 100)
  const results: string[] = []

  for (let i = 0; i < safeCount; i += 1) {
    let raw: string
    if (version === 'v7') {
      raw = uuidv7()
    } else if (version === 'nil') {
      raw = NIL_UUID
    } else {
      raw = uuidv4()
    }

    let formatted = hyphens ? raw : raw.replace(/-/g, '')
    formatted = uppercase ? formatted.toUpperCase() : formatted.toLowerCase()
    if (braces) {
      formatted = `{${formatted}}`
    }
    results.push(formatted)
  }

  return results
}
