import { Client, QueryResult } from 'pg';
import { getDataTypeGroup } from './utils';
import { Collection } from '../types/project.type';

interface ConnectionOption {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
}

type DuplicateTableArgs = {
  tableName: string;
  duplicateName: string;
  withData?: boolean;
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

export class CockroachDatabase {
  private client: Client;

  constructor(connectionOption: ConnectionOption) {
    this.connect(connectionOption);
  }

  private async connect(connectionOption: ConnectionOption) {
    const { host, name, username, port, password } = connectionOption;
    try {
      this.client = new Client({
        user: username,
        host,
        database: name,
        password,
        port,
        ssl: true,
      });

      this.client.connect();
    } catch (error) {
      console.error('Error connecting to Cockroach database:', error);

      throw error;
    }
  }

  public async createTable(
    tableName: string,
    columns: string[],
  ): Promise<QueryResult> {
    try {
      const newColumns =
        columns.length > 0 ? columns : ['id SERIAL PRIMARY KEY'];
      const escapeTableName = this.client.escapeIdentifier(tableName);
      const query = `CREATE TABLE IF NOT EXISTS ${escapeTableName} (${newColumns.join(
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
      const query = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'  -- Assuming you're using the public schema
        AND table_type = 'BASE TABLE';
     `;

      const results: Collection[] = [];

      const tableResult = await this.client.query(query);
      const tables = tableResult.rows.map((row) => row.table_name);

      for (const tableName of tables) {
        const schemaQuery = `
          SELECT column_name, data_type, udt_name, column_default
          FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = $1;
        `;

        const schemaResult = await this.client.query(schemaQuery, [tableName]);
        const tableSchema = schemaResult.rows;

        const tables = tableSchema.map((row) => ({
          name: row.column_name,
          type: getDataTypeGroup(row.data_type),
          dataType: row.data_type,
          udtName: row.udt_name,
          defaultValue: row.column_default,
        }));

        results.push({ name: tableName, icon: 'Settings', fields: tables });
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
      const query = `ALTER TABLE ${escapeTableName} RENAME TO ${escapeNewTableName}`;
      const result = await this.client.query(query);

      return result;
    } catch (error) {
      console.error(`Error updating table '${tableName}':`, error);
      throw error;
    }
  }

  public async duplicateTable(args: DuplicateTableArgs): Promise<QueryResult> {
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

  public async deleteTable(tableName: string): Promise<QueryResult> {
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

  public async close(): Promise<void> {
    try {
      await this.client.end();
      console.log('Connection to CockroachDB database closed');
    } catch (error) {
      console.error('Error closing connection to CockroachDB database:', error);
    }
  }
}
