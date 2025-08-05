import type { TId } from '@/types';
import type { Document } from 'mongoose';
import type { IUserSchema } from '../user';

export interface IAuthTokenInput {
  userId: TId | IUserSchema;
  refreshToken: string;
  expiresAt: Date;
  ip: string;
  userAgent: string;
}

export interface IAuthTokenSchema extends IAuthTokenInput, Document {}
