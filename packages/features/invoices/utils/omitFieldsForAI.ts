import { z } from "zod";

export function toAISchema<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  omitKeys: Partial<Record<keyof T, true>> &
    Record<Exclude<keyof T, keyof T>, never>
) {
  return schema.omit(omitKeys).partial();
}
