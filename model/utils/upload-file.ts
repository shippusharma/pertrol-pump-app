import { Schema } from 'mongoose';
import type { IFileSchema } from '../types/upload-file';

export const fileSchema = new Schema<IFileSchema>({
  key: { type: String, required: true },
  url: { type: String, required: true },
  originalName: { type: String, required: true },
  contentType: { type: String, required: true },
  contentLength: { type: Number, required: true },
  contentMD5: { type: String },
});
