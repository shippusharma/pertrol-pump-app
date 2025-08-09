import { INVALID_CREDENTIAL } from '@/constants';
import { CoreAuthToken } from '@/core';
import { UserModel } from '@/model/user.mode';
import { errorResponse, internalErrorResponse, sendResponse } from '@/utils/response-handlers';

export async function DELETE(req: Request, res: Response) {
  try {
    const userId = '';
    // const { userId } = req.params; // Route parameter
    if (!userId) return errorResponse(400, `User id is required.`);

    const user = await UserModel.findById(userId);
    if (!user) return errorResponse(400, INVALID_CREDENTIAL);

    const coreAuth = new CoreAuthToken();
    const token = await coreAuth.deleteAllTokens(userId); // clearing all refresh-tokens
    if (token.deletedCount === 0) return sendResponse(200, 'You have already logged out from all devices');

    return sendResponse(200, 'Logged out from all devices');
  } catch (error) {
    return internalErrorResponse(error);
  }
}
