import { describe, it, expect } from "vitest"
import { setupMongoDB } from "@snappin/test/mongodb"
import { invoiceExtractionRequestService } from "../../invoice/services/invoiceExtractionRequest.service"
import type { InvoiceExtractionRequestResource } from "@snappin/shared/invoiceExtractRequest/invoiceExtractionRequest.schema"
import { SourceKind } from "@snappin/shared/apps/app.schema"

setupMongoDB()

const mockRequest: InvoiceExtractionRequestResource = {
  userId: "user_1",
  orgId: "org_1",
  documentId: "doc_123",
  fileName: "invoice.pdf",
  source: {
    kind: SourceKind.MANUAL, 
    metadata: { uploadedBy: "user_1" },
  },
  status: "queued" as const,
  attempts: 0,
}

describe("InvoiceExtractionRequestService", () => {
  describe("createRequest", () => {
    it("should create a new extraction request", async () => {
      const result = await invoiceExtractionRequestService.createRequest(mockRequest)
      expect(result._id).toBeDefined()
      expect(result.userId).toBe("user_1")
      expect(result.documentId).toBe("doc_123")
      expect(result.status).toBe("queued")
    })
  })

  describe("getRequest", () => {
    it("should retrieve an existing request by id", async () => {
      const created = await invoiceExtractionRequestService.createRequest(mockRequest)
      const found = await invoiceExtractionRequestService.getRequest({
        extractionRequestId: created._id.toString(),
      })
      expect(found).not.toBeNull()
      expect(found?.userId).toBe("user_1")
      expect(found?.documentId).toBe("doc_123")
    })

    it("should return null for non-existent id", async () => {
      const found = await invoiceExtractionRequestService.getRequest({
        extractionRequestId: "000000000000000000000000",
      })
      expect(found).toBeNull()
    })
  })

  describe("updateRequest", () => {
    it("should update status to processing", async () => {
      const created = await invoiceExtractionRequestService.createRequest(mockRequest)
      await invoiceExtractionRequestService.updateRequest(
        created._id.toString(),
        { status: "processing" }
      )
      const updated = await invoiceExtractionRequestService.getRequest({
        extractionRequestId: created._id.toString(),
      })
      expect(updated?.status).toBe("processing")
    })

    it("should update invoiceId after success", async () => {
      const created = await invoiceExtractionRequestService.createRequest(mockRequest)
      await invoiceExtractionRequestService.updateRequest(
        created._id.toString(),
        { status: "success", invoiceId: "inv_999" }
      )
      const updated = await invoiceExtractionRequestService.getRequest({
        extractionRequestId: created._id.toString(),
      })
      expect(updated?.status).toBe("success")
      expect(updated?.invoiceId).toBe("inv_999")
    })
  })
})