export type WebhookOperation = "create" | "update" | "delete" | "cancel";

export interface GenericWebhookEvent<TPayload = unknown> {
  provider: string;
  eventType: string;
  resource: string;
  operation: WebhookOperation;
  payload: TPayload;
  raw: unknown;
}