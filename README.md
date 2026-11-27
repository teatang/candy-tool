# 🍬 糖果工具 (Candy Tool)

<p align="center">
  <strong>简约酷炫、100% 本地运行的现代开发者工具集合</strong>
</p>

<p align="center">
  <a href="#简体中文">简体中文</a> | <a href="#english">English</a>
</p>

---

<a id="简体中文"></a>

## 📖 项目简介

**糖果工具（Candy Tool）** 是一个基于 **Vue 3 + TypeScript + Vite + Tailwind CSS + shadcn-vue** 打造的现代开发者效率工具网站。界面设计融合玻璃拟态、糖果流光动效与响应式布局，所有工具均在浏览器本地计算执行，绝不上传用户数据。

## ✨ 核心特性

- 🎨 **简约酷炫视觉与动效**：配备流光渐变 Hero 首页、悬浮糖果动效卡片与丝滑路由切换过渡动画
- 🌗 **多主题切换**：支持 **日间模式 / 夜间模式 / 跟随系统** 三态切换并自动持久化
- 📱 **全端响应式设计**：桌面端支持可折叠左侧分类导航栏与 `⌘K / Ctrl+K` 快捷搜索，移动端自动切换为抽屉式菜单
- 🌐 **中英双语国际化 (i18n)**：内置 `vue-i18n`，默认简体中文，支持一键切换英文界面
- ⭐ **收藏与最近使用**：支持收藏常用工具，左侧栏置顶展示，提升日常检索效率
- 🧪 **完备单元测试**：核心工具函数、Pinia 状态管理与路由/首页均配有 `Vitest` 单元测试

## 🧰 内置工具清单

### 1. 编码工具
- **Base64 编解码**：支持 UTF-8 中文安全转换与 URL-Safe (`-` / `_`) 模式
- **URL 编解码**：支持 `encodeURIComponent` 与 `encodeURI` 双模式，自动拆解 Query 参数列表
- **JSON 格式化与检查**：支持 2/4 空格及 Tab 缩进、键名排序、极致压缩与语法错误行列定位
- **HTML 格式化与压缩**：HTML 智能缩进美化，压缩时可选择移除注释并保护 `<pre>`/`<textarea>` 内容
- **SQL 格式化与压缩**：支持 Standard SQL、MySQL、PostgreSQL、SQLite、T-SQL 方言排版与单行压缩

### 2. 字符串工具
- **正则表达式测试**：实时高亮匹配区间、拆解捕获组、文本替换预览及常用正则模板
- **Mermaid 图表编辑器**：支持流程图、时序图、类图、状态图、ER 图、甘特图与思维导图，支持缩放与导出 SVG / PNG

### 3. 开发工具
- **时间戳转换**：实时 Unix 秒/毫秒时钟看板，支持时间戳与本地/UTC/ISO 日期双向转换及相对时间计算
- **UUID 生成器**：支持 UUID v4、时间有序 UUID v7 与 NIL 批量生成，支持大小写、连字符与花括号格式定制
- **MD5 / SHA 加密工具**：实时计算 MD5、SHA-1、SHA-256、SHA-512、SHA-3 与带密钥的 HMAC 摘要

## 🛠️ 技术栈

- **框架**：Vue 3 (Composition API) + TypeScript
- **路由与状态**：Vue Router 4 + Pinia
- **UI 与样式**：shadcn-vue (`reka-ui` + `class-variance-authority`) + Tailwind CSS v4 + `lucide-vue-next`
- **国际化**：vue-i18n (默认 `zh-CN`，支持 `en-US`)
- **测试**：Vitest + `@vue/test-utils` + jsdom
- **包管理**：pnpm

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 运行所有单元测试
pnpm test

# 类型检查与生产构建
pnpm build
```

## 📄 开源协议

本项目基于 [MIT License](./LICENSE) 协议开源。

---

<a id="english"></a>

## 📖 Overview

**Candy Tool (糖果工具)** is a sleek, responsive, 100% client-side developer toolkit built with **Vue 3, TypeScript, Vite, Tailwind CSS, and shadcn-vue**. All conversions, formatting, diagram rendering, and cryptographic hashing happen locally inside your browser—nothing is ever sent to a server.

## ✨ Key Features

- 🎨 **Sleek UI & Animations**: Animated aurora gradients, floating candy cards, glassmorphism, and smooth route transitions
- 🌗 **Adaptive Theme Modes**: Switch seamlessly between **Light**, **Dark**, and **Follow System** modes
- 📱 **Responsive Layout**: Collapsible categorized sidebar with `⌘K / Ctrl+K` search on desktop and a slide-out drawer on mobile
- 🌐 **Bilingual i18n**: Powered by `vue-i18n` with Simplified Chinese (`zh-CN`) as default and instant English (`en-US`) switching
- ⭐ **Favorites & Quick Access**: Pin frequently used tools to the top of the sidebar
- 🧪 **Unit Tested**: Core tool modules, Pinia store, and views are verified with `Vitest`

## 🧰 Included Tools

### 1. Encoding & Formatting
- **Base64 Encoder / Decoder**: UTF-8 safe encoding/decoding with URL-Safe (`-` / `_`) toggle
- **URL Encoder / Decoder**: Supports `encodeURIComponent` / `encodeURI` modes and automatic Query Parameter parsing
- **JSON Formatter & Validator**: Configurable indentation (2/4 spaces, Tab), key sorting, minification, and line/column error reporting
- **HTML Formatter & Minifier**: Beautifies HTML and minifies markup with optional comment stripping while preserving `<pre>`/`<textarea>`
- **SQL Formatter & Minifier**: Multi-dialect formatting (SQL, MySQL, PostgreSQL, SQLite, T-SQL) and comment-stripping single-line compression

### 2. String & Diagram
- **RegEx Tester**: Live match highlighting, capture group breakdown, replacement preview, and common regex presets
- **Mermaid Diagram Studio**: Real-time rendering for flowcharts, sequence, class, state, ER, Gantt, and mindmaps with zoom and SVG / PNG export

### 3. Developer Utilities
- **Timestamp Converter**: Live Unix clock (seconds & ms), bi-directional timestamp/date conversion across Local/UTC/ISO formats, and relative time
- **UUID Generator**: Batch generate UUID v4, time-ordered v7, and NIL UUIDs with casing, hyphen, and brace customization
- **MD5 / SHA Hasher**: Instant MD5, SHA-1, SHA-256, SHA-512, SHA-3, and keyed HMAC digest calculation

## 🛠️ Tech Stack

- **Core**: Vue 3 + TypeScript + Vite
- **Routing & State**: Vue Router 4 + Pinia
- **UI & Styling**: shadcn-vue (`reka-ui` + `class-variance-authority`) + Tailwind CSS v4 + `lucide-vue-next`
- **i18n**: vue-i18n (`zh-CN` default, `en-US`)
- **Testing**: Vitest + `@vue/test-utils` + jsdom
- **Package Manager**: pnpm

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run all unit tests
pnpm test

# Type-check and build for production
pnpm build
```

## 📄 License

This project is open-sourced under the [MIT License](./LICENSE).
