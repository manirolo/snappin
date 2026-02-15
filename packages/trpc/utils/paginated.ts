import { PaginatedResponse, PaginateOptions } from "@snappin/shared/pagination";
import { PopulateOptions } from "mongoose"

export async function paginate<T>({ model, query, page, limit, select, populate, sort = { createdAt: -1 } }: PaginateOptions<T>): Promise<PaginatedResponse<T>> {
    const skip = (page - 1) * limit;

    const baseQuery = model.find(query);

    if (select) baseQuery.select(select);
    if (populate) {
        if (typeof populate === "string" || Array.isArray(populate)) {
            baseQuery.populate(populate as string | string[]);
        } else {
            baseQuery.populate(populate as PopulateOptions);
        }
    }
    if (sort) baseQuery.sort(sort);

    const [data, total] = await Promise.all([
        baseQuery.skip(skip).limit(limit).lean(),
        model.countDocuments(query),
    ]);

    return {
        data,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
    };
}