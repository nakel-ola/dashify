import { CreateProjectDto } from '../projects/dto/create-project.dto';
import { getCockroachdbTables } from './getCockroachdbTables';
import { getMongodbCollections } from './getMongodbCollections';
import { getMysqlTables } from './getMysqlTables';
import { getPostgresTables } from './getPostgresTables';

export const getDatabaseCollections = async (args: CreateProjectDto) => {
  const { database, databaseConfig } = args;
  if (database === 'mongodb')
    return await getMongodbCollections(databaseConfig);
  if (database === 'postgres') return await getPostgresTables(databaseConfig);
  if (database === 'mysql') return await getMysqlTables(databaseConfig);
  if (database === 'cockroachdb')
    return await getCockroachdbTables(databaseConfig);

  return null;
};
