type Projects = {
  id: string;
  name: string;
  logo: string | null;
  projectId: string;
  database: string;
  members: Omit<
    UserType & { role: "administrator" | "editor" | "viewer" | "developer" },
    "accessToken" | "refreshToken"
  >[];
  collections: Collection[];
  corsOrigins: CorsOrigin[];
  databaseConfig: DatabaseConfig;
  tokens: Tokens[];
  createdAt: Date;
  updatedAt: Date;
};

type CorsOrigin = {
  id: string;
  origin: string;
  permission: "allow" | "block";
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
};

type Tokens = {
  id: string;
  name: string;
  permission: "editor" | "viewer";
  token: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
};

type DatabaseConfig = {
  host: string;
  name: string;
  dbType: string;
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
