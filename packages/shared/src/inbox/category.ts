export const EmailCategoryValues = [
  "INVOICE",
  "RECEIPT",
  "OTHER"
] as const

export type EmailCategory = typeof EmailCategoryValues[number]