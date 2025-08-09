// ---------------------------------------------<>----------------------------------------------------

export const EXCLUDE_USER_COMMON_DB_FIELDS = <T>(keys: (keyof T)[] | [] = []): (keyof T)[] =>
  [...keys, '__v', 'password', 'loginAttempts', 'lastLoginAttemptDateAndTime'] as (keyof T)[]; // ignore -> don't want to send in payload;

export const EXCLUDE_SELECT_USER_COMMON_DB_FIELDS = <T>(keys: (keyof T)[] | [] = []): string[] => {
  return EXCLUDE_USER_COMMON_DB_FIELDS<T>(keys).map(exclude => `-${String(exclude)}`);
};

// ---------------------------------------------<>----------------------------------------------------
