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
    const query = `SELECT * FROM ${mysql.escapeId(
      collectionName,
    )} LIMIT ? OFFSET ?`;

    const [rows] = await connection.execute(query, [limit, offset]);

    console.log('Selected rows:', rows);

    return rows;
  } catch (e: any) {
    console.error('Error:', e);
  } finally {
    await connection.end();
  }
};
