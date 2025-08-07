import { comparingHash } from '@/lib/hashing';
import { UserModel } from '@/model/user.mode';
import { errorResponse, internalErrorResponse } from '@/utils/response-handlers';

export async function POST(req: Request, res: Response) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return errorResponse(400, 'Invalide creadentials');

    const payload = await UserModel.findOne({ email }).exec();
    if (payload == null) return errorResponse(400, 'Invalide creadentials');
    // comparing password with hashpassword
    const isPasswordMatch = comparingHash(password, payload.password);
    if (!isPasswordMatch) return errorResponse(400, 'Invalide creadentials');

    // const { accessToken, refreshToken } = await this.tokens(req, res, payload);

    return Response.json({ message: 'Logged In', success: true, status: 200, payload: null });
  } catch (error) {
    return internalErrorResponse(error);
  }
}
