export const TWO_FACTOR_ENABLED = '2FA required!'; // 400

export const ACCOUNT_NOT_ACTIVATED = 'Forbidden, Account is not activated!'; // 403

export const ORGANIZATION_NOT_ACTIVATED = 'Forbidden, Orgnization is not activated, yet!'; // 403

// ----------------------------------------------------------------------------------------------------------------------------------

export const UNAUTHORIZED = 'Unauthorized, access is denied due to invalid token or token has expired!'; // 401

export const FORBIDDEN = 'Forbidden, do not have a permission to access this resource!'; // 403

export const ROUTE_NOT_FOUND = 'Route Not Found!'; // 404

export const INTERNAL_SERVER_ERROR = 'Internal Server Error!'; // 500

export const INVALID_CREDENTIAL = 'Invalid Credential!'; // 400

export const INVALID_ROLE = 'Invalid Role!'; // 400

export const INVALID_ADMIN = 'Invalid Admin!'; // 400

export const INVALID_SUPER_ADMIN = 'Invalid Super Admin!'; // 400

export const BAD_REQUEST = 'Bad Request, Something Went Wrong!'; // 400

export const INVALID_TOKENS = 'Access and Refresh Tokens are not generated, yet!';

export const CONFLICT = 'Conflict, that is older than the existing one on the server';

export const URL_TOO_LONG =
  'URI Too Long, the URI requested by the client is longer than the server is willing to interpret.';

export const ACCOUNT_LOCKED = 'Account locked due to multiple failed attempts. Try again later.';

export const THROTTLING_ERROR =
  'The server is processing too many requests at once and is unable to process your request. Retry the request after some time.';

export const BAD_GATEWAY =
  'This error response means that the server got an invalid response while working as a gateway to get a response needed to handle the request.';

export const SERVICE_UNAVAILABLE =
  'The server is not ready to handle the request. Common causes are a server that is down for maintenance or is overloaded.';

export const GATEWAY_TIMEOUT =
  'This error response is given when the server acts as a gateway and cannot get a timely response.';

// ----------------------------------------------------------------------------------------------------------------------------------

export const OK = 'OK, Successfull Response.'; // 200

export const CREATED = 'Created, The request succeeded, and a new resource was created.'; // 201

export const ACCEPTED = 'Accepted, The request has been received but not yet acted upon.'; // 202
