import {
  ACCEPTED,
  ACCOUNT_LOCKED,
  BAD_GATEWAY,
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  FORBIDDEN,
  GATEWAY_TIMEOUT,
  INTERNAL_SERVER_ERROR,
  OK,
  ROUTE_NOT_FOUND,
  SERVICE_UNAVAILABLE,
  THROTTLING_ERROR,
  UNAUTHORIZED,
  URL_TOO_LONG,
} from '@/constants';

// Define a type for HTTP status codes
export type TErrorStatusCode = 400 | 401 | 403 | 404 | 409 | 414 | 423 | 429 | 500 | 502 | 503 | 504;
export type TSuccessStatusCode = 200 | 201 | 202;
export type THttpStatusCode = TSuccessStatusCode & TErrorStatusCode;

export type ResponseData<T = object> = T & {
  message: string;
  success: boolean;
  status: number;
};

//---------------------------------------------------------------------------------------------------------------

const errorMessages: Record<TErrorStatusCode, string> = {
  400: BAD_REQUEST,
  401: UNAUTHORIZED,
  403: FORBIDDEN,
  404: ROUTE_NOT_FOUND,
  409: CONFLICT,
  414: URL_TOO_LONG,
  423: ACCOUNT_LOCKED,
  429: THROTTLING_ERROR,
  500: INTERNAL_SERVER_ERROR,
  502: BAD_GATEWAY,
  503: SERVICE_UNAVAILABLE,
  504: GATEWAY_TIMEOUT,
};

const successMessages: Record<TSuccessStatusCode, string> = {
  200: OK,
  201: CREATED,
  202: ACCEPTED,
};

//----------------------------------------------------------------------------------------------------------------

export function internalErrorResponse<T extends object = object>(error: unknown, others?: T) {
  const errorMessage = error instanceof Error ? error.message : errorMessages[500];
  return Response.json({ message: errorMessage, success: false, status: 500, ...others }, { status: 500 });
}

export function errorResponse<T extends object = object>(status: TErrorStatusCode, message?: string, others?: T) {
  const errorMessage = message || errorMessages[status];
  return Response.json({ message: errorMessage, success: false, status, ...others }, { status });
}

export function sendResponse<T extends object = object>(status: TSuccessStatusCode, message?: string, others?: T) {
  const successMessage = message || successMessages[status];
  return Response.json({ message: successMessage, success: true, status, ...others }, { status });
}
