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
  email: string;
  emailVerified: boolean;
  accessToken: string;
  refreshToken: string;
}
