const AUTH_ENDPOINTS = {
  refresh: '/auth/refresh',
  logout: '/auth/logout',
  logoutAllDevices: '/auth/logout/all/devices/:userId',
  login: '/auth/login',
  loginByOtp: '/auth/login/by-otp',
  loginOtpOr2FAVerification: '/auth/login/:otp/verification',

  // ! all public-apis endpoints
  emailOrPhoneNumberVerificationViaToken: `/auth/email-or-phone-number/token/:token/verification`,
  emailOrPhoneNumberVerificationViaOtp: `/auth/email-or-phone-number/otp/:otp/verification`,
  otpVerification: `/auth/otp/:otp/verification`,
  referralVerification: `/auth/referral/:referral_code/verification`,
  forgotPassword: `/auth/forgot-password`,
  resetPasswordViaToken: `/auth/reset-password/token/:token`,
  resetPasswordViaOtp: `/auth/reset-password/otp/:otp`,
};

const USER_ENDPOINTS = {
  getAllUser: '/users',
  getAllAdmin: '/admins',
  getAllRoot: '/roots',
  signup: '/users/singup',

  get: `/users/:userId`,
  update: `/users/:userId/update`,
  delete: `/users/:userId`,
  activateOrDeactivate: `/users/:userId/activate-or-deactivate`,
  enabledOrDisable2FA: `/users/:userId/enabled-or-disable/2FA`,
  changeProfile: `/users/:userId/change/profile`,

  changePassword: `/users/:userId/change/password`,
  changeEmailOrPhoneNumber: `/users/:userId/change/email-or-phone-number`,
  verifyEmailViaTokenOrOtp: `/users/:userId/verify/email`, // query for -> otp or token
  verifyPhoneNumberViaTokenOrOtp: `/users/:userId/verify/phone-number`, // query for -> otp or token
  sendOtp: `/users/:userId/send/otp`,
};

export const endpoints = Object.freeze({
  home: '/',
  health: '/health',
  docs: '/api/docs',
  route_not_found: '*',

  auth: AUTH_ENDPOINTS,
  user: USER_ENDPOINTS,

  contactUs: {
    getAll: 'contact-us/data',
    get: '/contact-us/:contactUsId',
    create: '/contact-us/create',
    delete: '/contact-us/:contactUsId/delete',
    setSuccess: '/contact-us/:contactUsId/success',
  },
});
