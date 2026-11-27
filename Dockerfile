# ==============================================================================
# Stage 1: 构建糖果工具 (Candy Tool) Vue 3 前端静态资源
# 使用 --platform=$BUILDPLATFORM 在宿主机原生架构上高速完成 Node/Vite 构建，
# 避免多架构打包时在 QEMU 模拟环境下运行 pnpm install / vue-tsc 出现性能损耗或异常
# ==============================================================================
FROM --platform=$BUILDPLATFORM node:22-alpine AS builder

# 安装与锁文件一致的 pnpm v10（避免 corepack 签名校验或 pnpm@latest 主版本不兼容问题）
RUN npm install -g pnpm@10

WORKDIR /app

# 优先仅拷贝依赖清单文件，最大化利用 Docker 构建层缓存
COPY package.json pnpm-lock.yaml ./

# 严格按锁文件安装依赖，并跳过 simple-git-hooks 等本地 Git 钩子脚本
RUN pnpm install --frozen-lockfile --ignore-scripts

# 拷贝项目源码（由 .dockerignore 排除 node_modules、.git、dist 等无关目录）
COPY . .

# 执行 TypeScript 类型检查与 Vite 生产构建
RUN pnpm build

# ==============================================================================
# Stage 2: 使用轻量级 Nginx 镜像托管静态站点（输出 amd64 / arm64 多架构镜像）
# ==============================================================================
FROM nginx:alpine AS runner

# 拷贝自定义 Nginx SPA 路由与静态资源缓存配置
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# 拷贝构建产物到 Nginx 默认静态目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露 HTTP 80 端口
EXPOSE 80

# 前台启动 Nginx 主进程
CMD ["nginx", "-g", "daemon off;"]
