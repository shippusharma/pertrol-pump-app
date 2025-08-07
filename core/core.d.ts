import type { TSort } from '@/types';
import type {
  AggregateOptions,
  FilterQuery,
  FlattenMaps,
  PipelineStage,
  PopulateOptions,
  Require_id,
  UnpackedIntersection,
} from 'mongoose';

export interface IDateAndTimeFilterQuery {
  readonly $gte: Date;
  readonly $lte: Date;
}

// ? ---------------------------------------------<>----------------------------------------------------

export interface IPagination<T> {
  readonly page: number;
  readonly limit: number;
  readonly offset: number;
  readonly sortBy: keyof T;
  readonly orderBy: TSort;
}

interface IPaginationResponse<T> {
  readonly data: Require_id<FlattenMaps<UnpackedIntersection<T>>>[];
  readonly pagination: IPagination<T> & {
    readonly counts: number;
    readonly pages: number;
    readonly hasNextPage: boolean;
    readonly hasPrevPage: boolean;
  };
}

// ? ---------------------------------------------<>----------------------------------------------------

interface IPaginationWithSearch<T> extends IPagination<T> {
  readonly filter?: FilterQuery<T>;
  readonly search: string; // search is required here
  readonly searchKeys: (keyof T)[]; // searchKeys is required if search is present
  readonly excludeKeys?: (keyof T)[];
  readonly includeKeys?: (keyof T)[];
  readonly populates?: PopulateOptions[];
}

interface IPaginationWithoutSearch<T> extends IPagination<T> {
  readonly filter?: FilterQuery<T>;
  readonly search?: undefined; // no search provided
  readonly searchKeys?: undefined; // no searchKeys required
  readonly excludeKeys?: (keyof T)[];
  readonly includeKeys?: (keyof T)[];
  readonly populates?: PopulateOptions[];
}

export type ICorePagination<T> = IPaginationWithSearch<T> | IPaginationWithoutSearch<T>;

// ? ---------------------------------------------<>----------------------------------------------------

export interface IAggregatePagination<T> extends IPagination<T> {
  readonly pipeline: PipelineStage[];
  readonly aggregateOptions?: AggregateOptions;
}

// const pipeline: PipelineStage[] = [
//   { $match: matchStage },
//   { $sort: { [sortBy]: orderBy } },
//   { $skip: (page - 1) * limit },
//   { $limit: limit },
//   { $project: projects },
// ];
