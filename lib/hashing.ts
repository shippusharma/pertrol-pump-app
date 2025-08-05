import bcrypt from 'bcryptjs';

export const salt = bcrypt.genSaltSync(12);

export function convertIntoHash(originalValue: string): string {
  return bcrypt.hashSync(originalValue, salt);
}

export function comparingHash(originalValue: string, hashValue: string): boolean {
  return bcrypt.compareSync(originalValue, hashValue);
}
