import { connectToDatabase } from '@/configs';
import { INVALID_CREDENTIAL } from '@/constants';
import { IUserSchema } from '@/model/types/user';
import { UserModel } from '@/model/user.mode';
import { errorResponse, internalErrorResponse, sendResponse } from '@/utils/response-handlers';
import { removeKeysFromPayload } from '@/utils/validate.utils';
import { isValidObjectId } from 'mongoose';

export async function GET(req: Request, { userId }: Record<string, string>) {
  try {
    if (!userId || !isValidObjectId(userId)) return errorResponse(400, `User id is required.`);

    await connectToDatabase();
    const payload = await UserModel.findById(userId);
    if (payload == null) return errorResponse(400, INVALID_CREDENTIAL);

    return sendResponse(200, 'User details', { payload: removeKeysFromPayload<IUserSchema>(payload) });
  } catch (error) {
    return internalErrorResponse(error);
  }
}
