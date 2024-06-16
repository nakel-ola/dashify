export type UserType = {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string;
  emailVerified: boolean;
  providers: ('EMAIL' | 'GOOGLE')[];
  password: string;
  createdAt: Date;
  updatedAt: Date;
};
