import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 Tailwind CSS 类名
 * 结合 clsx 的条件类名拼接与 tailwind-merge 的冲突类名覆盖能力（shadcn-vue 标准工具函数）
 *
 * @param inputs - 任意数量的类名、对象或数组
 * @returns 合并去重后的类名字符串
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
