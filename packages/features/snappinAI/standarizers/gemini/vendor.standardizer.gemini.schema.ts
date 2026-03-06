import { ZVendor } from "@snappin/shared/vendor/vendor.schema";
import { z } from "zod";

export const ZVendorAI = ZVendor

export type TVendorAI = z.infer<typeof ZVendorAI>;