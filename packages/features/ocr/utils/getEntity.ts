export function getEntity(entities: unknown[], type: string): string | null {
    for (const entity of entities) {
        if (entity && typeof entity === "object" && (entity as Record<string, unknown>).type === type) {
            const text = (entity as Record<string, unknown>).mentionText;
            return typeof text === "string" ? text : null;
        }
    }
    return null;
}
