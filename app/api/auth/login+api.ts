import { connectToDatabase } from '@/configs';
import { INVALID_CREDENTIAL } from '@/constants';
import { CoreController } from '@/core';
import { comparingHash } from '@/lib/hashing';
import type { IUserSchema } from '@/model/types/user';
import { UserModel } from '@/model/user.mode';
import { errorResponse, internalErrorResponse, sendResponse } from '@/utils/response-handlers';
import { removeKeysFromPayload } from '@/utils/validate.utils';
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.email().min(6).max(50).describe(''),
  phoneNumber: z.string().min(6).max(50).describe(''),
  password: z.string().min(1).describe('Password is required'),
});

export async function POST(req: Request, res: Response) {
  try {
    const { email, phoneNumber, password } = await req.json();
    if (!email || !phoneNumber) return errorResponse(400, `Email or phone number is required.`);
    if (!password) return errorResponse(400, `Password is required.`);

    await connectToDatabase();
    const payload = await UserModel.findOne({ $or: [{ email }, { phoneNumber }] }).exec();
    if (!payload) return errorResponse(400, INVALID_CREDENTIAL);
    // comparing password with hashpassword
    const isPasswordMatch = comparingHash(password, payload.password);
    if (!isPasswordMatch) return errorResponse(400, INVALID_CREDENTIAL);

    const coreController = new CoreController<IUserSchema>(UserModel);
    const { accessToken, refreshToken } = await coreController.tokens(payload);

    return sendResponse(200, 'Logged In', {
      accessToken,
      refreshToken,
      payload: removeKeysFromPayload<IUserSchema>(payload),
    });
  } catch (error) {
    return internalErrorResponse(error);
  }
}
