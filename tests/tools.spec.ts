import { describe, expect, it } from 'vitest'
import { encodeBase64, decodeBase64 } from '@/utils/tools/base64'
import { encodeUrl, decodeUrl, parseUrlParams } from '@/utils/tools/urlCodec'
import { formatJson, minifyJson, validateJson } from '@/utils/tools/jsonTool'
import { formatHtml, minifyHtml } from '@/utils/tools/htmlTool'
import { formatSql, minifySql } from '@/utils/tools/sqlTool'
import { testRegex, REGEX_PRESETS } from '@/utils/tools/regexTool'
import { MERMAID_TEMPLATES, normalizeMermaidCode } from '@/utils/tools/mermaidTool'
import {
  timestampToDate,
  dateToTimestamp,
  formatRelativeTime,
} from '@/utils/tools/timestampTool'
import { generateUuidBatch } from '@/utils/tools/uuidTool'
import { computeHash, computeAllHashes, computeHmac } from '@/utils/tools/cryptoTool'

describe('Base64 编解码工具测试', () => {
  it('支持标准 ASCII 与中文 UTF-8 双向编解码', () => {
    const raw = '糖果工具 Candy Tool 🍬!'
    const encoded = encodeBase64(raw)
    expect(encoded).toBe('57OW5p6c5bel5YW3IENhbmR5IFRvb2wg8J+NrCE=')
    expect(decodeBase64(encoded)).toBe(raw)
  })

  it('支持 URL-Safe 模式编解码', () => {
    const raw = 'subjects?_d=1&name=糖果+工具/测试'
    const encoded = encodeBase64(raw, true)
    expect(encoded).not.toContain('+')
    expect(encoded).not.toContain('/')
    expect(encoded).not.toContain('=')
    expect(decodeBase64(encoded, true)).toBe(raw)
  })

  it('空字符串返回空字符串，非法 Base64 抛出错误', () => {
    expect(encodeBase64('')).toBe('')
    expect(decodeBase64('')).toBe('')
    expect(() => decodeBase64('@@@invalid###')).toThrow('INVALID_BASE64')
  })
})

describe('URL 编解码与参数解析测试', () => {
  it('支持 component 与 full 模式编解码', () => {
    const raw = 'https://candy.dev/search?q=糖果 工具&tag=a/b'
    const comp = encodeUrl(raw, 'component')
    expect(comp).toContain('%3A%2F%2F')
    expect(decodeUrl(comp, 'component')).toBe(raw)

    const full = encodeUrl(raw, 'full')
    expect(full.startsWith('https://candy.dev/search?q=')).toBe(true)
    expect(decodeUrl(full, 'full')).toBe(raw)
  })

  it('能够准确解析 URL 查询参数并忽略 hash', () => {
    const params = parseUrlParams('https://example.com/path?foo=bar&lang=zh-CN#section1')
    expect(params).toEqual([
      { key: 'foo', value: 'bar' },
      { key: 'lang', value: 'zh-CN' },
    ])
    expect(parseUrlParams('https://example.com')).toEqual([])
  })
})

describe('JSON 格式化、压缩与语法检查测试', () => {
  it('能够格式化、排序键名并压缩 JSON', () => {
    const raw = '{"b":1,"a":{"d":true,"c":"hi"}}'
    const formatted = formatJson(raw, { indent: 2, sortKeys: true })
    expect(formatted.ok).toBe(true)
    expect(formatted.result).toBe('{\n  "a": {\n    "c": "hi",\n    "d": true\n  },\n  "b": 1\n}')

    const minified = minifyJson(formatted.result)
    expect(minified.ok).toBe(true)
    expect(minified.result).toBe('{"a":{"c":"hi","d":true},"b":1}')
  })

  it('能够检测 JSON 语法错误并给出行列定位', () => {
    const invalid = '{\n  "name": "candy",\n  "bad": \n}'
    const check = validateJson(invalid)
    expect(check.valid).toBe(false)
    expect(check.error).toBeTruthy()

    const fmtRes = formatJson(invalid)
    expect(fmtRes.ok).toBe(false)
    expect(fmtRes.error).toBeTruthy()
  })
})

describe('HTML 格式化与压缩测试', () => {
  it('能够格式化与压缩 HTML 并可选保留或移除注释', () => {
    const messy = '<div><!-- comment --><p>Hello   <span>Candy</span></p></div>'
    const formatted = formatHtml(messy, 2)
    expect(formatted).toContain('\n')
    expect(formatted).toContain('<p>')

    const minified = minifyHtml(formatted, true)
    expect(minified).toBe('<div><p>Hello <span>Candy</span></p></div>')

    const withComment = minifyHtml(formatted, false)
    expect(withComment).toContain('<!-- comment -->')
  })

  it('压缩时保留 pre 标签内部空白', () => {
    const html = '<div>  <pre>line 1\n  line 2</pre>  </div>'
    expect(minifyHtml(html)).toBe('<div><pre>line 1\n  line 2</pre></div>')
  })
})

