export const POLAR_EVENT_MAP = {
  "subscription.created":   { resource: "subscription", operation: "create" },
  "subscription.updated":   { resource: "subscription", operation: "update" },
  "subscription.active":    { resource: "subscription", operation: "create" },
  "subscription.renewed":   { resource: "subscription", operation: "renewed" },
  "subscription.canceled":  { resource: "subscription", operation: "cancel" },
  "subscription.uncanceled":{ resource: "subscription", operation: "uncancel" },
  "subscription.revoked":   { resource: "subscription", operation: "cancel" },
  "subscription.past_due":  { resource: "subscription", operation: "pastDue" },
} as const;

export type PolarEventType = keyof typeof POLAR_EVENT_MAP;