import { fileTypeFromBuffer } from "file-type"

export async function getMimeType(buffer: Buffer): Promise<string> {
    const result = await fileTypeFromBuffer(buffer)

    if (!result) {
        throw new Error("Could not determine file type from buffer")
    }

    return result.mime
}

export async function getFileExtension(buffer: Buffer): Promise<string | null> {
    const result = await fileTypeFromBuffer(buffer)
    return result?.ext ?? null 
}