import { z } from "zod";
import { SchemaType } from "@snappin/infra/google/ai";

export function zodToGeminiSchema(schema: z.ZodTypeAny): any {
    if (schema instanceof z.ZodString) return { type: SchemaType.STRING };
    if (schema instanceof z.ZodNumber) return { type: SchemaType.NUMBER };
    if (schema instanceof z.ZodBoolean) return { type: SchemaType.BOOLEAN };
    
    if (schema instanceof z.ZodEnum) {
        return {
            type: SchemaType.STRING,
            enum: schema.options,
            format: "enum",
        };
    }

    if ('shape' in schema && schema.shape && typeof schema.shape === 'object') {
        const properties: Record<string, any> = {};

        const shapeEntries = Object.entries(schema.shape as Record<string, z.ZodTypeAny>);
        for (const [key, fieldSchema] of shapeEntries) {
            properties[key] = zodToGeminiSchema(fieldSchema);
        }

        return {
            type: SchemaType.OBJECT,
            properties,
        };
    }

    if ('element' in schema && schema.element && typeof schema.element === 'object') {
        return {
            type: SchemaType.ARRAY,
            items: zodToGeminiSchema(schema.element as z.ZodTypeAny),
        };
    }

    return { type: SchemaType.STRING };
}
