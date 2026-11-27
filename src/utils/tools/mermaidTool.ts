/**
 * Mermaid 图表模板与辅助工具模块
 */

export interface MermaidTemplate {
  /** 模板键名（对应 i18n） */
  key: string
  /** Mermaid 语法源码 */
  code: string
}

/** 内置丰富多样的 Mermaid 图表示例模板 */
export const MERMAID_TEMPLATES: MermaidTemplate[] = [
  {
    key: 'flowchart',
    code: `flowchart LR
  A["🍬 用户访问糖果工具"] --> B{"选择工具分类"}
  B -->|编码工具| C["JSON / HTML / SQL / Base64"]
  B -->|字符串工具| D["正则测试 / Mermaid 绘图"]
  B -->|开发工具| E["时间戳 / UUID / MD5-SHA"]
  C --> F["✨ 100% 本地极速处理"]
  D --> F
  E --> F`,
  },
  {
    key: 'sequence',
    code: `sequenceDiagram
  autonumber
  participant U as 开发者
  participant UI as Candy Tool 前端
  participant Worker as 本地计算引擎
  U->>UI: 输入待处理文本
  UI->>Worker: 调用工具函数 (UTF-8 / Crypto)
  Worker-->>UI: 返回格式化或加密结果
  UI-->>U: 丝滑动画展示并支持一键复制`,
  },
  {
    key: 'classDiagram',
    code: `classDiagram
  class CandyTool {
    +String id
    +String category
    +String gradient
    +execute(input) Result
  }
  class EncodingTool {
    +encode(text) String
    +decode(text) String
  }
  class CryptoTool {
    +hash(text, algo) String
    +hmac(text, key) String
  }
  CandyTool <|-- EncodingTool
  CandyTool <|-- CryptoTool`,
  },
  {
    key: 'stateDiagram',
    code: `stateDiagram-v2
  [*] --> Idle: 等待输入
  Idle --> Validating: 用户输入代码
  Validating --> Rendered: 语法正确
  Validating --> Error: 语法异常
  Error --> Validating: 修复语法
  Rendered --> Exported: 导出 SVG / PNG
  Exported --> [*]`,
  },
  {
    key: 'erDiagram',
    code: `erDiagram
  USER ||--o{ FAVORITE : collects
  TOOL ||--o{ FAVORITE : belongs_to
  CATEGORY ||--|{ TOOL : contains
  USER {
    string id PK
    string theme
    string locale
  }
  TOOL {
    string id PK
    string path
    string category
  }`,
  },
  {
    key: 'gantt',
    code: `gantt
  title Candy Tool 开发里程碑
  dateFormat  YYYY-MM-DD
  section 基础架构
  Vue3 + TS + Pinia 搭建 :done, a1, 2026-11-20, 2d
  shadcn-vue + 主题动效  :done, a2, after a1, 2d
  section 核心工具
  编码与格式化套件       :active, b1, after a2, 2d
  正则与 Mermaid 工作室  :b2, after b1, 2d`,
  },
  {
    key: 'mindmap',
    code: `mindmap
  root((🍬 糖果工具))
    编码工具
      Base64 编解码
      URL 编解码
      JSON 格式化
      HTML 美化压缩
      SQL 格式化
    字符串工具
      正则表达式测试
      Mermaid 编辑器
    开发工具
      时间戳转换
      UUID 生成器
      MD5 / SHA 加密`,
  },
]

/**
 * 预处理 Mermaid 代码，去除首尾空白并校验非空
 *
 * @param code - 用户输入的 Mermaid 文本
 * @returns 清理后的代码
 */
export function normalizeMermaidCode(code: string): string {
  return code.trim()
}
