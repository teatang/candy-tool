/**
 * Base64 编码与解码工具模块
 * 使用 TextEncoder / TextDecoder 确保中文及任意 Unicode 字符安全转换
 */

/**
 * 将普通文本编码为 Base64 字符串
 *
 * @param input - 待编码的原始文本
 * @param urlSafe - 是否启用 URL 安全模式（将 + 替换为 -，/ 替换为 _，并去除尾部 = 填充）
 * @returns 编码后的 Base64 字符串
 */
export function encodeBase64(input: string, urlSafe = false): string {
  if (input === '') return ''

  // 将 UTF-8 字符串转换为字节数组，避免传统 btoa 对非 ASCII 字符报错
  const bytes = new TextEncoder().encode(input)
  let binary = ''
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i])
  }

  let encoded = btoa(binary)
  if (urlSafe) {
    encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  }
  return encoded
}

/**
 * 将 Base64 字符串解码为原始 UTF-8 文本
 *
 * @param input - 待解码的 Base64 字符串
 * @param urlSafe - 是否按 URL 安全模式兼容处理
 * @returns 解码后的原始文本
 * @throws 当输入不是合法的 Base64 格式时抛出错误
 */
export function decodeBase64(input: string, urlSafe = false): string {
  const trimmed = input.trim()
  if (trimmed === '') return ''

  // 若开启 URL 安全模式或字符串包含 - / _，先还原为标准 Base64 字符集
  let normalized = urlSafe ? trimmed.replace(/-/g, '+').replace(/_/g, '/') : trimmed

  // 校验标准 Base64 合法字符与长度
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) {
    throw new Error('INVALID_BASE64')
  }

  // 自动补齐 4 的倍数长度填充字符 '='
  const remainder = normalized.length % 4
  if (remainder === 1) {
    throw new Error('INVALID_BASE64')
  }
  if (remainder > 0) {
    normalized += '='.repeat(4 - remainder)
  }

  const binary = atob(normalized)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }

  return new TextDecoder('utf-8', { fatal: false }).decode(bytes)
}
