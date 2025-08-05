import type { SchemaOptions } from 'mongoose';

export const schemaOptions = <T>(): SchemaOptions<T> => ({
  timestamps: true, // Automatically adds `createdAt` & `updatedAt`
  validateBeforeSave: true, // Ensures all validations pass before saving
  toJSON: { virtuals: true }, // Include virtual fields in JSON responses
  toObject: { virtuals: true }, // Include virtuals when converting to object
});
