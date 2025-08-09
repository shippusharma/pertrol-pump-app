import { dbTablesName } from '@/configs/db/tables-name';
import { Schema, model } from 'mongoose';
import type { IAuthTokenSchema } from './types/auth-token';
import { schemaOptions } from './utils/schema-options';

const tokenSchema = new Schema<IAuthTokenSchema>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: dbTablesName.users, index: true },
    refreshToken: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // index: { expires: 0 } tells MongoDB to automatically delete the document when expiresAt passes.
    ip: { type: String },
    userAgent: { type: String },
  },
  schemaOptions<IAuthTokenSchema>()
);

export const AuthTokenModel = model<IAuthTokenSchema>(dbTablesName.authTokens, tokenSchema);
