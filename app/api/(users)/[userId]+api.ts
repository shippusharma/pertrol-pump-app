import { INVALID_CREDENTIAL } from '@/constants';
import { IUserSchema } from '@/model/types/user';
import { UserModel } from '@/model/user.mode';
import { errorResponse, internalErrorResponse, sendResponse } from '@/utils/response-handlers';
import { removeKeysFromPayload } from '@/utils/validate.utils';

export async function GET(req: Request, res: Response) {
  try {
    const userId = '';
    // const { userId } = req.params;
    if (!userId) return errorResponse(400, `User id is required.`);

    const payload = await UserModel.findById(userId);
    if (payload == null) return errorResponse(400, INVALID_CREDENTIAL);

    return sendResponse(200, 'User details', { payload: removeKeysFromPayload<IUserSchema>(payload) });
  } catch (error) {
    return internalErrorResponse(error);
  }
}
