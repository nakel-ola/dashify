import { Client } from 'pg';

interface Args {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  collectionName: string;
  limit: number;
  offset: number;
}

export const getPostgresTable = async (args: Args) => {
  const {
    host,
    name,
    username,
    port,
    password,
    collectionName,
    limit,
    offset,
  } = args;

  const client = new Client({
    user: username,
    host,
    database: name,
    password,
    port,
    ssl: true,
  });

  try {
    await client.connect();

    const schemaQuery = `SELECT * FROM ${client.escapeIdentifier(
      collectionName,
    )} LIMIT $1 OFFSET $2`;

    const schemaResult = await client.query(schemaQuery, [limit, offset]);

    return schemaResult.rows;
  } catch (e: any) {
    console.log('Error:', e);
  }
};
