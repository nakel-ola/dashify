import * as mysql from 'mysql2/promise';

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

export const getMysqlTable = async (args: Args) => {
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
  // Create a MySQL connection
  const connection = await mysql.createConnection({
    host,
    user: username,
    password,
    database: name,
    port,
  });

  try {
    const tableName = mysql.escapeId(collectionName);
    const query = `SELECT * FROM ${tableName} LIMIT ? OFFSET ?`;
    const countQuery = `SELECT COUNT(*) AS totalCount FROM ${tableName};`;

    const [rows] = await connection.execute(query, [limit, offset]);
    const data = await connection.query(countQuery);

    console.log('Selected rows:', data);

    return { results: rows, totalItems: (data[0] as any).totalCount };
  } catch (e: any) {
    console.error('Error:', e);
  } finally {
    await connection.end();
  }
};
