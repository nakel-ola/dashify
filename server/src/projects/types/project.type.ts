export type Member = {
  uid: string;
  role: 'administrator' | 'editor' | 'viewer';
};

export type Collection = {
  name: string;
  icon: string | null;
  fields: Fields[];
};

export type Fields = {
  id: string;
  name: string;
  type: string;
  dataType?: string;
  udtName?: string;
  defaultValue?: string;
  isIdentify?: boolean;
  isNullable?: boolean;
  isPrimary?: boolean;
  isUnique?: boolean;
  isArray?: boolean;
  fields?: any[];
};

export type DatabaseConfig = {
  name: string;
  host: string;
  port: number;
  dbType: 'mongodb' | 'postgres' | 'mysql' | 'cockroachdb';
  username: string;
  password: string;
};

export type CorsOrigin = {
  id: string;
  origin: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Tokens = {
  id: string;
  name: string;
  permission: 'editor' | 'viewer';
  token: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InvitationType = {
  id: string;
  email: string;
  role: 'administrator' | 'editor' | 'viewer';
  token: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectType = {
  id: string;
  projectId: string;
  logo: string;
  name: string;
  corsOrigins: CorsOrigin[];
  members: Member[];
  database: 'mongodb' | 'postgres' | 'mysql' | 'cockroachdb';
  databaseConfig: DatabaseConfig;
  collections: Collection[];
  tokens: Tokens[];
  invitations: InvitationType[];
  createdAt: Date;
  updatedAt: Date;
};
