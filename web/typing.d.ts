type Projects = {
  id: string;
  name: string;
  logo: string | null;
  projectId: string;
  database: string;
  members: UserType[];
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
