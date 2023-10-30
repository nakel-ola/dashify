export type CreateProjectForm = {
  name: string;
  database: string;
  host: string;
  port: number | null;
  databaseName: string;
  username: string;
  password: string;
};
