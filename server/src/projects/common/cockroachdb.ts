import { Client, QueryResult } from 'pg';
import { getDataTypeGroup } from './utils';
import { Collection } from '../types/project.type';
import {
  PostgresQueryGenerator,
  type DataType,
  AlterModifyType,
} from './query-generatore/postgres';

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
type EditModifyTable = AlterModifyType & {
  type: 'modify';
};
type EditColumnTable = DataType & {
  type: 'add' | 'drop';
};

type EditTableArgs = {
  tableName: string;
  newTableName?: string;
  columns?: (EditModifyTable | EditColumnTable)[];
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

export class CockroachDatabase {
  private client: Client;
  private queryGen = new PostgresQueryGenerator();

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
    columns: DataType[],
  ): Promise<QueryResult> {
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
          SELECT column_name, data_type, udt_name, column_default, is_nullable, is_identity
          FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = $1;
        `;

        const columnKeyQuery = `
          SELECT ku.column_name, tc.constraint_type
          FROM information_schema.key_column_usage ku
          JOIN information_schema.table_constraints tc
            ON ku.table_name = tc.table_name
            AND ku.constraint_name = tc.constraint_name
          WHERE ku.table_name = $1;
        `;

        const schemaResult = await this.client.query<ColumnInfo>(schemaQuery, [
          tableName,
        ]);
        const columnKeyResult = await this.client.query<ColumnConstraintInfo>(
          columnKeyQuery,
          [tableName],
        );

        const tableSchema = schemaResult.rows;

        const tables = tableSchema.map((row) => {
          const dataType = row.data_type;

          const udtName = row.udt_name;

          const constraint = columnKeyResult.rows.find(
            (row) => row.column_name === row.column_name,
          );

          const isArray = dataType === 'ARRAY';

          return {
            name: row.column_name,
            type: getDataTypeGroup(dataType),
            dataType: isArray ? udtName.slice(1) : dataType,
            udtName,
            defaultValue: row.column_default,
            isNullable: this.convertToBool('row.is_nullable'),
            isIdentify: this.convertToBool('row.is_identity'),
            isArray,
            isPrimary: false,
            isUnique: false,
            ...this.formatConstraint(constraint),
          };
        });

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
    const { tableName, newTableName, columns = [] } = args;

    try {
      const escapeTableName = this.client.escapeIdentifier(tableName);

      let queries: string[] = [];

      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];

        if (column.type === 'modify') {
          queries = [
            ...queries,
            ...this.queryGen.alterModify(escapeTableName, column),
          ];
        } else {
          queries.push(
            this.queryGen.alterTable(escapeTableName, column.type, column),
          );
        }
      }

      if (newTableName) {
        const escapeNewTableName = this.client.escapeIdentifier(newTableName);

        queries.push(
          `ALTER TABLE ${escapeTableName} RENAME TO ${escapeNewTableName};`,
        );
      }

      const results = await this.runMultipleQueries(queries);

      return results;
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

  private async runMultipleQueries(queries: string[]) {
    const results: QueryResult<any>[] = [];
    for (const query of queries) {
      const result = await this.client.query(query);

      results.push(result);
    }

    return results;
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

  public async close(): Promise<void> {
    try {
      await this.client.end();
      console.log('Connection to CockroachDB database closed');
    } catch (error) {
      console.error('Error closing connection to CockroachDB database:', error);
    }
  }
}
