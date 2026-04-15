import { type Subscription } from "@lemonsqueezy/lemonsqueezy.js"

export const LS_EVENT_MAP = {
  "subscription_created":   { resource: "subscription", operation: "create" },
  "subscription_updated":   { resource: "subscription", operation: "update" },
  "subscription_cancelled": { resource: "subscription", operation: "cancel" },
  "subscription_resumed":   { resource: "subscription", operation: "resume" },
  "subscription_expired":   { resource: "subscription", operation: "expire" },
  "subscription_paused":    { resource: "subscription", operation: "pause" },
  "subscription_unpaused":  { resource: "subscription", operation: "unpause" },
} as const;

export type LSEventType = keyof typeof LS_EVENT_MAP;

// Extract attributes from the library's Subscription type — avoids duplicating fields
export type LSSubscriptionAttributes = NonNullable<Subscription["data"]>["attributes"]

export interface LSWebhookPayload {
  meta: {
    event_name: LSEventType;
    custom_data?: Record<string, string>;
  };
  data: NonNullable<Subscription["data"]>;  // reuse data shape from library
}