import type { ToolCategoryMeta, ToolMeta } from '@/types/tool'

/**
 * 工具分类配置列表
 * 决定左侧导航栏与首页卡片的分组顺序
 */
export const TOOL_CATEGORIES: ToolCategoryMeta[] = [
  {
    id: 'encoding',
    icon: 'Code2',
  },
  {
    id: 'string',
    icon: 'Sparkles',
  },
  {
    id: 'dev',
    icon: 'Wrench',
  },
]

/**
 * 糖果工具全量注册表
 * 新增工具只需在此数组添加元数据并在路由中注册即可
 */
export const TOOLS: ToolMeta[] = [
  // ======================== 编码工具 ========================
  {
    id: 'base64',
    path: '/tools/base64',
    category: 'encoding',
    icon: 'Binary',
    gradient: 'from-pink-500 via-rose-500 to-orange-400',
    keywords: ['base64', 'encode', 'decode', '编码', '解码', 'utf8', 'urlsafe'],
  },
  {
    id: 'url',
    path: '/tools/url',
    category: 'encoding',
    icon: 'Link2',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    keywords: ['url', 'uri', 'encode', 'decode', 'query', '参数', '链接', '编码', '解码'],
  },
  {
    id: 'json',
    path: '/tools/json',
    category: 'encoding',
    icon: 'Braces',
    gradient: 'from-cyan-500 via-sky-500 to-blue-500',
    keywords: ['json', 'format', 'lint', 'validate', 'minify', '格式化', '校验', '压缩'],
  },
  {
    id: 'html',
    path: '/tools/html',
    category: 'encoding',
    icon: 'FileCode2',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    keywords: ['html', 'xml', 'format', 'minify', 'compress', '格式化', '压缩', '网页'],
  },
  {
    id: 'sql',
    path: '/tools/sql',
    category: 'encoding',
    icon: 'Database',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    keywords: ['sql', 'mysql', 'postgresql', 'format', 'minify', '数据库', '格式化', '压缩'],
  },

  // ======================== 字符串工具 ========================
  {
    id: 'regex',
    path: '/tools/regex',
    category: 'string',
    icon: 'Regex',
    gradient: 'from-fuchsia-500 via-pink-500 to-rose-500',
    keywords: ['regex', 'regexp', 'regular expression', 'match', 'replace', '正则', '匹配', '替换'],
  },
  {
    id: 'mermaid',
    path: '/tools/mermaid',
    category: 'string',
    icon: 'GitFork',
    gradient: 'from-indigo-500 via-blue-500 to-cyan-400',
    keywords: ['mermaid', 'diagram', 'flowchart', 'sequence', 'chart', '流程图', '时序图', '图表'],
  },

  // ======================== 其他开发工具 ========================
  {
    id: 'timestamp',
    path: '/tools/timestamp',
    category: 'dev',
    icon: 'Clock',
    gradient: 'from-sky-500 via-indigo-500 to-purple-500',
    keywords: ['timestamp', 'unix', 'date', 'time', 'epoch', '时间戳', '日期', '转换'],
  },
  {
    id: 'uuid',
    path: '/tools/uuid',
    category: 'dev',
    icon: 'Fingerprint',
    gradient: 'from-teal-500 via-emerald-500 to-green-500',
    keywords: ['uuid', 'guid', 'v4', 'v7', 'id', '唯一标识', '生成器'],
  },
  {
    id: 'crypto',
    path: '/tools/crypto',
    category: 'dev',
    icon: 'ShieldCheck',
    gradient: 'from-rose-500 via-pink-600 to-purple-600',
    keywords: ['md5', 'sha', 'sha1', 'sha256', 'sha512', 'hmac', 'hash', '加密', '摘要', '哈希'],
  },
]

/**
 * 根据工具 ID 获取工具元数据
 *
 * @param id - 工具唯一标识
 * @returns 匹配的工具元数据，未找到时返回 undefined
 */
export function getToolById(id: string): ToolMeta | undefined {
  return TOOLS.find((tool) => tool.id === id)
}

/**
 * 按分类获取工具列表
 *
 * @param category - 分类 ID
 * @returns 该分类下的工具列表
 */
export function getToolsByCategory(category: ToolCategoryMeta['id']): ToolMeta[] {
  return TOOLS.filter((tool) => tool.category === category)
}
