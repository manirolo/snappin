// features/subscription/handler/ls.subscription.handler.ts
import { GenericWebhookEvent } from "../../webhook/types";
import { LSWebhookPayload } from "../../webhook/ls/types";
import { subscriptionService } from "../service/subscription.service";
import { SubscriptionEventData } from "../service/subscription.service";


export class LSSubscriptionHandler {
  protected _subscriptionService = subscriptionService;

  async create(event: GenericWebhookEvent): Promise<void> {
    const data = this.extractEventData(event);
    if (!data) return;
    await this._subscriptionService.onCreate(data);
  }

  async update(event: GenericWebhookEvent): Promise<void> {
    const data = this.extractEventData(event);
    if (!data) return;
    await this._subscriptionService.onUpdate(data);
  }

  async cancel(event: GenericWebhookEvent): Promise<void> {
    const payload = event.payload as { first_subscription_item: { subscription_id: number } };
    await this._subscriptionService.onCancel({ id: payload.first_subscription_item.subscription_id, });
  }

  async resume(event: GenericWebhookEvent): Promise<void> {
    const data = this.extractEventData(event);
    if (!data) return;
    await this._subscriptionService.onUpdate({ ...data, status: "active" });
  }

  async expire(event: GenericWebhookEvent): Promise<void> {
    const payload = event.payload as { first_subscription_item: { subscription_id: number } };
    await this._subscriptionService.onCancel({ id: payload.first_subscription_item.subscription_id, status: "expired" });
  }

  async pause(event: GenericWebhookEvent): Promise<void> {
    const payload = event.payload as { first_subscription_item: { subscription_id: number } };
    await this._subscriptionService.onCancel({ id: payload.first_subscription_item.subscription_id, status: "paused" });
  }

  async unpause(event: GenericWebhookEvent): Promise<void> {
    const data = this.extractEventData(event);
    if (!data) return;
    await this._subscriptionService.onUpdate({ ...data, status: "active" });
  }

  private extractEventData(event: GenericWebhookEvent): SubscriptionEventData | null {
    const raw = event.raw as LSWebhookPayload;
    const attr = raw.data.attributes;

    const id = Number(raw.data.id);                                    // LS subscription ID
    const clerkUserId = raw.meta.custom_data?.clerk_user_id ?? null;
    const clerkOrgId = raw.meta.custom_data?.clerk_org_id ?? null;
    const productId = attr.product_id;
    const customerId = attr.customer_id;
    const status = attr.status;
    const currentPeriodStart = new Date();
    const currentPeriodEnd = attr.renews_at ? new Date(attr.renews_at) : new Date();

    if (!id || !customerId || !productId || !clerkUserId || !clerkOrgId) {
      console.warn("[LSSubscriptionHandler] Missing required fields", attr);
      return null;
    }

    return {
      id,
      customerId,
      productId,
      status,
      currentPeriodStart,
      currentPeriodEnd,
      metadata: raw.meta.custom_data ?? null,
      clerkUserId,
      clerkOrgId
    };
  }
}