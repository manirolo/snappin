
export const RESEND_EVENT_MAP = {
  "email.received": { resource: "email", operation: "read" },
} as const;

export type ResendEventType = keyof typeof RESEND_EVENT_MAP;
