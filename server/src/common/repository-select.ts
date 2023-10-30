import { UserType } from '../users/types/user.type';

export const userSelect: (keyof UserType)[] = [
  'id',
  'createdAt',
  'email',
  'emailVerified',
  'firstName',
  'lastName',
  'photoUrl',
  'uid',
  'updatedAt',
];
