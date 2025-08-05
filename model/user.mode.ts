import { dbTablesName } from '@/configs/db/tables-name';
import { comparingHash, convertIntoHash } from '@/lib/hashing';
import { Schema, model } from 'mongoose';
import { EGenderType, ERoleType } from '../types/enums';
import { IUserSchema } from './types/user';
import { schemaOptions } from './utils/schema-options';
import { fileSchema } from './utils/upload-file';

const userSchema = new Schema<IUserSchema>(
  {
    // Credentials and verification flags
    isActivated: { type: Boolean, default: true },
    activatedAt: { type: Date },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneNumberVerified: { type: Boolean, default: false },
    isEmailSubscribed: { type: Boolean, default: true },
    emailUnsubscribedAt: { type: Date },
    isNotificationSubscribed: { type: Boolean, default: true },
    notificationUnsubscribedAt: { type: Date },

    role: {
      type: String,
      required: [true, 'Role is required'],
      lowercase: true,
      enum: { values: Object.values(ERoleType), message: 'Invalid role type' },
      index: true,
    },
    name: { type: String, required: true, lowercase: true, trim: true, message: 'Name is required' },
    email: {
      type: String,
      index: true,
      lowercase: true,
      minlength: [6, 'Email must be at least 6 characters long'],
      maxlength: [40, 'Email must be at most 40 characters long'],
    },
    phone_number: {
      type: String,
      unique: true,
      required: [true, 'Phone number is required'],
      minlength: [10, 'Phone number must be at least 10 characters long'],
      maxlength: [12, 'Phone number must be at most 12 characters long'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    avatar: { type: fileSchema, default: null },
    gender: {
      type: String,
      lowercase: true,
      enum: { values: Object.values(EGenderType), message: 'Invalid gender type' },
    },
    dob: { type: Date },
  },
  schemaOptions<IUserSchema>()
);

// hash password before the save and add comparePassword method in userSchema
userSchema.pre<IUserSchema>('save', function (next) {
  if (!this.isModified('password')) return next();
  this.password = convertIntoHash(this.password);
  next();
});
userSchema.methods.comparePassword = function (password: string): boolean {
  return comparingHash(password, this.password);
};

export const UserModel = model<IUserSchema>(dbTablesName.users, userSchema);