describe('SQL 格式化与压缩测试', () => {
  it('能够格式化多方言 SQL 语句', () => {
    const raw = "select id, name from users where status = 'active' order by created_at desc"
    const formatted = formatSql(raw, { language: 'mysql', keywordCase: 'upper' })
    expect(formatted).toContain('SELECT')
    expect(formatted).toContain('FROM')
    expect(formatted).toContain('\n')
  })

  it('压缩 SQL 时去除注释并保留字符串字面量内部空格', () => {
    const sql = `
      -- 用户查询语句
      SELECT id, 'hello   world' AS greeting
      /* 块级注释 */
      FROM users
      WHERE name = 'Alice'
    `
    const minified = minifySql(sql)
    expect(minified).toBe("SELECT id, 'hello   world' AS greeting FROM users WHERE name = 'Alice'")
  })
})

describe('正则表达式测试工具测试', () => {
  it('能够正确提取匹配项、捕获组、高亮片段及替换文本', () => {
    const res = testRegex('(\\w+)@(\\w+\\.com)', 'g', 'Mail: foo@bar.com and baz@qux.com', '$1 [at] $2')
    expect(res.valid).toBe(true)
    expect(res.matches).toHaveLength(2)
    expect(res.matches[0].groups).toEqual(['foo', 'bar.com'])
    expect(res.segments.some((s) => s.isMatch && s.text === 'foo@bar.com')).toBe(true)
    expect(res.replacedText).toBe('Mail: foo [at] bar.com and baz [at] qux.com')
  })

  it('能优雅处理非法正则表达式而不崩溃', () => {
    const res = testRegex('[unclosed(', 'g', 'abc')
    expect(res.valid).toBe(false)
    expect(res.error).toBeTruthy()
  })

  it('内置正则模板均能合法编译并匹配自带示例', () => {
    for (const preset of REGEX_PRESETS) {
      const res = testRegex(preset.pattern, preset.flags, preset.sample)
      expect(res.valid).toBe(true)
      expect(res.matches.length).toBeGreaterThan(0)
    }
  })
})

describe('Mermaid 工具模板测试', () => {
  it('内置模板包含多种常见图表且内容非空', () => {
    expect(MERMAID_TEMPLATES.length).toBeGreaterThanOrEqual(5)
    for (const tpl of MERMAID_TEMPLATES) {
      expect(normalizeMermaidCode(tpl.code).length).toBeGreaterThan(10)
    }
  })
})

describe('时间戳转换工具测试', () => {
  it('支持自动识别秒级与毫秒级时间戳转换', () => {
    const secRes = timestampToDate('1700000000', 'auto')
    expect(secRes.ok).toBe(true)
    expect(secRes.seconds).toBe(1700000000)
    expect(secRes.milliseconds).toBe(1700000000000)
    expect(secRes.isoString).toBe('2023-11-14T22:13:20.000Z')

    const msRes = timestampToDate('1700000000123', 'auto')
    expect(msRes.ok).toBe(true)
    expect(msRes.milliseconds).toBe(1700000000123)
  })

  it('支持日期字符串转时间戳及相对时间格式化', () => {
    const dateRes = dateToTimestamp('2026-11-27T00:00:00.000Z')
    expect(dateRes.ok).toBe(true)
    expect(dateRes.milliseconds).toBe(Date.parse('2026-11-27T00:00:00.000Z'))

    expect(formatRelativeTime(10000, 10000, 'zh-CN')).toBe('刚刚')
    expect(formatRelativeTime(0, 120000, 'zh-CN')).toBe('2 分钟前')
    expect(formatRelativeTime(120000, 0, 'en-US')).toBe('in 2 minutes')
  })

  it('非法时间戳和日期返回 ok: false', () => {
    expect(timestampToDate('not-a-number').ok).toBe(false)
    expect(dateToTimestamp('not-a-date').ok).toBe(false)
  })
})

describe('UUID 生成器测试', () => {
  it('支持批量生成 UUID v4 和 v7 并应用格式选项', () => {
    const v4List = generateUuidBatch({ version: 'v4', count: 5 })
    expect(v4List).toHaveLength(5)
    expect(new Set(v4List).size).toBe(5)
    expect(v4List[0]).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)

    const v7Custom = generateUuidBatch({
      version: 'v7',
      count: 2,
      uppercase: true,
      hyphens: false,
      braces: true,
    })
    expect(v7Custom[0]).toMatch(/^\{[0-9A-F]{32}\}$/)

    const nilList = generateUuidBatch({ version: 'nil', count: 1 })
    expect(nilList[0]).toBe('00000000-0000-0000-0000-000000000000')
  })
})

describe('MD5 / SHA / HMAC 加密工具测试', () => {
  it('计算标准 MD5、SHA1、SHA256、SHA512 摘要准确', () => {
    const hashes = computeAllHashes('candy-tool')
    expect(hashes.MD5).toHaveLength(32)
    expect(hashes.SHA1).toHaveLength(40)
    expect(hashes.SHA256).toHaveLength(64)
    expect(hashes.SHA512).toHaveLength(128)
    expect(computeHash('abc', 'MD5')).toBe('900150983cd24fb0d6963f7d28e17f72')
    expect(computeHash('abc', 'SHA256', true)).toBe(
      'BA7816BF8F01CFEA414140DE5DAE2223B00361A396177A9CB410FF61F20015AD',
    )
  })

  it('能够计算带密钥的 HMAC 签名', () => {
    const sig = computeHmac('message', 'secret-key', 'HmacSHA256')
    expect(sig).toHaveLength(64)
    expect(sig).not.toBe(computeHash('message', 'SHA256'))
  })
})
