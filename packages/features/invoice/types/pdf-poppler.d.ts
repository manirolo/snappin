declare module "pdf-poppler" {
  interface ConvertOptions {
    format?: "jpeg" | "png" | "tiff"
    out_dir?: string
    out_prefix?: string
    page?: number | null
    scale?: number
  }

  export function convert(filePath: string, options: ConvertOptions): Promise<void>
}