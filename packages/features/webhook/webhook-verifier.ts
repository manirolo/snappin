import { GenericWebhookEvent } from "./types";

export interface IWebhookVerifier<TReq = unknown> {
  verify(req: TReq): Promise<GenericWebhookEvent>;
}