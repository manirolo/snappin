import { Model, PopulateOptions } from "mongoose";

export type PaginateOptions<T> = {
    model: Model<T>;
    query: Record<string, any>;
    page: number;
    limit: number;
    select?: string;
    populate?: string | PopulateOptions | Array<string | PopulateOptions>;
    sort?: Record<string, 1 | -1>;
};

export type PaginatedResponse<T> = {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};
