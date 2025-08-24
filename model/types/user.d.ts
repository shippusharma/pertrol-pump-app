import type { Document } from 'mongoose';
import { EGenderType, ERoleType } from '../../types/enums';
import type { IAwsFileSchema } from '../index';

export interface IUserInput {
  comparePassword(password: string): boolean;
  isActivated: boolean;
  activatedAt?: Date;
  isEmailVerified: boolean;
  emailVerifiedAt?: Date;
  isPhoneNumberVerified: boolean;
  phoneNumberVerifiedAt?: Date;
  isEmailSubscribed: boolean;
  emailUnsubscribedAt?: Date;
  isNotificationSubscribed: boolean;
  notificationUnsubscribedAt?: Date;

  role: ERoleType;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  avatar: IAwsFileSchema | null;
  gender?: EGenderType;
  dob?: Date;
  state?: string;
  city?: string;
  address?: string;
  bio?: string;
}

export interface IUserSchema extends IUserInput, Document {}
