import { convertIntoHash } from '@/lib/hashing';
import { jwt } from '@/lib/jwt';
import { UserModel } from '@/model/user.mode';
import { errorResponse, internalErrorResponse, sendResponse } from '@/utils/response-handlers';

export async function POST(req: Request, res: Response) {
  try {
    const { jwtToken, password } = await req.json();
    if (!jwtToken) return errorResponse(400, `Invalid token`);
    if (!password) return errorResponse(400, `Password is required.`);

    const decodedToken = jwt.verifyShortToken<{ _id: string; hashOtp: string }>(jwtToken, 'reset-password');
    if (!decodedToken) return errorResponse(400, `Invalid token`);

    const hash = convertIntoHash(password); // Hashing password
    await UserModel.findByIdAndUpdate(decodedToken._id, { password: hash }, { new: true });

    return sendResponse(200, 'Password reset successful');
  } catch (error) {
    return internalErrorResponse(error);
  }
}
