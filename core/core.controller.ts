import type { FilterQuery, Model } from 'mongoose';
import type { IAggregatePagination, ICorePagination, IPaginationResponse } from './core';
import CoreAuthToken from './core.auth-token';

class CoreController<T> extends CoreAuthToken {
  constructor(protected model: Model<T>) {
    super();
    this.model = model;
  }

  private readonly totalPages = (count: number, limit: number): number => Math.ceil((count || 1) / limit);

  protected readonly ensureIndexes = async (): Promise<unknown> => await this.model.collection.indexes();

  protected readonly createIndex = async (fieldName: string) =>
    await this.model.collection.createIndex({ [fieldName]: 1 });

  protected readonly dropIndex = async (fieldName: string) => await this.model.collection.dropIndex(fieldName);

  /**
   **-------------------------------------------------------------
   *!                    Private Methods
   **-------------------------------------------------------------
   */

  // Filter out undefined, null, or empty values from the filter object
  private readonly sanitizedFilters = (filter: FilterQuery<T>) =>
    Object.keys(filter).reduce((acc, key) => {
      const value = filter[key as keyof T];
      if (value != null && value !== '') acc[key as keyof T] = value;
      return acc;
    }, {} as FilterQuery<T>);

  // Priority: Filters are applied first, then search conditions if both are present.
  private readonly buildFilterAndSearchQuery = <T>(
    filter: FilterQuery<T> = {},
    search?: string,
    searchKeys?: (keyof T)[]
  ): Record<string, unknown> => {
    const query: Record<string, unknown> = { ...this.sanitizedFilters(filter) };
    if (search && searchKeys && searchKeys.length > 0) {
      const searchRegex = new RegExp(search.trim(), 'ig');
      const orConditions = searchKeys.map(field => ({ [field]: searchRegex }));
      query.$or = orConditions; // Added search conditions to the query
    }
    return query;
  };

  private readonly sorting = (sortBy: keyof T, orderBy: 'asc' | 'desc') => ({
    [sortBy]: (orderBy === 'asc' ? 1 : -1) as 1 | -1,
  });

  private readonly parseValue = (value: string) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    const num = Number(value);
    if (!isNaN(num)) return num;
    return value;
  };

  private readonly projections = (excludeKeys: (keyof T)[], includeKeys: (keyof T)[]) => {
    const projection = {} as Record<keyof T, 1 | 0>;
    if (excludeKeys.length > 0) excludeKeys.forEach((field: keyof T) => (projection[field as keyof T] = 0));
    else if (includeKeys.length > 0) includeKeys.forEach((field: keyof T) => (projection[field as keyof T] = 1));
    return projection;
  };

  /**
   **-------------------------------------------------------------
   *!   Pagination, Search, Filter, Pages, Count and Related
   **-------------------------------------------------------------
   */

  protected readonly counts = async (): Promise<number> => await this.model.countDocuments();

  // pagination with filter and search
  protected readonly pagination = async ({
    page,
    limit,
    offset,
    sortBy,
    orderBy,
    filter,
    search,
    searchKeys,
    excludeKeys = [],
    includeKeys = [],
    populates = [],
  }: ICorePagination<T>): Promise<IPaginationResponse<T>> => {
    const projections = this.projections(excludeKeys, includeKeys); // include and exclude keys

    const query = this.buildFilterAndSearchQuery<T>(filter, search, searchKeys);
    let queryBuilder = this.model.find(query, { ...projections, __v: 0 }); // without populate
    if (populates.length > 0) queryBuilder = this.model.find(query, { ...projections, __v: 0 }).populate(populates); // with populate

    const _sort = this.sorting(sortBy, orderBy);
    const _offset = offset !== 0 ? offset : (page - 1) * limit;
    const [data, counts] = await Promise.all([
      queryBuilder
        .sort(_sort) // sorting by desc order
        .skip(_offset) // pagination
        .limit(limit) // page limit
        .lean({ virtuals: true }) // read-only
        .exec(), // for execute query
      this.model.countDocuments(query), // Total count (optional)
    ]);
    const pages = this.totalPages(counts, limit);
    return {
      data,
      pagination: {
        page,
        limit,
        offset: _offset,
        sortBy,
        orderBy,
        counts,
        pages,
        hasNextPage: page < pages,
        hasPrevPage: page > 1,
      },
    };
  };

  // Aggregate : filter and search with pagination
  protected readonly paginationWithAggregate = async ({
    page,
    limit,
    offset,
    sortBy,
    orderBy,
    pipeline,
    aggregateOptions,
  }: IAggregatePagination<T>): Promise<IPaginationResponse<T>> => {
    const _sort = this.sorting(sortBy, orderBy);
    const _offset = offset !== 0 ? offset : (page - 1) * limit;
    const [data, countResult] = await Promise.all([
      this.model
        .aggregate(
          [
            ...pipeline, // please don't include pagination inside the pipeline
            { $sort: _sort },
            { $skip: _offset },
            { $limit: limit },
          ],
          aggregateOptions
        )
        .exec(),
      this.model.aggregate([...pipeline, { $count: 'total' }], aggregateOptions).exec(),
    ]);

    const counts: number = countResult.length > 0 ? countResult[0].total : 0;
    const pages = this.totalPages(counts, limit);
    return {
      data,
      pagination: {
        page,
        limit,
        offset: _offset,
        sortBy,
        orderBy,
        counts,
        pages,
        hasNextPage: page < pages,
        hasPrevPage: page > 1,
      },
    };
  };

  /**
   **-----------------------------------------------
   *!                 Others
   **-----------------------------------------------
   */

  // Utility function to handle promises with error catching in a type-safe way
  protected handleAsync = async <T>(promise: Promise<T>): Promise<[Error | null, T | null]> => {
    try {
      const data = await promise;
      return [null, data];
    } catch (err) {
      return [err as Error, null];
    }
  };

  // * Error handling wrapper for async route handlers
  // protected tryCatchWrapper = (
  //   fn: (
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ) => Promise<Response<IMessageResponse, Record<string, unknown>> | undefined>
  // ) => {
  //   return async (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //       await fn(req, res, next);
  //     } catch (error_msg) {
  //       nextErrorHandler(next, error_msg);
  //     }
  //   };
  // };

  // protected asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  //   return function asyncUtilWrap(req: Request, res: Response, next: NextFunction): Promise<void> {
  //     return Promise.resolve(fn(req, res, next)).catch(next);
  //   };
  // };
}

export default CoreController;
