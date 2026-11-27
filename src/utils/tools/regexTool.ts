/**
 * 正则表达式测试、高亮分段、捕获组提取与文本替换工具模块
 */

export interface RegexMatchDetail {
  /** 匹配到的完整文本 */
  value: string
  /** 匹配起始索引（0-based） */
  index: number
  /** 匹配结束索引（不含） */
  endIndex: number
  /** 捕获组列表 */
  groups: string[]
  /** 命名捕获组（若有） */
  namedGroups?: Record<string, string>
}

export interface RegexSegment {
  /** 片段文本 */
  text: string
  /** 是否为正则匹配命中区域 */
  isMatch: boolean
  /** 若为命中区域，对应的匹配序号 */
  matchIndex?: number
}

export interface RegexTestResult {
  /** 正则表达式是否语法合法 */
  valid: boolean
  /** 语法错误详情 */
  error?: string
  /** 所有匹配明细 */
  matches: RegexMatchDetail[]
  /** 用于 UI 高亮渲染的文本分段 */
  segments: RegexSegment[]
  /** 执行替换后的文本（当传入 replacePattern 时） */
  replacedText?: string
}

export interface RegexPreset {
  /** 模板键名（对应 i18n） */
  key: string
  /** 正则表达式源码 */
  pattern: string
  /** 默认修饰符 */
  flags: string
  /** 默认测试文本示例 */
  sample: string
}

/** 常用正则表达式预设模板 */
export const REGEX_PRESETS: RegexPreset[] = [
  {
    key: 'email',
    pattern: '([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})',
    flags: 'g',
    sample: 'Contact us at hello@candytool.dev or support@example.com for help.',
  },
  {
    key: 'phoneCn',
    pattern: '1[3-9]\\d{9}',
    flags: 'g',
    sample: '客服电话：13800138000，备用联系号码：18612345678，无效号码：12345678901。',
  },
  {
    key: 'url',
    pattern: 'https?:\\/\\/[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-._~:/?#[\\]@!$&\'()*+,;=]*',
    flags: 'gi',
    sample: '访问 https://candytool.dev/tools/regex?lang=zh-CN 或 http://localhost:5173 测试链接。',
  },
  {
    key: 'ipv4',
    pattern: '\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b',
    flags: 'g',
    sample: 'Server IPs: 192.168.1.1, 10.0.0.255, invalid: 999.12.0.1',
  },
  {
    key: 'date',
    pattern: '(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])',
    flags: 'g',
    sample: '发布日期：2026-11-27，历史版本：2025-01-09，错误日期：2026-13-45',
  },
  {
    key: 'hexColor',
    pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b',
    flags: 'gi',
    sample: 'Candy palette: #ec4899, #8b5cf6, #06b6d4, #fff, invalid #12345',
  },
]

/**
 * 执行正则表达式匹配、生成高亮片段并计算替换预览
 *
 * @param pattern - 正则表达式字符串
 * @param flags - 修饰符（如 'gi'）
 * @param text - 待测试的源文本
 * @param replacePattern - 可选的替换模板
 * @returns 完整测试结果对象
 */
export function testRegex(
  pattern: string,
  flags: string,
  text: string,
  replacePattern?: string,
): RegexTestResult {
  if (!pattern) {
    return {
      valid: true,
      matches: [],
      segments: text ? [{ text, isMatch: false }] : [],
      replacedText: text,
    }
  }

  let regex: RegExp
  try {
    // 清理并规范化修饰符，防止重复字符报错
    const cleanFlags = Array.from(new Set(flags.split(''))).join('')
    regex = new RegExp(pattern, cleanFlags)
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : String(err),
      matches: [],
      segments: text ? [{ text, isMatch: false }] : [],
    }
  }

  const matches: RegexMatchDetail[] = []

  if (regex.global) {
    // 使用全局标志迭代所有匹配，并对零宽匹配推进 lastIndex 防止死循环
    let match: RegExpExecArray | null
    const maxMatches = 1000
    while ((match = regex.exec(text)) !== null && matches.length < maxMatches) {
      const value = match[0]
      matches.push({
        value,
        index: match.index,
        endIndex: match.index + value.length,
        groups: match.slice(1).map((g) => g ?? ''),
        namedGroups: match.groups ? { ...match.groups } : undefined,
      })
      if (value.length === 0) {
        regex.lastIndex += 1
      }
    }
  } else {
    const match = regex.exec(text)
    if (match) {
      matches.push({
        value: match[0],
        index: match.index,
        endIndex: match.index + match[0].length,
        groups: match.slice(1).map((g) => g ?? ''),
        namedGroups: match.groups ? { ...match.groups } : undefined,
      })
    }
  }

  // 根据匹配区间构建高亮分段数组
  const segments: RegexSegment[] = []
  let cursor = 0
  matches.forEach((m, idx) => {
    if (m.index > cursor) {
      segments.push({ text: text.slice(cursor, m.index), isMatch: false })
    }
    if (m.endIndex > m.index) {
      segments.push({ text: text.slice(m.index, m.endIndex), isMatch: true, matchIndex: idx })
    }
    cursor = Math.max(cursor, m.endIndex)
  })
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), isMatch: false })
  }

  let replacedText: string | undefined
  if (replacePattern !== undefined) {
    try {
      replacedText = text.replace(regex, replacePattern)
    } catch {
      replacedText = text
    }
  }

  return {
    valid: true,
    matches,
    segments,
    replacedText,
  }
}
