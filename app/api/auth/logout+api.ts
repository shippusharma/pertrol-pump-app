import { connectToDatabase } from '@/configs';
import { INVALID_CREDENTIAL } from '@/constants';
import { CoreAuthToken } from '@/core';
import { AuthTokenModel } from '@/model/auth-token.model';
import { UserModel } from '@/model/user.mode';
import { errorResponse, internalErrorResponse, sendResponse } from '@/utils/response-handlers';

export async function POST(req: Request, _res: Response) {
  try {
    const { authorization: REFRESH_TOKEN } = await req.json();
    if (!REFRESH_TOKEN) return errorResponse(400, 'Refresh token is required.');

    await connectToDatabase();
    const coreAuth = new CoreAuthToken();
    const refreshToken = coreAuth.tokenSpliter(REFRESH_TOKEN);
    if (!refreshToken) return errorResponse(401);

    const getToken = await AuthTokenModel.findOne({ refreshToken });
    if (!getToken) return errorResponse(401);

    const user = await UserModel.findById(getToken.userId);
    if (!user) return errorResponse(400, INVALID_CREDENTIAL);

    const token = await coreAuth.deleteToken(refreshToken); // ? clearing current refresh-token
    if (!token) return errorResponse(400, `Token not found, please login.`);

    return sendResponse(200, 'Logged Out');
  } catch (error) {
    return internalErrorResponse(error);
  }
}
