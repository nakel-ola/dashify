type Tokens = {
  accessToken: string;
  refreshToken: string;
};

type UserType = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type Projects = {
  id: string;
  name: string;
  logo: string | null;
  projectId: string;
  database: string;
  users: UserType[];
  collections: Collection[];
  createdAt: Date;
  updatedAt: Date;
};

type DatabaseConfig = {
  host: string;
  name: string;
  password: string;
  port: number;
  username: string;
};

type Collection = {
  name: string;
  icon: string | null;
  fields: Fields[];
  widgets?: any[];
};

type Fields = {
  name: string;
  type: string;
};

declare global {
  declare module "next-auth" {
    interface Session {
      user: UserType & Tokens;
    }

    interface JWT {
      uid: string;
    }
  }
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_URL: string;
      NEXTAUTH_SECRET: string;
      NEXTAUTH_URL: string;
      BASE_URL: string;
    }
  }
}
