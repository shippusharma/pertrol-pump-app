import { connectToDatabase } from '@/configs';
import { INVALID_CREDENTIAL } from '@/constants';
import { comparingHash, convertIntoHash } from '@/lib/hashing';
import { UserModel } from '@/model/user.mode';
import { errorResponse, internalErrorResponse, sendResponse } from '@/utils/response-handlers';
import { isValidObjectId } from 'mongoose';

export async function POST(req: Request, { userId }: Record<string, string>) {
  try {
    const { currentPassword, password } = await req.json();
    if (!userId || !isValidObjectId(userId)) return errorResponse(400, `User id is required.`);
    if (!currentPassword) return errorResponse(400, `Current password is required.`);
    if (!password) return errorResponse(400, `Password is required.`);
    if (currentPassword === password) return errorResponse(400, `Current password and password are same.`);

    await connectToDatabase();
    const payload = await UserModel.findById(userId);
    if (payload == null) return errorResponse(400, INVALID_CREDENTIAL);

    const isPasswordMatch = comparingHash(currentPassword, payload.password);
    if (!isPasswordMatch) return errorResponse(400, ``);

    const hash = convertIntoHash(password); // Hashing password
    await UserModel.findByIdAndUpdate(payload._id, { password: hash }, { new: true });

    return sendResponse(200, 'Password has been changed successfully!');
  } catch (error) {
    return internalErrorResponse(error);
  }
}
