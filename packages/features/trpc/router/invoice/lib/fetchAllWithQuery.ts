// lib/fetchAllWithQuery.ts
import { Model, PipelineStage } from "mongoose";

export async function fetchAllWithQuery<T>({
  model,
  query,
  extraMatch,
}: {
  model: Model<T>;
  query: Record<string, unknown>;
  extraMatch?: Record<string, unknown>;
}): Promise<T[]> {

  if (extraMatch) {
    const pipeline: PipelineStage[] = [
      { $match: query },
      { $addFields: { extractionObjectId: { $toObjectId: "$extractionId" } } },
      {
        $lookup: {
          from: "invoiceextractionrequests",
          localField: "extractionObjectId",
          foreignField: "_id",
          as: "extraction",
          pipeline: [{ $project: { source: 1 } }],
        },
      },
      { $unwind: { path: "$extraction", preserveNullAndEmptyArrays: true } },
      { $match: extraMatch },
      { $sort: { createdAt: -1 } },
    ];

    const data = await model.aggregate<T>(pipeline);
    await model.populate(data, { path: "vendor" });
    await model.populate(data, {                   
      path: "extraction",
      select: "documentId fileName",
    });
    return data;
  }

  return model
    .find(query)
    .select("invoiceId invoiceDate dueDate description currency totals vendorId recipient metadata payment extractionId integrations")
    .populate("vendor")
    .populate({                                   
      path: "extraction",
      select: "documentId fileName",
    })
    .sort({ createdAt: -1 })
    .lean() as Promise<T[]>;
}