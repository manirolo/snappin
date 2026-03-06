import { describe, it, expect, vi, beforeEach } from "vitest"
import { setupMongoDB } from "@snappin/test/mongodb"
import { db } from "@snappin/db/index"
import { TOCREngine, AnalyzeEngine } from "@snappin/shared/invoiceExtractRequest/invoiceExtractionRequest.schema"

vi.mock("@snappin/db/connect", () => ({
  connectDB: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("@snappin/infra/google/storage", () => ({
  storageService: {
    promoteTemp: vi.fn().mockResolvedValue({ fileId: "promoted_file_123" }),
    uploadTemp:  vi.fn().mockResolvedValue({ fileId: "temp_file_123" }),
    delete:      vi.fn().mockResolvedValue(undefined),
  },
}))

// Mock the whole document service — stops storage.ts from loading at all
vi.mock("../../invoice/services/invoiceDocument.service", () => ({
  documentService: {
    promote: vi.fn().mockResolvedValue({ fileId: "promoted_file_123" }),
  },
}))

setupMongoDB()

// ── Helpers ───────────────────────────────────────────────────────────────────
async function createMockExtractionRequest() {
  return await db.invoiceExtractionRequest.create({
    userId: "user_1",
    orgId: "org_1",
    documentId: "temp_doc_123",
    fileName: "invoice.pdf",
    source: { kind: "manual" as const, metadata: { uploadedBy: "user_1" } },
    status: "queued" as const,
    attempts: 0,
  })
}

const mockSaveProps = (extractionRequestId: string) => ({
  invoiceExtractionRequestId: extractionRequestId,
  vendor: {
    name: "Polar Software",
    email: "billing@polar.sh",
    website: "polar.sh",
  },
  invoice: {
    invoiceId: "INV-001",
    invoiceDate: "2026-01-10",
    total: 2242,
    currency: "USD",
    metadata: { documentType: "invoice" as const },
  },
  extraction: {
    ocrEngine: TOCREngine.AWS_TEXTRACT,
    analyzeEngine: AnalyzeEngine.GEMINI,
    status: "success" as const,
  },
})

describe("InvoiceSaveService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should save invoice with correct extractionId", async () => {
    const { invoiceSaveService } = await import(
      "../../invoice/services/invoiceSave.service"
    )
    const request = await createMockExtractionRequest()
    await invoiceSaveService.save(mockSaveProps(request._id.toString()))

    const savedInvoice = await db.invoice.findOne({ extractionId: request._id.toString() })

    expect(savedInvoice).not.toBeNull()
    expect(savedInvoice?.extractionId).toBe(request._id.toString())
  })

  it("should save invoice with correct vendorId", async () => {
    const { invoiceSaveService } = await import(
      "../../invoice/services/invoiceSave.service"
    )
    const request = await createMockExtractionRequest()
    await invoiceSaveService.save(mockSaveProps(request._id.toString()))

    const vendor = await db.vendor.findOne({ name: "Polar Software" })
    const savedInvoice = await db.invoice.findOne({ extractionId: request._id.toString() })

    expect(vendor).not.toBeNull()
    expect(savedInvoice?.vendorId).toBe(vendor?._id?.toString())  // ← this will catch the bug
  })

  it("should upsert vendor — not create duplicates on second save", async () => {
    const { invoiceSaveService } = await import(
      "../../invoice/services/invoiceSave.service"
    )
    const request1 = await createMockExtractionRequest()
    const request2 = await createMockExtractionRequest()

    await invoiceSaveService.save(mockSaveProps(request1._id.toString()))
    await invoiceSaveService.save(mockSaveProps(request2._id.toString()))

    const vendorCount = await db.vendor.countDocuments({ name: "Polar Software" })
    expect(vendorCount).toBe(1)  // upsert should not create duplicates
  })

  it("should update extraction request status to success", async () => {
    const { invoiceSaveService } = await import(
      "../../invoice/services/invoiceSave.service"
    )
    const request = await createMockExtractionRequest()
    await invoiceSaveService.save(mockSaveProps(request._id.toString()))

    const updated = await db.invoiceExtractionRequest.findById(request._id)
    expect(updated?.status).toBe("success")
    expect(updated?.documentId).toBe("promoted_file_123")
  })

  it("should return early if extraction request not found", async () => {
    const { invoiceSaveService } = await import(
      "../../invoice/services/invoiceSave.service"
    )
    const result = await invoiceSaveService.save(
      mockSaveProps("000000000000000000000000")
    )
    expect(result).toBeUndefined()

    const invoiceCount = await db.invoice.countDocuments()
    expect(invoiceCount).toBe(0)  // nothing should be created
  })
})