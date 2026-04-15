import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";
import { env } from "@snappin/env";

let initialized = false;

export function getLemonSqueezy() {
  if (!initialized) {
    lemonSqueezySetup({ apiKey: env.ls.apiKey });
    initialized = true;
  }
}