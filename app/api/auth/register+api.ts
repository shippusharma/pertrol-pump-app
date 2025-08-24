import { connectToDatabase } from '@/configs';
import { CoreController } from '@/core';
import type { IUserSchema } from '@/model/types/user';
import { UserModel } from '@/model/user.mode';
import { errorResponse, internalErrorResponse, sendResponse } from '@/utils/response-handlers';
import { removeKeysFromPayload } from '@/utils/validate.utils';

export async function POST(req: Request, _res: Response) {
  try {
    const { role, name, email, phoneNumber, password } = await req.json();
    if (!role) return errorResponse(400, 'Role is required.');
    if (!name) return errorResponse(400, 'Name is required.');
    if (!email) return errorResponse(400, 'Email is required.');
    if (!phoneNumber) return errorResponse(400, 'Phone number is required.');
    if (!password) return errorResponse(400, 'Password is required.');

    await connectToDatabase();
    const oldUser = await UserModel.findOne({ $or: [{ email }, { phoneNumber }] }).exec();
    if (oldUser) return errorResponse(400, 'Email or phone number already available.');

    const payload = await UserModel.create({ role, name, email, phoneNumber, password });
    if (!payload) return errorResponse(400, `Registertation is failed.`);

    const coreController = new CoreController<IUserSchema>(UserModel);
    const { accessToken, refreshToken } = await coreController.tokens(payload);

    return sendResponse(201, 'Registertation successful.', {
      accessToken,
      refreshToken,
      payload: removeKeysFromPayload<IUserSchema>(payload),
    });
  } catch (error) {
    return internalErrorResponse(error);
  }
}
