const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

function toBase62(buffer: Uint8Array): string {
    return Array.from(buffer)
        .map(byte => ALPHABET[byte % 62])
        .join("")
}

export function generateId(prefix?: string): string {
    const time = Date.now().toString(36).toUpperCase()
    const random = toBase62(crypto.getRandomValues(new Uint8Array(16)))
    return prefix ? `${prefix}_${time}${random}` : `${time}${random}`
}