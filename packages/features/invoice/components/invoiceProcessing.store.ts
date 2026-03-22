import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'


type InvoiceProcessingStore = {
  processingStatus: boolean
  setProcessingStatus: (isProcessing: boolean) => void
  reset: () => void
}

export const useInvoiceProcessingStore = create(
  subscribeWithSelector<InvoiceProcessingStore>((set) => ({
    processingStatus: false,
    setProcessingStatus: (isProcessing) => set({ processingStatus: isProcessing }),
    reset: () => set({ processingStatus: false }),
  }))
)