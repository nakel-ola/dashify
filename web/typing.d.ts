type Projects = {
  id: string;
  name: string;
  logo: string | null;
  projectId: string;
  database: "mongodb" | "postgres" | "mysql" | "cockroachdb";
  members: Omit<
    UserType & { role: "administrator" | "editor" | "viewer" | "developer" },
    "accessToken" | "refreshToken"
  >[];
  collections: Collection[];
  corsOrigins: CorsOrigin[];
  databaseConfig: DatabaseConfig;
  tokens: Tokens[];
  invitations: InvitationType[];
  createdAt: Date;
  updatedAt: Date;
};

type InvitationType = {
  id: string;
  email: string;
  role: "administrator" | "editor" | "viewer";
  token: string;
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
  dbType: "mongodb" | "postgres" | "mysql" | "cockroachdb";
  password: string;
  port: number;
  ssl: boolean;
  username: string;
};

type Collection = {
  name: string;
  icon: string | null;
  fields: Fields[];
  widgets?: any[];
};

type Fields = {
  id: string;
  name: string;
  type: string;
  dataType: string;
  udtName: string;
  defaultValue: string;
  isIdentify: boolean;
  isNullable: boolean;
  isPrimary: boolean;
  isUnique: boolean;
  isArray: boolean;
  fields: any[];
};

type ModifyOperation = (
  | "RENAME"
  | "TYPE"
  | "ADD DEFAULT"
  | "REMOVE DEFAULT"
  | "ADD NOT NULL"
  | "REMOVE NOT NULL"
  | "ADD FOREIGN KEY"
  | "REMOVE FOREIGN KEY"
  | "UPDATE FOREIGN KEY"
)[];
