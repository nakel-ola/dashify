import { Client } from 'pg';
import { Collection, Fields } from '../types/collection.type';
import { getDataTypeGroup } from './utils';

interface ConnectionOption {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
}

type TableInfo = {
  schema: string;
  table_name: string;
};

type ColumnInfo = {
  column_name: string;
  data_type: string;
};

type GetTableArgs = {
  tableName: string;
  offset: number;
  limit: number;
};

type EditTableArgs = {
  tableName: string;
  newTableName: string;
};

type DuplicateTableArgs = {
  tableName: string;
  duplicateName: string;
  withData?: boolean;
};

export class PostgresDatabase {
  private client: Client;

  constructor(connectionOption: ConnectionOption) {
    const { host, name, username, port, password } = connectionOption;

    const databaseUrl = `postgres://${username}:${password}@${host}:${port}/${name}`;

    this.client = new Client({
      connectionString: databaseUrl,
    });

    this.connect();
  }

  private async connect() {
    try {
      await this.client.connect();
    } catch (error) {
      console.error('Error connecting to PostgreSQL database:', error);
    }
  }

  // TODO: Colums still need to be worked on;
  public async createTable(tableName: string, columns: string[]) {
    try {
      const escapeTableName = this.client.escapeIdentifier(tableName);

      const query = `CREATE TABLE IF NOT EXISTS ${escapeTableName} (${columns.join(
        ', ',
      )});`;
      const result = await this.client.query(query);
      return result;
    } catch (error) {
      console.error(`Error creating table "${tableName}":`, error);
      throw error;
    }
  }

  public async getTables() {
    try {
      const results: Collection[] = [];

      const tableQuery = `
          SELECT table_schema AS schema, table_name
          FROM information_schema.tables
          WHERE table_type = 'BASE TABLE' AND table_schema NOT IN ('pg_catalog', 'information_schema')
        `;

      const tableResult = await this.client.query<TableInfo>(tableQuery);

      for (const tableInfo of tableResult.rows) {
        const schema = tableInfo.schema;
        const tableName = tableInfo.table_name;

        const columnQuery = `
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_schema = $1 AND table_name = $2
          `;
        const columnResult = await this.client.query<ColumnInfo>(columnQuery, [
          schema,
          tableName,
        ]);

        const fields: Fields[] = [];

        for (const columnInfo of columnResult.rows) {
          const dataType = columnInfo.data_type;

          fields.push({
            name: columnInfo.column_name,
            type: getDataTypeGroup(dataType),
          });
        }

        results.push({ name: tableName, icon: 'Settings', fields });
      }

      return results;
    } catch (error) {
      console.error(`Error getting tables:`, error);
      throw error;
    }
  }

  public async getTable(args: GetTableArgs) {
    const { tableName, limit, offset } = args;
    try {
      const escapeTableName = this.client.escapeIdentifier(tableName);

      const schemaQuery = `SELECT * FROM ${escapeTableName} LIMIT $1 OFFSET $2`;
      const countQuery = `SELECT COUNT(*) FROM ${escapeTableName};`;

      const schemaResult = await this.client.query(schemaQuery, [
        limit,
        offset,
      ]);
      const totalItems = await this.client.query(countQuery);

      return {
        results: schemaResult.rows,
        totalItems: totalItems.rows[0].count,
      };
    } catch (error) {
      console.error(`Error getting table '${tableName}':`, error);
      throw error;
    }
  }

  public async editTable(args: EditTableArgs) {
    const { tableName, newTableName } = args;

    try {
      const escapeTableName = this.client.escapeIdentifier(tableName);
      const escapeNewTableName = this.client.escapeIdentifier(newTableName);
      const query = `ALTER TABLE ${escapeTableName} RENAME TO ${escapeNewTableName};`;

      const result = await this.client.query(query);

      return result;
    } catch (error) {
      console.error(`Error updating table '${tableName}':`, error);
      throw error;
    }
  }

  public async duplicateTable(args: DuplicateTableArgs) {
    const { tableName, duplicateName } = args;

    try {
      const escapeTableName = this.client.escapeIdentifier(tableName);
      const escapeNewTableName = this.client.escapeIdentifier(duplicateName);
      const query = `CREATE TABLE IF NOT EXISTS ${escapeNewTableName} AS TABLE ${escapeTableName} WITH NO DATA;`;

      const result = await this.client.query(query);
      return result;
    } catch (error) {
      console.error(
        `Error duplicating table '${tableName}' to '${duplicateName}':`,
        error,
      );
      throw error;
    }
  }

  public async deleteTable(tableName: string) {
    try {
      const escapeTableName = this.client.escapeIdentifier(tableName);

      const query = `DROP TABLE IF EXISTS ${escapeTableName};`;
      const result = await this.client.query(query);
      return result;
    } catch (error) {
      console.error(`Error deleting table "${tableName}":`, error);
      throw error;
    }
  }

  public async close() {
    try {
      await this.client.end();
      console.log('Connection to PostgreSQL database closed');
    } catch (error) {
      console.error('Error closing connection to PostgreSQL database:', error);
    }
  }
}
