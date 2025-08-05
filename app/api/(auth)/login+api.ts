import { comparingHash } from '@/lib/hashing';
import { UserModel } from '@/model/user.mode';

export async function POST(req: Request, res: Response) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return Response.json({ message: 'Invalide creadentials', success: false, status: 400 });
    }

    const payload = await UserModel.findOne({ email }).exec();
    if (payload == null) return Response.json({ message: 'Invalide creadentials', success: false, status: 400 });
    // comparing password with hashpassword
    const isPasswordMatch = comparingHash(password, payload.password);
    if (!isPasswordMatch) return Response.json({ message: 'Invalide creadentials', success: false, status: 400 });

    // const { accessToken, refreshToken } = await this.tokens(req, res, payload);

    return Response.json({ message: 'Logged In', success: true, status: 200, payload: null });
  } catch (error) {
    return Response.json({ message: (error as Error).message ?? 'Internal server error', success: false, status: 500 });
  }
}
