export const EmailCategoryValues = [
  "INVOICE",
  "RECEIPT",
  "PAYMENT_CONFIRMATION",
  "TRANSACTIONAL",
  "OTHER"
] as const

export type EmailCategory = typeof EmailCategoryValues[number]