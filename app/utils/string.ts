export function toSnakeCase(str: string | null | undefined): string {
  if (!str) {
    return ''
  }
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2') // Convert camelCase to snake_case
    .replace(/[-\s]+/g, '_') // Replace hyphens and spaces with underscores
    .toLowerCase() // Convert to lowercase
}

export function slugify(text: string): string {
  return text
    .toString() // Convert to string
    .normalize('NFD') // Normalize the string
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase() // Convert to lowercase
    .trim() // Trim whitespace
    .replace(/[^a-z0-9\u1780-\u17FF -]/g, '') // Remove invalid characters but keep Khmer characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
}

export function b64Encode(text: string): string {
  return Buffer.from(text).toString('base64')
}

export function unicodeToBase64(unicodeString: string): string {
  // Convert the Unicode string to a UTF-8 encoded Uint8Array
  const utf8Bytes = new TextEncoder().encode(unicodeString)

  // Convert the Uint8Array to a string of characters
  let binaryString = ''
  utf8Bytes.forEach((byte) => {
    binaryString += String.fromCharCode(byte)
  })

  // Encode the binary string to Base64
  const base64String = btoa(binaryString)

  return base64String
}
