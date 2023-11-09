export type CreateProjectForm = {
  name: string;
  image: File | null;
  database: string;
  host: string;
  port: string;
  databaseName: string;
  username: string;
  password: string;
};
