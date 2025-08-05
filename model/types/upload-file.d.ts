import type { Document } from 'mongoose';

export interface IFileInput {
  key: string;
  url: string;
  originalName: string;
  contentType: string;
  contentLength: number;
  contentMD5?: string;
}

export type TFileInput = Omit<IFileInput, 'url'>;

export interface IFileSchema extends IFileInput, Document {}
