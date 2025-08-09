import { INVALID_CREDENTIAL } from '@/constants';
import { convertIntoHash } from '@/lib/hashing';
import { jwt } from '@/lib/jwt';
import { UserModel } from '@/model/user.mode';
import { emailService } from '@/services/nodemailer';
import { generateOTP } from '@/utils/number.utils';
import { errorResponse, internalErrorResponse, sendResponse } from '@/utils/response-handlers';

export async function POST(req: Request, res: Response) {
  try {
    const { email, phoneNumber, password } = await req.json();
    if (!email || !phoneNumber) return errorResponse(400, `Email or phone number is required.`);
    if (!password) return errorResponse(400, `Password is required.`);

    const payload = await UserModel.findOne({ $or: [{ email }, { phoneNumber }] }).exec();
    if (!payload) return errorResponse(400, INVALID_CREDENTIAL);

    // generating jwt token
    const otp = generateOTP();
    const hashOtp = convertIntoHash(otp); // hash the otp
    const jwtToken = jwt.generateShortToken({ _id: payload._id, hashOtp }, 'reset-password', '10m');

    if (payload.email) {
      await emailService.send({
        to: payload.email,
        subject: ``,
        text: ``,
        html: `
        <h1>Forgot Password</h1>
        <p>otp : ${otp}</p>
        <p>url : https://admin.fitbattle.in/auth/reset-password?token=${jwtToken}</p>
        `,
      });
    }

    return sendResponse(200, `please, check your ${phoneNumber ? 'phone number' : 'email'}.`);
  } catch (error) {
    return internalErrorResponse(error);
  }
}
