import { Client } from 'pg';
import { Collection } from '../projects/types/collection.type';
import { getDataTypeGroup } from './getPostgresTables';

type Args = {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
};

export const getCockroachdbTables = async (
  args: Args,
): Promise<Collection[]> => {
  const { host, port, name, username, password } = args;

  const client = new Client({
    user: username,
    host,
    database: name,
    password,
    port,
    ssl: true,
  });

  const query = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'  -- Assuming you're using the public schema
    AND table_type = 'BASE TABLE';
  `;

  try {
    await client.connect();

    const results = [];

    const tableResult = await client.query(query);
    const tables = tableResult.rows.map((row) => row.table_name);

    for (const tableName of tables) {
      const schemaQuery = `
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = $1;
      `;

      const schemaResult = await client.query(schemaQuery, [tableName]);
      const tableSchema = schemaResult.rows;

      const tables = tableSchema.map((row) => ({
        name: row.column_name,
        type: getDataTypeGroup(row.data_type),
      }));

      results.push({ name: tableName, icon: 'Settings', fields: tables });
    }

    return results;
  } catch (e) {
    console.log('Error:', e);
  }
};
