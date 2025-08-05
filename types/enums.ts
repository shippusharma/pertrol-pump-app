export const enum ETokenExpiration {
  ACCESS = 15 * 60, // 15 minutes
  REFRESH = 7 * 24 * 60 * 60, // 7 days
  refreshIfLessThan = 4 * 24 * 60 * 60, // 4 days
}

// ------------------------------------<Basic Types>-------------------------------------------

export enum ERoleType {
  ADMIN = 'admin',
  USER = 'user',
}

export enum EGenderType {
  MALE = 'male',
  FEMALE = 'female',
  ALL = 'all',
}

export enum EAuthProviderType {
  GOOGLE = 'google',
  APPLE = 'apple',
  GITHUB = 'github',
  FACEBOOK = 'facebook',
}