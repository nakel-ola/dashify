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

export const getCockroachdbTable = async (args: Args) => {
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

    const tableName = client.escapeIdentifier(collectionName);

    const schemaQuery = `SELECT * FROM ${tableName} LIMIT $1 OFFSET $2`;

    const countQuery = `SELECT COUNT(*) FROM ${tableName};`;

    const schemaResult = await client.query(schemaQuery, [limit, offset]);
    const totalItems = await client.query(countQuery);

    return { results: schemaResult.rows, totalItems: totalItems.rows[0].count };
  } catch (e) {
    console.log('Error:', e);
  }
};
