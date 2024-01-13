import { Client } from 'pg';
import { Collection, Fields } from '../types/project.type';
import { getDataTypeGroup } from './utils';
import {
  PostgresQueryGenerator,
  type DataType,
} from './query-generatore/postgres';

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
  udt_name: string;
  column_default: string;
  is_nullable: string;
  is_identity: string;
};
type ColumnConstraintInfo = {
  column_name: string;
  constraint_type: string;
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

  public async createTable(tableName: string, columns: DataType[]) {
    try {
      const queryGen = new PostgresQueryGenerator();
      const escapeTableName = this.client.escapeIdentifier(tableName);

      const tableQuery = queryGen.createTable(escapeTableName, columns);

      const result = await this.client.query(tableQuery);
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
        WHERE table_type = 'BASE TABLE' 
        AND table_schema = 'public';
      `;

      const tableResult = await this.client.query<TableInfo>(tableQuery);

      for (const tableInfo of tableResult.rows) {
        const schema = tableInfo.schema;
        const tableName = tableInfo.table_name;

        const columnQuery = `
          SELECT column_name, data_type, udt_name, column_default, is_nullable, is_identity
          FROM information_schema.columns
          WHERE table_schema = $1 AND table_name = $2
        `;
        const columnKeyQuery = `
          SELECT ku.column_name, tc.constraint_type
          FROM information_schema.key_column_usage ku
          JOIN information_schema.table_constraints tc
            ON ku.table_name = tc.table_name
            AND ku.constraint_name = tc.constraint_name
          WHERE ku.table_name = $1;
        `;

        // column_name, data_type, udt_name, column_default, is_nullable, is_identity
        const columnResult = await this.client.query<ColumnInfo>(columnQuery, [
          schema,
          tableName,
        ]);
        const columnKeyResult = await this.client.query<ColumnConstraintInfo>(
          columnKeyQuery,
          [tableName],
        );

        const fields: Fields[] = [];

        for (const columnInfo of columnResult.rows) {
          const dataType = columnInfo.data_type;

          const constraint = columnKeyResult.rows.find(
            (row) => row.column_name === columnInfo.column_name,
          );

          const isArray = dataType === 'ARRAY';

          fields.push({
            name: columnInfo.column_name,
            type: getDataTypeGroup(dataType),
            dataType: isArray ? columnInfo.udt_name.slice(1) : dataType,
            udtName: columnInfo.udt_name,
            defaultValue: columnInfo.column_default,
            isNullable: this.convertToBool(columnInfo.is_nullable),
            isIdentify: this.convertToBool(columnInfo.is_identity),
            isArray,
            isPrimary: false,
            isUnique: false,
            ...this.formatConstraint(constraint),
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

  private formatConstraint(contraint: ColumnConstraintInfo) {
    if (!contraint) return {};
    if (contraint.constraint_type === 'PRIMARY KEY') return { isPrimary: true };
    if (contraint.constraint_type === 'UNIQUE') return { isUnique: true };

    return {};
  }

  private convertToBool(value: string) {
    if (value.toLowerCase() === 'no') return false;
    if (value.toLowerCase() === 'yes') return true;
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
