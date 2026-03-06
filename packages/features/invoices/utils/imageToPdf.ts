// packages/infra/utils/imageToPdf.ts
import sharp from "sharp"
import { PDFDocument } from "pdf-lib"

export async function imageToPdf(imageBuffer: Buffer): Promise<Buffer> {
    // Normalize to PNG first (sharp handles jpg, webp, heic, tiff, etc.)
    const pngBuffer = await sharp(imageBuffer).png().toBuffer()
    const metadata = await sharp(pngBuffer).metadata()

    const pdfDoc = await PDFDocument.create()
    const image = await pdfDoc.embedPng(pngBuffer)

    const width = metadata.width ?? 595   // A4 fallback
    const height = metadata.height ?? 842

    const page = pdfDoc.addPage([width, height])
    page.drawImage(image, { x: 0, y: 0, width, height })

    const pdfBytes = await pdfDoc.save()
    return Buffer.from(pdfBytes)
}

export function isImageMimeType(mimeType?: string | null): boolean {
    return !!mimeType && ["image/jpeg", "image/png", "image/webp", "image/tiff", "image/heic"].includes(mimeType)
}