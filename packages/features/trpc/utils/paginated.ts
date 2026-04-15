import { PaginatedResponse, PaginateOptions } from "@snappin/shared/pagination";
import { PopulateOptions, PipelineStage } from "mongoose"

export async function paginate<T>({
    model, query, extraMatch, page, limit, select, populate, sort = { createdAt: -1 }
}: PaginateOptions<T>): Promise<PaginatedResponse<T>> {

    const skip = (page - 1) * limit;

    if (extraMatch) {
        const pipeline: PipelineStage[] = [
            { $match: query },

            // ✅ Cast string extractionId → ObjectId so $lookup can join
            {
                $addFields: {
                    extractionObjectId: { $toObjectId: "$extractionId" }
                }
            },
            {
                $lookup: {
                    from: "invoiceextractionrequests",
                    localField: "extractionObjectId",  // ✅ use casted field
                    foreignField: "_id",
                    as: "extraction",
                    pipeline: [{ $project: { source: 1 } }],
                },
            },
            { $unwind: { path: "$extraction", preserveNullAndEmptyArrays: true } },
            { $match: extraMatch },
            { $sort: sort },
        ];

        const dataPipeline: PipelineStage[] = [
            ...pipeline,
            { $skip: skip },
            { $limit: limit },
        ];

        const countPipeline: PipelineStage[] = [
            ...pipeline,
            { $count: "total" },
        ];

        const [dataRaw, countRaw] = await Promise.all([
            model.aggregate<T>(dataPipeline),
            model.aggregate<{ total: number }>(countPipeline),
        ]);

        await model.populate(dataRaw, { path: "vendor" });
        await model.populate(dataRaw, {
            path: "extraction",
            select: "source documentId thumbnail integration",
            populate: {
                path: "integration",
                select: "_id appType appSlug appCategory identifierEmail config reAuthenticationRequired createdAt status",
            }
        });

        const total = countRaw[0]?.total ?? 0;

        return {
            data: dataRaw,
            page, limit, total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
        };
    }

    const baseQuery = model.find(query);

    if (select) baseQuery.select(select);

    if (populate) baseQuery.populate(populate as PopulateOptions);

    baseQuery.sort(sort);

    const [data, total] = await Promise.all([
        baseQuery.skip(skip).limit(limit).lean() as Promise<T[]>,
        model.countDocuments(query),
    ]);

    return {
        data, page, limit, total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
    };
}