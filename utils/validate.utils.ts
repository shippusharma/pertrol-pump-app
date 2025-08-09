import type { Document } from 'mongoose';

export function removeKeysFromPayload<T extends Document>(payload: T, removeKeys: T[] = []) {
  const filteredPayload: Record<string, unknown> = {};
  const keysToRemove = [...removeKeys, '__v', 'password', 'loginAttempts', 'lastLoginAttemptDateAndTime', 'lastLogin'];

  for (const [key, value] of Object.entries(payload.toJSON())) {
    if (!keysToRemove.includes(key)) {
      filteredPayload[key] = value;
    }
  }
  return filteredPayload;
}
