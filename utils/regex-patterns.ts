export const MONGODB_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export const INDIAN_PHONE_REGEX = /^91[1-9]\d{9}$/;

export const PHONE_REGEX = /^(\([0-9]{3}\)|[0-9]{3})[-.]?[0-9]{3}[-.]?[0-9]{4}$/;

export const USERNAME_REGEX = /^(?=.{6,40}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

export const EMAIL_REGEX =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

export const PASSWORD_REGEX =
  /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[=!@#$%^&*()\-__+.]){1,}).{8,}$/;

export const DOB_REGEX = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

export const DOMAIN_NAME_REGEX = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
