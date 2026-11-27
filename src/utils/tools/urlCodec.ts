/**
 * URL 编码、解码与 Query 参数解析工具模块
 */

export type UrlEncodeMode = 'component' | 'full'

export interface QueryParamItem {
  /** 参数键名 */
  key: string
  /** 参数值 */
  value: string
}

/**
 * 对字符串进行 URL 编码
 *
 * @param input - 待编码的文本或 URL
 * @param mode - 编码模式：'component' 使用 encodeURIComponent；'full' 使用 encodeURI
 * @returns 编码后的字符串
 */
export function encodeUrl(input: string, mode: UrlEncodeMode = 'component'): string {
  if (!input) return ''
  return mode === 'full' ? encodeURI(input) : encodeURIComponent(input)
}

/**
 * 对 URL 编码字符串进行解码
 *
 * @param input - 待解码的字符串
 * @param mode - 解码模式：'component' 使用 decodeURIComponent；'full' 使用 decodeURI
 * @returns 解码后的字符串
 * @throws 当存在不完整或非法的百分号转义序列时抛出错误
 */
export function decodeUrl(input: string, mode: UrlEncodeMode = 'component'): string {
  if (!input) return ''
  return mode === 'full' ? decodeURI(input) : decodeURIComponent(input)
}

/**
 * 从 URL 或查询字符串中解析出所有 Query 参数键值对
 *
 * @param input - 完整 URL（如 https://example.com?a=1&b=2）或纯查询字符串（如 a=1&b=2）
 * @returns 解析出的键值对数组
 */
export function parseUrlParams(input: string): QueryParamItem[] {
  const trimmed = input.trim()
  if (!trimmed) return []

  let queryString = ''
  const questionMarkIndex = trimmed.indexOf('?')
  if (questionMarkIndex !== -1) {
    queryString = trimmed.slice(questionMarkIndex + 1)
    // 移除 URL hash 锚点部分
    const hashIndex = queryString.indexOf('#')
    if (hashIndex !== -1) {
      queryString = queryString.slice(0, hashIndex)
    }
  } else if (trimmed.includes('=')) {
    queryString = trimmed.startsWith('?') ? trimmed.slice(1) : trimmed
  }

  if (!queryString) return []

  const searchParams = new URLSearchParams(queryString)
  const items: QueryParamItem[] = []
  searchParams.forEach((value, key) => {
    items.push({ key, value })
  })
  return items
}
