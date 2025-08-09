import { CoreAuthToken } from '@/core';
import { jwt } from '@/lib/jwt';
import { AuthTokenModel } from '@/model/auth-token.model';
import { errorResponse, internalErrorResponse, sendResponse } from '@/utils/response-handlers';

// refresh-token through get new access and refresh tokens
export async function POST(req: Request, res: Request) {
  try {
    const { authorization: REFRESH_TOKEN } = await req.json();
    if (!REFRESH_TOKEN) return errorResponse(400, 'Refresh token is required.');

    const coreAuth = new CoreAuthToken();
    const refreshToken = coreAuth.tokenSpliter(REFRESH_TOKEN);
    if (!refreshToken) return errorResponse(401);

    const decoded = jwt.verifyRefreshToken(refreshToken);
    if (!decoded || decoded._id || !decoded.role) return errorResponse(401);

    const getToken = await AuthTokenModel.findOne({ refreshToken });
    if (getToken == null) return errorResponse(401, `Session terminated`, { isSessionTerminated: true });

    await coreAuth.deleteToken(refreshToken); // ? deleting old token
    const { accessToken, refreshToken: Refresh } = await coreAuth.tokens(decoded);

    return sendResponse(200, 'New Access-and-Refresh Tokens has been generated!', {
      accessToken,
      refreshToken: Refresh,
    });
  } catch (error) {
    return internalErrorResponse(error);
  }
}
