import { connectToDatabase } from '@/configs';
import { INVALID_CREDENTIAL } from '@/constants';
import { UserModel } from '@/model/user.mode';
import { errorResponse, internalErrorResponse, sendResponse } from '@/utils/response-handlers';

export async function POST(req: Request, res: Response) {
  try {
    const { email, phoneNumber, password } = await req.json();
    if (!email || !phoneNumber) return errorResponse(400, `Email or phone number is required.`);
    if (!password) return errorResponse(400, `Password is required.`);

    await connectToDatabase();
    const payload = await UserModel.findOne({ $or: [{ email }, { phoneNumber }] }).exec();
    if (!payload) return errorResponse(400, INVALID_CREDENTIAL);

    return sendResponse(200, 'OTP sended successful, use this otp to login.');
  } catch (error) {
    return internalErrorResponse(error);
  }
}
