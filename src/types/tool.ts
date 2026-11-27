/**
 * 工具分类标识
 * - encoding: 编码与格式化工具
 * - string: 字符串与文本工具
 * - dev: 开发实用工具
 */
export type ToolCategoryId = 'encoding' | 'string' | 'dev'

/**
 * 主题模式类型
 * - light: 浅色日间模式
 * - dark: 深色夜间模式
 * - system: 跟随系统主题
 */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * 支持的语言标识
 */
export type LocaleCode = 'zh-CN' | 'en-US'

/**
 * 单个工具的元数据定义
 */
export interface ToolMeta {
  /** 工具唯一标识（对应路由名称与 i18n 键名） */
  id: string
  /** 路由路径 */
  path: string
  /** 所属分类 */
  category: ToolCategoryId
  /** Lucide 图标名称 */
  icon: string
  /** 主题渐变色类名，用于卡片徽章与酷炫视觉效果 */
  gradient: string
  /** 搜索关键词列表（中英文混合，提升搜索命中率） */
  keywords: string[]
}

/**
 * 工具分类元数据定义
 */
export interface ToolCategoryMeta {
  /** 分类唯一标识 */
  id: ToolCategoryId
  /** 分类图标名称 */
  icon: string
}
