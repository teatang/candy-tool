import CryptoJS from 'crypto-js'

/**
 * 常用哈希摘要与 HMAC 加密签名工具模块
 * 支持 MD5、SHA-1、SHA-256、SHA-512、SHA-3 算法
 */

export type HashAlgorithm = 'MD5' | 'SHA1' | 'SHA256' | 'SHA512' | 'SHA3'
export type HmacAlgorithm = 'HmacMD5' | 'HmacSHA1' | 'HmacSHA256' | 'HmacSHA512'

export const HASH_ALGORITHMS: HashAlgorithm[] = ['MD5', 'SHA1', 'SHA256', 'SHA512', 'SHA3']
export const HMAC_ALGORITHMS: HmacAlgorithm[] = ['HmacMD5', 'HmacSHA1', 'HmacSHA256', 'HmacSHA512']

/**
 * 计算单个哈希摘要值
 *
 * @param input - 明文字符串
 * @param algorithm - 哈希算法名称
 * @param uppercase - 是否返回大写十六进制字符串
 * @returns 十六进制哈希摘要
 */
export function computeHash(
  input: string,
  algorithm: HashAlgorithm,
  uppercase = false,
): string {
  let wordArray: CryptoJS.lib.WordArray

  switch (algorithm) {
    case 'MD5':
      wordArray = CryptoJS.MD5(input)
      break
    case 'SHA1':
      wordArray = CryptoJS.SHA1(input)
      break
    case 'SHA256':
      wordArray = CryptoJS.SHA256(input)
      break
    case 'SHA512':
      wordArray = CryptoJS.SHA512(input)
      break
    case 'SHA3':
      wordArray = CryptoJS.SHA3(input, { outputLength: 256 })
      break
  }

  const hex = wordArray.toString(CryptoJS.enc.Hex)
  return uppercase ? hex.toUpperCase() : hex
}

/**
 * 一次性计算所有内置哈希算法的摘要结果
 *
 * @param input - 明文字符串
 * @param uppercase - 是否输出大写
 */
export function computeAllHashes(
  input: string,
  uppercase = false,
): Record<HashAlgorithm, string> {
  return {
    MD5: computeHash(input, 'MD5', uppercase),
    SHA1: computeHash(input, 'SHA1', uppercase),
    SHA256: computeHash(input, 'SHA256', uppercase),
    SHA512: computeHash(input, 'SHA512', uppercase),
    SHA3: computeHash(input, 'SHA3', uppercase),
  }
}

/**
 * 计算带密钥的 HMAC 消息认证码
 *
 * @param input - 明文消息
 * @param secretKey - HMAC 密钥
 * @param algorithm - HMAC 算法
 * @param uppercase - 是否输出大写
 */
export function computeHmac(
  input: string,
  secretKey: string,
  algorithm: HmacAlgorithm,
  uppercase = false,
): string {
  let wordArray: CryptoJS.lib.WordArray

  switch (algorithm) {
    case 'HmacMD5':
      wordArray = CryptoJS.HmacMD5(input, secretKey)
      break
    case 'HmacSHA1':
      wordArray = CryptoJS.HmacSHA1(input, secretKey)
      break
    case 'HmacSHA256':
      wordArray = CryptoJS.HmacSHA256(input, secretKey)
      break
    case 'HmacSHA512':
      wordArray = CryptoJS.HmacSHA512(input, secretKey)
      break
  }

  const hex = wordArray.toString(CryptoJS.enc.Hex)
  return uppercase ? hex.toUpperCase() : hex
}
