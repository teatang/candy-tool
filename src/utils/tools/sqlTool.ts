import { format as sqlFormatter, type SqlLanguage } from 'sql-formatter'

/**
 * SQL 格式化与压缩工具模块
 */

export type { SqlLanguage }

export interface SqlFormatOptions {
  /** SQL 方言（如 sql, mysql, postgresql, sqlite, tsql 等） */
  language?: SqlLanguage
  /** 缩进空格数，默认 2 */
  tabWidth?: number
  /** 关键字大小写风格 */
  keywordCase?: 'upper' | 'lower' | 'preserve'
}

/**
 * 格式化并美化 SQL 语句
 *
 * @param input - 原始 SQL 语句
 * @param options - 方言与排版配置
 * @returns 排版后的 SQL 字符串
 */
export function formatSql(input: string, options: SqlFormatOptions = {}): string {
  const trimmed = input.trim()
  if (!trimmed) return ''

  const { language = 'sql', tabWidth = 2, keywordCase = 'upper' } = options

  return sqlFormatter(trimmed, {
    language,
    tabWidth,
    keywordCase,
    linesBetweenQueries: 2,
  })
}

/**
 * 压缩 SQL 语句为单行紧凑形式，同时安全保留单引号/双引号/反引号内的字符串内容
 *
 * @param input - 原始 SQL 语句
 * @returns 压缩后的单行 SQL
 */
export function minifySql(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ''

  let result = ''
  let i = 0
  let inSingleQuote = false
  let inDoubleQuote = false
  let inBacktick = false
  let lastWasSpace = false

  while (i < trimmed.length) {
    const ch = trimmed[i]
    const next = trimmed[i + 1]

    // 处理单引号字符串（支持 '' 与 \' 转义）
    if (inSingleQuote) {
      result += ch
      if (ch === '\\' && next !== undefined) {
        result += next
        i += 2
        continue
      }
      if (ch === "'" && next === "'") {
        result += next
        i += 2
        continue
      }
      if (ch === "'") inSingleQuote = false
      i += 1
      lastWasSpace = false
      continue
    }

    // 处理双引号标识符/字符串
    if (inDoubleQuote) {
      result += ch
      if (ch === '"') inDoubleQuote = false
      i += 1
      lastWasSpace = false
      continue
    }

    // 处理反引号标识符
    if (inBacktick) {
      result += ch
      if (ch === '`') inBacktick = false
      i += 1
      lastWasSpace = false
      continue
    }

    // 跳过单行注释 -- ...
    if (ch === '-' && next === '-') {
      while (i < trimmed.length && trimmed[i] !== '\n') {
        i += 1
      }
      continue
    }

    // 跳过块级注释 /* ... */
    if (ch === '/' && next === '*') {
      i += 2
      while (i < trimmed.length && !(trimmed[i] === '*' && trimmed[i + 1] === '/')) {
        i += 1
      }
      i += 2
      continue
    }

    if (ch === "'") {
      inSingleQuote = true
      result += ch
      lastWasSpace = false
      i += 1
      continue
    }
    if (ch === '"') {
      inDoubleQuote = true
      result += ch
      lastWasSpace = false
      i += 1
      continue
    }
    if (ch === '`') {
      inBacktick = true
      result += ch
      lastWasSpace = false
      i += 1
      continue
    }

    // 折叠空白符
    if (/\s/.test(ch)) {
      if (!lastWasSpace && result.length > 0) {
        result += ' '
        lastWasSpace = true
      }
      i += 1
      continue
    }

    result += ch
    lastWasSpace = false
    i += 1
  }

  return result.trim()
}
