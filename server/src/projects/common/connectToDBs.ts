import { MongoClient } from 'mongodb';
import { Client } from 'pg';
import * as mysql from 'mysql2/promise';
import { InternalServerErrorException } from '@nestjs/common';

type DbConfig = {
  name: string;
  host: string;
  port: number;
  dbType: 'mongodb' | 'postgres' | 'mysql' | 'cockroachdb';
  ssl: boolean;
  username: string;
  password: string;
};

export const connectToDBs = async (config: DbConfig) => {
  const { host, name, username, password, dbType, port } = config;

  try {
    if (dbType === 'mongodb') {
      const url = `mongodb+srv://${username}:${password}@${host}/${name}?retryWrites=true&w=majority`;

      const client = new MongoClient(url);
      await client.connect();
    }
    if (dbType === 'cockroachdb') {
      const client = new Client({
        user: username,
        host,
        database: name,
        password,
        port,
        ssl: {
          rejectUnauthorized: false,
        },
      });

      await client.connect();
    }
    if (dbType === 'postgres') {
      const url = `postgres://${username}:${password}@${host}:${port}/${name}`;

      const client = new Client({
        connectionString: url,
        ssl: {
          rejectUnauthorized: false,
        },
      });

      await client.connect();
    }
    if (dbType === 'mysql') {
      const connection = await mysql.createConnection({
        host,
        user: username,
        password,
        database: name,
        port,
        // ssl,
      });
      await connection.connect();
    }
  } catch (error) {
    console.log(error);

    throw new InternalServerErrorException(error.message);
  }
};
