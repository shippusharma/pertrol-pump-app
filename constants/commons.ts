import { EGenderType } from '@/types/enums';

/**
 **-----------------------------------------------
 *!              Others
 **-----------------------------------------------
 */

export const USERNAME =
  'Username must be 6-40 characters long, cannot start or end with an underscore or period, and cannot have consecutive underscores or periods.';

export const EMAIL_PHONE = 'please provide either phone number or an email!';

export const EMAIL_PHONE_EXISTS = 'Either email or phone number already exist!';

export const DNF = 'Data Not Found!';

export const WRONG_OTP = 'Wrong OTP!';

export const CREATE_OTP = 'You have to generate OTP, first!';

export const MUST_VERIFIED = 'Verification required for this action!';

export const GENERATED_REFERRAL = 'You have to Generated Referral, first!';

export const INVALID_REFERRAL = 'Invalid Referral!';

export const INVALID_OTP = 'Invalid OTP!';

export const INVALID_DOB = 'Invalid date of birth, Ensures the person is at least 18 years old.';

export const INVALID_GENDER = `Invalid EGenderType, please use one option in ${Object.values(EGenderType)}`;

/**
 **-----------------------------------------------
 *!              Password and Related
 **-----------------------------------------------
 */

export const PASSWORD =
  'Please provide correct password in this Formate : <Example@123> | <Atleast one-CapitalLetter, one-SmallLetter, one-Special-Character, One-Number and Your password Length should be 8-digits>';

export const CONFIRM_PASSWORD_NOT_MATCH = 'Password and Confirm-Password are Not Match!';

export const CURRENT_PASSWORD_NEW_PASSWORD = 'New password is same as current password!';

export const INVALID_CURRENT_PASSWORD = 'Invalid Current Password!';

export const INVALID_PASSWORD = 'Invalid Password!';

export const INVALID_RESET_PASSWORD = 'Invalid attempt to Reset Password!';

export const INVALID_ATTEMPT_PASSWORD = 'Invalid attempt to Reset Password, please do forgot password first.';

export const INVALID_PASSWORD_TOKEN = 'Invalid password Token!';

export const IS_PASSWORD_VERIFIED = 'please, verify your password first.';

/**
 **-----------------------------------------------
 *!              Payment and Related
 **-----------------------------------------------
 */

export const INVALID_SIGNATURE = 'Invalid Signature!';

export const PAYMENT_FAILED = 'Not able to create Order. Please try again!';

/**
 **-----------------------------------------------
 *!              Orgnization and Related
 **-----------------------------------------------
 */

export const ORGANIZATION_LOGO = 'Organization logo is requried!';

export const INVALID_ORGANIZATION = 'Orgnization does not exist!';

export const ORGANIZATION_EXIST = 'Orgnization already exist!';

/**
 **-----------------------------------------------
 *!              Department And Designation
 **-----------------------------------------------
 */

export const INVALID_DEPARTMENT = 'Department does not exist!';

export const DEPARTMENT_EXIST = 'Department already exist!';

export const INVALID_DESIGNATION = 'Designation does not exist!';

export const DESIGNATION_EXIST = 'Designation already exist!';

/**
 **-----------------------------------------------
 *!              ERoleType and Permission
 **-----------------------------------------------
 */

export const INVALID_ROLETYPE = 'ERoleType and Permission does not exist!';

/**
 **-----------------------------------------------
 *!              Employee and Related
 **-----------------------------------------------
 */

export const INVALID_EMPLOYEE = 'Employee does not exist!';
