declare global {
  declare module "next-auth" {
    interface Session {
      user: UserType;
    }

    interface JWT {
      uid: string;
    }
  }
}

interface UserType {
  id: string;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  photoUrl: string;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
  accessToken: string;
  refreshToken: string;
}
