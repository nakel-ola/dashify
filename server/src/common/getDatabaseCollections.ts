import { CockroachDatabase } from '../projects/common/cockroachdb';
import { MongoDatabase } from '../projects/common/mogodb';
import { MySQLDatabase } from '../projects/common/mysql';
import { PostgresDatabase } from '../projects/common/postgres';

type Args = {
  name: string;
  host: string;
  username: string;
  password: string;
  database: string;
  port: number;
};
export const getDatabaseCollections = async (args: Args) => {
  const { database, name, host, password, username, port } = args;

  const databaseConfig = { name, host, password, username, port };

  if (database === 'mongodb') {
    const mongodb = new MongoDatabase(databaseConfig);

    const results = await mongodb.getCollections();

    mongodb.close();

    return results;
  }

  if (database === 'postgres') {
    const postgres = new PostgresDatabase(databaseConfig);

    const results = await postgres.getTables();

    await postgres.close();

    return results;
  }

  if (database === 'cockroachdb') {
    const cockroachdb = new CockroachDatabase(databaseConfig);

    const results = await cockroachdb.getTables();

    await cockroachdb.close();

    return results;
  }

  if (database === 'mysql') {
    const mysql = new MySQLDatabase(databaseConfig);

    const results = await mysql.getTables(databaseConfig.name);

    await mysql.close();

    return results;
  }

  return null;
};
