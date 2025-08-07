import { Jwt as jwt } from '@/lib/jwt';
import { AuthTokenModel } from '@/model/auth-token.model';
import { IAuthTokenSchema } from '@/model/types/auth-token';
import { IUserSchema } from '@/model/types/user';
import { ETokenExpiration } from '@/types/enums';

interface ITokens {
  accessToken: string;
  refreshToken: string;
}

class CoreAuthToken {
  private readonly accessTokenKey: string;
  private readonly refreshTokenKey: string;

  constructor() {
    this.accessTokenKey = 'accessToken';
    this.refreshTokenKey = 'refreshToken';
  }

  // Finds a valid refresh token for a given user ID and refresh token value. Only returns a token if it has not expired.
  protected readonly indValidRefreshToken = async (
    userId: string,
    refreshToken: string
  ): Promise<IAuthTokenSchema | null> => {
    const token = await AuthTokenModel.findOne({ userId, refreshToken, expiresAt: { $gt: new Date() } }).exec();
    return token ?? null; // Only find tokens with future expiration dates
  };

  // Invalidates (deletes) all tokens associated with a specific user ID.
  protected readonly invalidateTokens = async (userId: string): Promise<void> => {
    await AuthTokenModel.deleteMany({ userId }).exec(); // Deletes all tokens for the user
  };

  // Cleans up all expired tokens from the database.
  protected readonly cleanupExpiredTokens = async (): Promise<void> => {
    await AuthTokenModel.deleteMany({ expiresAt: { $lte: new Date() } }).exec(); // Deletes expired tokens
  };

  // Set the expiration date (e.g., 7 days from now)
  protected readonly expireDate = (expiresInSeconds = ETokenExpiration.REFRESH): Date => {
    const time = expiresInSeconds * 1000;
    return new Date(new Date().getTime() + time);
  };

  /**
   **-----------------------------------------------
   *!    JWT : Authentication and Authorization
   **-----------------------------------------------
   */

  protected readonly accessToken = (res: Response, payload: IUserSchema): string => {
    const accessToken = jwt.generateAccessToken(payload);
    return accessToken;
  };

  protected readonly refreshToken = (res: Response, payload: IUserSchema): string => {
    const refreshToken = jwt.generateRefreshToken(payload);
    return refreshToken;
  };

  protected readonly tokens = async (req: Request, res: Response, payload: IUserSchema): Promise<ITokens> => {
    const { accessToken, refreshToken } = jwt.generateAccessAndRefreshTokens(payload);
    // Set the expiration date (e.g., 7 days from now)
    const expiresAt = new Date(new Date().getTime() + ETokenExpiration.REFRESH * 1000);
    await AuthTokenModel.create({
      userId: payload._id,
      refreshToken,
      expiresAt,
      ip: '0.0.0.0',
      userAgent: 'unknown',
      // ip: req.ip ?? '0.0.0.0',
      // userAgent: req.headers['user-agent'] ?? 'unknown',
    });
    return { accessToken, refreshToken };
  };
}

export default CoreAuthToken;
