import { IUserSchema } from '@/model/types/user';
import jwt from 'jsonwebtoken';
import { ETokenExpiration } from '../types/enums';

interface ITokens {
  accessToken: string;
  refreshToken: string;
}

class JWTHelper {
  constructor(
    private readonly accessTokenSecret: string,
    private readonly refreshTokenSecret: string
  ) {
    this.accessTokenSecret = accessTokenSecret;
    this.refreshTokenSecret = refreshTokenSecret;
  }

  static get jwt() {
    return jwt;
  }

  generateShortToken<T extends object>(payload: T, secret: string, expiresIn: jwt.SignOptions['expiresIn']): string {
    return jwt.sign(payload, `${secret}-${this.accessTokenSecret}`, { expiresIn });
  }

  verifyShortToken<T extends object>(token: string, secret: string): T | null {
    try {
      return jwt.verify(token, `${secret}-${this.accessTokenSecret}`) as T;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  //------------------------------------------------------------------------------------------

  private generateToken(
    { _id, role }: IUserSchema,
    secret: string,
    expiresIn: jwt.SignOptions['expiresIn']
  ): string {
    return jwt.sign({ _id, role, }, secret, { expiresIn });
  }

  private verifyToken(token: string, secret: string): IUserSchema | null {
    try {
      return jwt.verify(token, secret) as IUserSchema;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  //------------------------------------------------------------------------------------------

  generateAccessToken(payload: IUserSchema): string {
    return this.generateToken(payload, this.accessTokenSecret, ETokenExpiration.ACCESS);
  }

  verifyAccessToken(accessToken: string): IUserSchema | null {
    return this.verifyToken(accessToken, this.accessTokenSecret);
  }

  generateRefreshToken(payload: IUserSchema): string {
    return this.generateToken(payload, this.refreshTokenSecret, ETokenExpiration.REFRESH);
  }

  verifyRefreshToken(refreshToken: string): IUserSchema | null {
    return this.verifyToken(refreshToken, this.refreshTokenSecret);
  }

  generateAccessAndRefreshTokens(payload: IUserSchema): ITokens {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  verifyAccessAndRefreshTokens(
    accessToken: string,
    refreshToken: string
  ): { accessToken: IUserSchema | null; refreshToken: IUserSchema | null } {
    return {
      accessToken: this.verifyAccessToken(accessToken),
      refreshToken: this.verifyRefreshToken(refreshToken),
    };
  }
}

export const Jwt = new JWTHelper('accessTokenSecret', 'refreshTokenSecret')