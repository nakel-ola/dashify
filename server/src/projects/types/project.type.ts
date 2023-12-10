export type Member = {
  uid: string;
  role: 'administrator' | 'editor' | 'viewer';
};

export type Collection = {
  name: string;
  icon: string | null;
  fields: Fields[];
  widgets?: Widgets[];
};

export type Fields = {
  name: string;
  type: string;
};

export type Widgets = any;

export type DatabaseConfig = {
  name: string;
  host: string;
  port: string;
  dbType: 'mongodb' | 'postgres' | 'mysql' | 'cockroachdb';
  username: string;
  password: string;
};

export type ProjectType = {
  id: string;
  projectId: string;
  logo: string;
  name: string;
  members: Member[];
  database: 'mongodb' | 'postgres' | 'mysql' | 'cockroachdb';
  databaseConfig: DatabaseConfig;
  collections: Collection[];
  createdAt: Date;
  updatedAt: Date;
};
