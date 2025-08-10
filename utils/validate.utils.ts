import type { TSort } from '@/types';
import type { Document } from 'mongoose';

export function removeKeysFromPayload<T extends Document>(payload: T, removeKeys: T[] = []) {
  const filteredPayload: Record<string, unknown> = {};
  const keysToRemove = [...removeKeys, '__v', 'password', 'loginAttempts', 'lastLoginAttemptDateAndTime'];

  for (const [key, value] of Object.entries(payload.toJSON())) {
    if (!keysToRemove.includes(key)) {
      filteredPayload[key] = value;
    }
  }
  return filteredPayload;
}

export function getQueryParams(req: Request) {
  return Object.fromEntries(new URL(req.url).searchParams);
}

export function getPaginationQueryParams<T>(req: Request) {
  const { page = 1, limit = 10, offset = 0, sortBy = 'createdAt', orderBy = 'desc', search } = getQueryParams(req);
  return { page: +page, limit: +limit, offset: +offset, sortBy: sortBy as keyof T, orderBy: orderBy as TSort, search };
}
