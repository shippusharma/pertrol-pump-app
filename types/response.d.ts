export type TSort = 'asc' | 'desc';

//////////////////////////////////////////////////////////////////////////////////////////////////

export interface IMessageResponse {
  message: string;
  success: boolean;
  status: number;
}

export interface IPaginationsResponse {
  readonly page: number;
  readonly limit: number;
  readonly offset: number;
  readonly sortBy: string;
  readonly orderBy: TSort;
}

export interface ITokensResponse extends IMessageResponse {
  refreshToken: string;
  accessToken: string;
}

export interface IPayloadResponse<T> extends IMessageResponse {
  payload: T;
}

export interface IPayloadWithTokensResponse<T> extends IMessageResponse {
  payload: T;
  refreshToken: string;
  accessToken: string;
}

export interface IPayloadWithAccessTokenResponse<T> extends IMessageResponse {
  payload: T;
  accessToken: string;
}

export interface IAccessTokenResponse extends IMessageResponse {
  accessToken: string;
}

export interface IPaginationPayloadResponse<T> extends IMessageResponse {
  page: number;
  limit: number;
  counts: number;
  pages: number;
  payload: T[];
}
