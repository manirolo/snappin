import { NormalizeTimestamps, NormalizeTimestampsResponse } from "../../appRegistry.interface";

export async function normalizeTimestamps({ unixSeconds }: NormalizeTimestamps): Promise<NormalizeTimestampsResponse> {
    return `${unixSeconds}`;
}